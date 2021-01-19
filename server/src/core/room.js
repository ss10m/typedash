import { nanoid } from "nanoid";

export class Room {
    static count = 0;
    static idToRoom = {};
    static socketIdToRoom = {};

    constructor() {
        this.id = nanoid(7);
        this.name = "ROOM " + this.generateName(Room.count);
        this.users = {};
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

    join(socket) {
        const socketId = socket.id;
        const username = socket.handshake.session.user.displayName;
        this.users[socketId] = { username };
        Room.socketIdToRoom[socketId] = this;
    }

    leave(socketId) {
        let isEmpty = false;

        delete Room.socketIdToRoom[socketId];
        delete this.users[socketId];
        if (!Object.keys(this.users).length) {
            delete Room.idToRoom[this.id];
            isEmpty = true;
        }
        if (!Object.keys(Room.idToRoom).length) Room.count = 0;
        return isEmpty;
    }

    getDetails() {
        return {
            id: this.id,
            name: this.name,
            users: this.getUsers(),
        };
    }

    getUsers() {
        return Object.values(this.users);
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
            users: Object.keys(room.users).length,
        }));
    }
}
