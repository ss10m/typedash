import { nanoid } from "nanoid";

import { STATE, ROUND } from "../util/constants.js";

import { generateQuote, saveScores } from "../controllers/room.js";

import AdjustingTicker from "./adjustingTicker.js";

export class Room {
    static count = 0;
    static idToRoom = {};
    static socketIdToRoom = {};

    constructor(io) {
        this.io = io;
        this.id = nanoid(7);
        this.state = { current: STATE.PREGAME };
        this.name = this.generateName();
        this.players = {};
        this.spectators = {};
        this.quote = null;
        this.finished = 0;
        Room.count += 1;
        Room.idToRoom[this.id] = this;
    }

    async createRoom(socketId) {
        const socket = this.io.sockets.connected[socketId];
        if (!socket) return;
        this.quote = await generateQuote();
        socket.emit("room-created", this.id);
        this.io.in("lobby").emit("rooms", Room.getRooms());
    }

    generateName() {
        const nameGenerator = (id) => {
            let current = String.fromCharCode(65 + (id % 26));
            if (id >= 26) {
                return nameGenerator(Math.floor(id / 26) - 1) + current;
            } else {
                return current;
            }
        };
        return "ROOM " + nameGenerator(Room.count);
    }

    updateClients(key, data) {
        this.io.in(this.id).emit(key, data);
    }

    join(socketId) {
        const socket = this.io.sockets.connected[socketId];
        if (!socket) return;

        const { id, displayName } = socket.handshake.session.user;

        socket.join(this.id);
        Room.socketIdToRoom[socketId] = this;

        const roomData = {
            room: { id: this.id, name: this.name },
            state: { current: this.state.current },
            quote: this.quote,
        };

        if (this.players[socketId]) {
            const player = this.players[socketId];
            player.leftRoom = false;

            switch (this.state.current) {
                case STATE.COUNTDOWN:
                    const countdownDiff =
                        this.state.countdown - (Date.now() - this.state.startTime);
                    if (countdownDiff > 2000) roomData.state.countdown = countdownDiff;
                    break;
                case STATE.PLAYING:
                    const timerDiff = this.state.timer - (Date.now() - this.state.startTime);
                    if (timerDiff > 2000) {
                        roomData.state.timer = timerDiff;
                    }
                    if (player.stats.wordIndex) {
                        roomData.state.wordIndex = player.stats.wordIndex;
                    }
                    break;
                default:
                    break;
            }
        } else {
            let player = {
                id,
                socketId,
                username: displayName,
                isReady: false,
                leftRoom: false,
                stats: {
                    progress: 0,
                    wordIndex: 0,
                    wpm: null,
                    accuracy: null,
                    totalTime: null,
                    position: null,
                },
            };
            switch (this.state.current) {
                case STATE.PREGAME:
                    this.players[socketId] = player;
                    break;
                case STATE.COUNTDOWN:
                    this.players[socketId] = player;
                    const countdownDiff =
                        this.state.countdown - (Date.now() - this.state.startTime);
                    if (countdownDiff > 2000) roomData.state.countdown = countdownDiff;
                    break;
                case STATE.PLAYING:
                    this.spectators[socketId] = {
                        username: displayName,
                        id,
                        socketId,
                        playNext: false,
                    };
                    const timerDiff = this.state.timer - (Date.now() - this.state.startTime);
                    if (timerDiff > 2000) roomData.state.timer = timerDiff;
                    roomData.isSpectating = true;
                    break;
                case STATE.POSTGAME:
                    this.spectators[socketId] = {
                        username: displayName,
                        id,
                        socketId,
                        playNext: false,
                    };
                    roomData.isSpectating = true;
                    break;
                default:
                    break;
            }
        }

        roomData.players = this.getPlayers();
        roomData.spectators = this.getSpectators();
        socket.emit("updated-room", roomData);
        this.checkStateChange();
    }

    leave(socket) {
        const socketId = socket.id;
        socket.leave(this.id);
        delete Room.socketIdToRoom[socketId];

        if (this.players[socketId]) {
            if ([STATE.PREGAME, STATE.COUNTDOWN].includes(this.state.current)) {
                delete this.players[socketId];
            } else {
                const player = this.players[socketId];
                player.leftRoom = true;
                if (!player.stats.position) {
                    player.stats = {
                        progress: 0,
                        wordIndex: 0,
                        wpm: null,
                        accuracy: null,
                        totalTime: null,
                        position: "DNF",
                    };
                }
            }
        } else if (this.spectators[socketId]) {
            delete this.spectators[socketId];
        }

        if (!this.getNumOfUsers()) {
            if (this.countdown) clearTimeout(this.countdown);
            if (this.ticker) this.ticker.clear();
            if (this.state.current === STATE.PLAYING) this.generateScores();
            delete Room.idToRoom[this.id];
            if (!Object.keys(Room.idToRoom).length) Room.count = 0;
            return this.io.in("lobby").emit("rooms", Room.getRooms());
        }

        if (
            !this.getPlayers().filter((player) => !player.leftRoom).length &&
            this.getSpectators().length &&
            this.state.current === STATE.PLAYING
        ) {
            if (this.ticker) this.ticker.clear();
            this.generateScores();
            this.state = { current: STATE.POSTGAME };
            this.startNextRound();
        }

        this.checkStateChange();
    }

