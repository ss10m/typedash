import { nanoid } from "nanoid";

import { STATE, ROUND } from "../util/constants.js";

export class Room {
    static count = 0;
    static idToRoom = {};
    static socketIdToRoom = {};

    constructor(cb) {
        this.callback = cb;
        this.id = nanoid(7);
        this.state = { current: STATE.PREGAME };
        this.name = this.generateName();
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

    join(socket) {
        const socketId = socket.id;
        const username = socket.handshake.session.user.displayName;

        Room.socketIdToRoom[socketId] = this;

        const data = {
            room: { id: this.id, name: this.name },
            state: { current: this.state.current },
            quote: this.quote.value,
        };
        const user = { username, id: socketId, progress: 0 };

        switch (this.state.current) {
            case STATE.PREGAME:
                this.players[socketId] = user;
                data.isSpectating = false;
                break;
            case STATE.COUNTDOWN:
                this.players[socketId] = user;
                const countdownDiff =
                    this.state.countdown - (Date.now() - this.state.startTime);
                if (countdownDiff > 2000) data.state.countdown = countdownDiff;
                data.isSpectating = false;
                break;
            case STATE.PLAYING:
                this.spectators[socketId] = user;
                const timerDiff = this.state.timer - (Date.now() - this.state.startTime);
                if (timerDiff > 2000) data.state.timer = timerDiff;
                data.isSpectating = true;
                break;
            case STATE.POSTGAME:
                this.spectators[socketId] = user;
                data.isSpectating = true;
                break;
            default:
                break;
        }

        data.players = Object.values(this.players);
        data.spectators = Object.values(this.spectators);
        return data;
    }

    leave(socketId) {
        let isEmpty = false;

        delete Room.socketIdToRoom[socketId];
        if (this.players[socketId]) delete this.players[socketId];
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

    getPlayers() {
        return Object.values(this.players);
    }

    getSpectators() {
        return Object.values(this.spectators);
    }

    isCompleted() {
        const isCompleted = Object.values(this.players).every((player) => player.position);
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
        this.callback("updated-room", { state: updatedState });

        const onSuccess = () => {
            console.log("onSuccess");
            this.state = { current: STATE.PLAYING, timer: ROUND.TIME, startTime: Date.now() };

            const onStep = (steps) => {
                console.log(`${steps}/${ROUND.TIME / 500}`);
            };
            const onSuccess = () => {
                this.endRound();
            };

            this.ticker = new AdjustingInterval(500, ROUND.TIME / 500, onStep, onSuccess);
            this.ticker.start();

            const updatedState = {
                isRunning: true,
                state: { current: STATE.PLAYING, timer: ROUND.TIME },
            };
            this.callback("updated-room", updatedState);
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
        this.callback("updated-room", updatedState);
    }

    startNextRound() {
        console.log("startNextRound");
        if (this.state.current !== STATE.POSTGAME) return;
        this.state = { current: STATE.PREGAME };
        this.finished = 0;

        Object.values(this.players).forEach((player) => {
            player.progress = 0;
            delete player.position;
        });

        const value = `"I want to go home," he muttered as he totered down the road beside me.`;
        const length = value.split(" ").length;
        this.quote = { value, length };

        const updatedState = {
            state: { current: STATE.PREGAME },
            quote: this.quote.value,
            players: Object.values(this.players),
        };
        this.callback("updated-room", updatedState);
    }

    endRound() {
        console.log("endRound");
        this.state = { current: STATE.POSTGAME };
        const updatedState = {
            state: { current: STATE.POSTGAME },
            isRunning: false,
            players: this.getPlayers(),
        };
        this.callback("updated-room", updatedState);
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

function AdjustingInterval(interval, steps, onStep, onSuccess, onError) {
    this.interval = interval;
    this.steps = steps;
    this.expected = null;
    this.timeout = null;

    this.start = () => {
        this.expected = Date.now() + this.interval;
        this.timeout = setTimeout(this.step, this.interval);
    };

    this.clear = () => {
        clearTimeout(this.timeout);
    };

    this.step = () => {
        --this.steps;
        if (!this.steps) {
            if (onSuccess) onSuccess();
            this.clear();
            return;
        }

        const drift = Date.now() - this.expected;
        console.log(drift);
        if (drift > this.interval) {
            if (onError) onError();
            this.clear();
            return;
        }
        if (onStep) onStep(this.steps);
        this.expected += this.interval;
        this.timeout = setTimeout(this.step, Math.max(0, this.interval - drift));
    };
}
