import { nanoid } from "nanoid";

export class Room {
    static count = 0;
    static idToRoom = {};
    static socketIdToRoom = {};

    constructor() {
        this.id = nanoid(7);
        this.name = "ROOM " + this.generateName(Room.count);
        this.players = {};
        this.spectators = {};
        this.status = this.generateStatus();
        Room.count += 1;
        Room.idToRoom[this.id] = this;
    }

    generateName(id) {
        let current = String.fromCharCode(65 + (id % 26));
        if (id >= 26) {
            return this.generateName(Math.floor(id / 26) - 1) + current;
        } else {
            return current;
        }
    }

    generateStatus() {
        const quote = `"I wish it need not have happened in my time," said Frodo.`;
        const quoteLength = quote.split(" ").length;
        return { quote, quoteLength };
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
            delete Room.idToRoom[this.id];
            isEmpty = true;
        }
        if (!Object.keys(Room.idToRoom).length) Room.count = 0;
        return isEmpty;
    }

    getDetails() {
        return {
            room: { id: this.id, name: this.name },
            players: Object.values(this.players),
            spectators: Object.values(this.spectators),
            status: this.status,
        };
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