    isCompleted() {
        return (
            this.state.current === STATE.PLAYING &&
            Object.values(this.players)
                .filter((player) => !player.leftRoom)
                .every((player) => player.stats.position)
        );
    }

    startCountdown(updatedState) {
        if (this.state.current !== STATE.PREGAME) return;
        const newState = { current: STATE.COUNTDOWN, countdown: ROUND.COUNTDOWN };
        this.state = { ...newState, startTime: Date.now() };
        this.updateClients("updated-room", { ...updatedState, state: newState });

        const onSuccess = () => {
            this.state = { current: STATE.PLAYING, timer: ROUND.TIME, startTime: Date.now() };

            const onStep = (steps) => {
                //console.log(`${steps}/${ROUND.TIME / 500}`);
            };
            const onSuccess = () => {
                this.endRound();
            };

            this.ticker = new AdjustingTicker(500, ROUND.TIME / 500, onStep, onSuccess);
            this.ticker.start();

            this.getPlayers().forEach((player) => (player.isReady = false));

            const updatedState = {
                isRunning: true,
                isReady: false,
                state: { current: STATE.PLAYING, timer: ROUND.TIME },
                players: this.getPlayers(),
            };
            this.updateClients("updated-room", updatedState);
        };
        this.countdown = setTimeout(onSuccess, ROUND.COUNTDOWN);
    }

    cancelCountdown() {
        if (this.state.current !== STATE.COUNTDOWN) return;
        if (this.countdown) clearTimeout(this.countdown);
        this.state = { current: STATE.PREGAME };
        const updatedState = {};
        updatedState.state = this.state;
        updatedState.players = this.getPlayers();
        updatedState.spectators = this.getSpectators();
        this.updateClients("updated-room", updatedState);
    }

    updateProgress(socketId, data) {
        const player = this.players[socketId];
        if (!player) return;

        const progress = data.progress / this.quote.length;
        player.stats.wordIndex = data.progress;
        player.stats.progress = Math.round(progress * 100);
        const time = new Date() - this.state.startTime;
        const wpm = Math.round(player.stats.wordIndex / (time / (1000 * 60)));
        player.stats.wpm = wpm;

        if (data.progress === this.quote.length) {
            player.stats.position = this.getPosition();
            player.stats.totalTime = time;
            player.stats.accuracy = data.accuracy;
            if (this.isCompleted()) return this.endRound();
        }

        const updatedState = {};
        updatedState.players = this.getPlayers();
        this.updateClients("updated-room", updatedState);
    }

    async startNextRound() {
        if (this.state.current !== STATE.POSTGAME) return;
        this.state = { current: STATE.PREGAME };
        this.finished = 0;

        // reset current players, remove players that left room
        this.getPlayers().forEach((player) => {
            if (player.leftRoom) {
                delete this.players[player.socketId];
            } else {
                player.leftRoom = false;
                player.stats = {
                    progress: 0,
                    wordIndex: 0,
                    wpm: null,
                    accuracy: null,
                    totalTime: null,
                    position: null,
                };
            }
        });

        // move spectators with playNext flag to players
        const switchedIds = [];
        this.getSpectators()
            .filter((spectator) => spectator.playNext)
            .forEach((spectator) => {
                const { id, socketId, username } = spectator;
                this.players[socketId] = {
                    id,
                    socketId,
                    username,
                    isReady: false,
                    leftRoom: false,
                    stats: {
                        progress: 0,
                        wordIndex: 0,
                        wpm: null,
                        accuracy: null,
                        totalTime: null,
                        position: null,
                    },
                };
                delete this.spectators[socketId];
                switchedIds.push(socketId);
            });

        this.quote = await generateQuote();

        switchedIds.forEach((id) => {
            this.io.to(id).emit("updated-room", { isSpectating: false, playNext: false });
        });

        const updatedState = {
            state: { current: STATE.PREGAME },
            quote: this.quote,
            players: this.getPlayers(),
            spectators: this.getSpectators(),
        };

        if (this.checkPlayersReady()) {
            this.startCountdown(updatedState);
        } else {
            this.updateClients("updated-room", updatedState);
        }
    }

