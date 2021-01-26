import { nanoid } from "nanoid";

import { STATE } from "../util/constants.js";

export class Room {
    static count = 0;
    static idToRoom = {};
    static socketIdToRoom = {};

    constructor(cb) {
        this.callback = cb;
        this.id = nanoid(7);
        this.state = { current: STATE.WAITING };
        this.name = this.generateName();
        this.players = {};
        this.spectators = {};
        this.quote = this.generateQuote();
        this.finished = 0;
        Room.count += 1;
        Room.idToRoom[this.id] = this;
        //this.startRound();
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

        this.players[socketId] = { username, id: socketId, progress: 0 };
        /*
        if (Math.random() > 0.5) {
            this.players[socketId] = { username };
        } else {
            this.spectators[socketId] = { username };
        }
        */

        Room.socketIdToRoom[socketId] = this;
    }

    leave(socketId) {
        let isEmpty = false;

        delete Room.socketIdToRoom[socketId];
        if (this.players[socketId]) delete this.players[socketId];
        if (this.spectators[socketId]) delete this.spectators[socketId];
        if (!Object.keys(this.players).length && !Object.keys(this.spectators).length) {
            if (this.ticker) this.ticker.clear();
            delete Room.idToRoom[this.id];
            isEmpty = true;
        }
        if (!Object.keys(Room.idToRoom).length) Room.count = 0;
        return isEmpty;
    }

    getDetails() {
        const data = {
            room: { id: this.id, name: this.name },
            state: { current: this.state.current },
            players: Object.values(this.players),
            spectators: Object.values(this.spectators),
            quote: this.quote,
        };
        if (this.state.current === STATE.COUNTDOWN) {
            const diff = this.state.countdown - (Date.now() - this.state.startTime);
            if (diff > 2000) data.state.countdown = diff;
        }
        if (this.state.current === STATE.PLAYING) {
            const diff = this.state.timer - (Date.now() - this.state.startTime);
            if (diff > 2000) data.state.timer = diff;
            console.log(this.state.timer, Date.now() - this.state.startTime, diff);
        }
        return data;
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

    startRound() {
        console.log("STARTING ROUND");
        const updatedState = {};
        updatedState.state = { current: STATE.COUNTDOWN, countdown: 10000 };
        this.callback("updated-room", updatedState);

        this.state = { current: STATE.COUNTDOWN, countdown: 10000, startTime: Date.now() };
        const onTick = () => {
            console.log("TICK");
        };
        const onSuccess = () => {
            console.log("onSuccess");
            this.state = { current: STATE.PLAYING, timer: 120000, startTime: Date.now() };
            const updatedState = {};
            updatedState.isRunning = true;
            updatedState.state = { current: STATE.PLAYING, timer: 120000 };
            this.callback("updated-room", updatedState);
        };
        this.ticker = new AdjustingInterval(1000, 10, onTick, onSuccess, null);
        this.ticker.start();
    }

    endRound() {
        console.log("ENDING ROUND");
        if (this.ticker) this.ticker.clear();
        this.state = { current: STATE.WAITING };
        const updatedState = {};
        updatedState.isRunning = false;
        updatedState.state = { current: STATE.WAITING };
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
    let expected, timeout;
    this.interval = interval;
    this.steps = steps;

    this.start = () => {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    };

    this.clear = () => {
        clearTimeout(timeout);
    };

    const step = () => {
        console.log(--this.steps);
        if (!this.steps) {
            this.clear();
            onSuccess();
            return;
        }

        const drift = Date.now() - expected;
        if (drift > this.interval) {
            if (onError) onError();
        }
        onStep();
        expected += this.interval;
        timeout = setTimeout(step, Math.max(0, this.interval - drift));
    };
}
