import { nanoid } from "nanoid";

import { STATE, ROUND } from "../util/constants.js";

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
        this.scoreboard = {};
        this.players = {};
        this.spectators = {};
        this.quote = this.generateQuote();
        this.finished = 0;
        Room.count += 1;
        Room.idToRoom[this.id] = this;
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

    generateQuote() {
        const value = `"I wish it need not have happened in my time," said Frodo.`;
        const length = value.split(" ").length;
        return { value, length };
    }

    updateClients(key, data) {
        this.io.in(this.id).emit(key, data);
    }

    join(socket) {
        const socketId = socket.id;
        const username = socket.handshake.session.user.displayName;

        Room.socketIdToRoom[socketId] = this;

        const data = {
            room: { id: this.id, name: this.name },
            state: { current: this.state.current },
            quote: this.quote.value,
        };
        let user = { username, id: socketId };
        let score = { username, progress: 0, leftRoom: false };

        if (this.scoreboard[socketId]) {
            score = this.scoreboard[socketId];
            score.leftRoom = false;
        }

        switch (this.state.current) {
            case STATE.PREGAME:
                this.players[socketId] = user;
                this.scoreboard[socketId] = score;
                data.isSpectating = false;
                break;
            case STATE.COUNTDOWN:
                this.players[socketId] = user;
                this.scoreboard[socketId] = score;
                const countdownDiff =
                    this.state.countdown - (Date.now() - this.state.startTime);
                if (countdownDiff > 2000) data.state.countdown = countdownDiff;
                data.isSpectating = false;
                break;
            case STATE.PLAYING:
                this.spectators[socketId] = { ...user, playNext: false };
                const timerDiff = this.state.timer - (Date.now() - this.state.startTime);
                if (timerDiff > 2000) data.state.timer = timerDiff;
                data.isSpectating = true;
                break;
            case STATE.POSTGAME:
                this.spectators[socketId] = { ...user, playNext: false };
                data.isSpectating = true;
                break;
            default:
                break;
        }

        data.scoreboard = Object.values(this.scoreboard);
        data.spectators = Object.values(this.spectators);

        console.log(data);
        return data;
    }

    leave(socketId) {
        let isEmpty = false;

        delete Room.socketIdToRoom[socketId];
        if (this.players[socketId]) {
            delete this.players[socketId];
            if ([STATE.PREGAME, STATE.COUNTDOWN].includes(this.state.current)) {
                delete this.scoreboard[socketId];
            } else {
                this.scoreboard[socketId].leftRoom = true;
            }
        }
        if (this.spectators[socketId]) delete this.spectators[socketId];
        if (!Object.keys(this.players).length && !Object.keys(this.spectators).length) {
            if (this.countdown) clearTimeout(this.countdown);
            if (this.ticker) this.ticker.clear();
            delete Room.idToRoom[this.id];
            isEmpty = true;
        }
        if (!Object.keys(Room.idToRoom).length) Room.count = 0;
        return isEmpty;
    }

    getPosition() {
        return ++this.finished;
    }

    getNumOfUsers() {
        return Object.values(this.players).length + Object.values(this.spectators).length;
    }

    getSpectators() {
        return Object.values(this.spectators);
    }

    getScoreboard() {
        return Object.values(this.scoreboard);
    }

    isCompleted() {
        const isCompleted = Object.values(this.scoreboard).every((player) => player.position);
        if (!isCompleted) return false;
        if (this.ticker) this.ticker.clear();
        this.endRound();
        return true;
    }

    startCountdown() {
        console.log("STARTING ROUND");
        if (this.state.current !== STATE.PREGAME) return;
        const updatedState = { current: STATE.COUNTDOWN, countdown: ROUND.COUNTDOWN };
        this.state = { ...updatedState, startTime: Date.now() };
        this.updateClients("updated-room", { state: updatedState });

        const onSuccess = () => {
            console.log("onSuccess");
            this.state = { current: STATE.PLAYING, timer: ROUND.TIME, startTime: Date.now() };

            const onStep = (steps) => {
                //console.log(`${steps}/${ROUND.TIME / 500}`);
            };
            const onSuccess = () => {
                this.endRound();
            };

            this.ticker = new AdjustingTicker(500, ROUND.TIME / 500, onStep, onSuccess);
            this.ticker.start();

            const updatedState = {
                isRunning: true,
                state: { current: STATE.PLAYING, timer: ROUND.TIME },
            };
            this.updateClients("updated-room", updatedState);
        };
        this.countdown = setTimeout(onSuccess, ROUND.COUNTDOWN);
    }

    cancelCountdown() {
        console.log("ENDING ROUND");
        if (this.state.current !== STATE.COUNTDOWN) return;
        if (this.countdown) clearTimeout(this.countdown);
        this.state = { current: STATE.PREGAME };
        const updatedState = {};
        updatedState.state = { current: STATE.PREGAME };
        this.updateClients("updated-room", updatedState);
    }

    startNextRound() {
        console.log("startNextRound");
        if (this.state.current !== STATE.POSTGAME) return;
        this.state = { current: STATE.PREGAME };
        this.finished = 0;

        this.scoreboard = {};

        Object.values(this.players).forEach((player) => {
            player.progress = 0;
            delete player.position;
            this.scoreboard[player.id] = {
                username: player.username,
                progress: 0,
                leftRoom: false,
            };
        });

        const switchedIds = [];
        Object.values(this.spectators)
            .filter((spectator) => spectator.playNext)
            .forEach((spectator) => {
                const { username, id } = spectator;
                let user = { username, id };
                let score = { username, progress: 0, leftRoom: false };
                this.players[id] = user;
                this.scoreboard[id] = score;
                delete this.spectators[id];
                switchedIds.push(id);
            });

        const value = `"I want to go home," he muttered as he totered down the road beside me.`;
        const length = value.split(" ").length;
        this.quote = { value, length };

        const updatedState = {
            state: { current: STATE.PREGAME },
            quote: this.quote.value,
            scoreboard: Object.values(this.scoreboard),
            spectators: Object.values(this.spectators),
        };

        switchedIds.forEach((id) => {
            this.io.to(id).emit("updated-room", { isSpectating: false });
        });

        this.updateClients("updated-room", updatedState);
    }

    endRound() {
        console.log("endRound");
        this.state = { current: STATE.POSTGAME };
        const updatedState = {
            state: { current: STATE.POSTGAME },
            isRunning: false,
            scoreboard: Object.values(this.scoreboard),
        };
        this.updateClients("updated-room", updatedState);
    }

    togglePlayNext(socket, toggled) {
        const spectator = this.spectators[socket.id];
        if (!spectator) return;

        const socketId = socket.id;

        let user = { username: spectator.username, id: socketId };
        let score = { username: spectator.username, progress: 0, leftRoom: false };

        let notify = false;
        switch (this.state.current) {
            case STATE.PREGAME:
                delete this.spectators[socketId];
                this.players[socketId] = user;
                this.scoreboard[socketId] = score;
                notify = true;
                break;
            case STATE.COUNTDOWN:
                delete this.spectators[socketId];
                this.players[socketId] = user;
                this.scoreboard[socketId] = score;
                notify = true;
                break;
            default:
                spectator.playNext = toggled;
                break;
        }

        if (notify) {
            const updatedState = {};
            updatedState.scoreboard = this.getScoreboard();
            updatedState.spectators = this.getSpectators();
            socket.to(this.id).emit("updated-room", updatedState);

            socket.emit("updated-room", { ...updatedState, isSpectating: false });
        }
    }

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