    endRound() {
        if (this.ticker) this.ticker.clear();

        this.getPlayers().forEach((player) => {
            if (!player.stats.position) {
                const progress = player.stats.progress;
                player.stats = {
                    progress,
                    wordIndex: 0,
                    wpm: null,
                    accuracy: null,
                    totalTime: null,
                    position: "DNF",
                };
            }
        });

        this.generateScores();
        this.state = { current: STATE.POSTGAME };

        const updatedState = {
            state: { current: STATE.POSTGAME },
            isRunning: false,
            players: this.getPlayers(),
        };
        this.updateClients("updated-room", updatedState);
    }

    generateScores() {
        const scores = [];
        this.getPlayers().forEach((player) => {
            if (!player.stats.totalTime) return;
            const { wpm, accuracy } = player.stats;
            scores.push([player.id, this.quote.id, wpm, accuracy]);
        });

        console.log("QUOTEID: " + this.quote.id);
        setTimeout(() => saveScores(scores));
    }

    checkPlayersReady() {
        const players = this.getPlayers();
        return (
            players.filter((player) => !player.leftRoom).every((player) => player.isReady) &&
            players.length
        );
    }

    checkStateChange() {
        if (this.isCompleted()) {
            this.endRound();
        } else if (this.checkPlayersReady()) {
            switch (this.state.current) {
                case STATE.PREGAME:
                    this.startCountdown({ players: this.getPlayers() });
                case STATE.POSTGAME:
                    this.startNextRound();
                default:
                    this.updateClients("updated-room", {
                        players: this.getPlayers(),
                        spectators: this.getSpectators(),
                    });
            }
        } else {
            if (this.state.current === STATE.COUNTDOWN) {
                this.cancelCountdown();
            } else {
                this.updateClients("updated-room", {
                    players: this.getPlayers(),
                    spectators: this.getSpectators(),
                });
            }
        }
    }

    setPlayerReady(socketId, isReady) {
        const socket = this.io.sockets.connected[socketId];
        if (!socket) return;

        const player = this.players[socketId];
        if (!player) {
            return socket.emit("updated-room", { leave: true });
        }

        if (player.isReady === isReady || this.state.current === STATE.PLAYING) {
            return socket.emit("updated-room", { isReady: player.isReady });
        }

        player.isReady = isReady;
        socket.emit("updated-room", {
            isReady: isReady,
        });
        this.checkStateChange();
    }

    toggleSpectate(socketId) {
        const socket = this.io.sockets.connected[socketId];
        if (!socket) return;
        if (![STATE.PREGAME, STATE.COUNTDOWN].includes(this.state.current)) return;

        let isSpectating;
        if (this.players[socketId]) {
            const { id, username } = this.players[socketId];
            this.spectators[socketId] = { id, socketId, username, playNext: false };
            delete this.players[socketId];
            isSpectating = true;
        } else if (this.spectators[socketId]) {
            const { id, username } = this.spectators[socketId];
            const player = {
                id,
                socketId,
                username,
                isReady: false,
                leftRoom: false,
                stats: {
                    progress: 0,
                    wordIndex: 0,
                    wpm: null,
                    accuracy: null,
                    totalTime: null,
                    position: null,
                },
            };
            this.players[socketId] = player;
            delete this.spectators[socketId];
            isSpectating = false;
        } else {
            return;
        }

        socket.emit("updated-room", { isSpectating, isReady: false });
        this.checkStateChange();
    }

    setPlayNext(socketId, playNext) {
        const socket = this.io.sockets.connected[socketId];
        if (!socket) return;

        const spectator = this.spectators[socketId];
        if (!spectator) {
            return socket.emit("updated-room", { leave: true });
        }

        if (
            spectator.playNext === playNext ||
            ![STATE.PLAYING, STATE.POSTGAME].includes(this.state.current)
        ) {
            return socket.emit("updated-room", { playNext: spectator.playNext });
        }

        spectator.playNext = playNext;
        socket.emit("updated-room", { playNext: playNext });
    }

    ///////////////////////////////////////////////
    ////////////  GETTERS / SETTERS  //////////////
    ///////////////////////////////////////////////

    getPosition() {
        return ++this.finished;
    }

    getNumOfUsers() {
        const players = Object.values(this.players).filter((player) => !player.leftRoom)
            .length;
        const spectators = Object.values(this.spectators).length;
        return players + spectators;
    }

    getPlayers() {
        return Object.values(this.players);
    }

    getSpectators() {
        return Object.values(this.spectators);
    }

    ///////////////////////////////////////////////
    //////////////////  STATIC  ///////////////////
    ///////////////////////////////////////////////

    static getRoomById(id) {
        return this.idToRoom[id];
    }

    static getRoomBySocketId(id) {
        return this.socketIdToRoom[id];
    }

    static getRooms() {
        return Object.values(this.idToRoom).map((room) => ({
            name: room.name,
            id: room.id,
            users: Object.keys(room.players).length + Object.keys(room.spectators).length,
        }));
    }
}
