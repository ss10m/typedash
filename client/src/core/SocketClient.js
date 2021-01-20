import io from "socket.io-client";

import { setSession, setError, setRoom, updateRoom, clearRoom, setRooms } from "store/actions";

class SocketAPI {
    constructor() {
        this.socket = null;
        this.onRoomCreate = null;
        this.onRoomUpdate = null;
    }

    connect() {
        let id = localStorage.getItem("sync-id");
        if (!id) {
            id = Math.random().toString(36).substr(2, 9);
            localStorage.setItem("sync-id", id);
        }
        this.socket = io.connect({ query: `id=${id}` });
        this.socket.on("connect", () => this.dispatch(setSession({ isConnected: true })));
        this.setup();
    }

    disconnect() {
        this.socket.disconnect();
        this.socket = null;
    }

    setDispatch(dispatch) {
        this.dispatch = dispatch;
    }

    isConnected() {
        return this.socket != null && this.socket.connected;
    }

    emit(event, data = null) {
        if (!this.isConnected()) return;
        this.socket.emit(event, data);
    }

    joinLobby() {
        console.log("joinLobby");
        this.emit("join-lobby");
    }

    refreshLobby() {
        console.log("refreshLobby");
        this.emit("refresh-lobby");
    }

    leaveLobby() {
        console.log("leaveLobby");
        this.emit("leave-lobby");
    }

    createRoom(onCreate) {
        console.log("createRoom");
        this.onRoomCreate = onCreate;
        this.emit("create-room");
    }

    joinRoom(id, onUpdate) {
        console.log("joinRoom");
        this.onRoomUpdate = onUpdate;
        this.emit("join-room", id);
    }

    leaveRoom() {
        console.log("leaveRoom");
        this.emit("leave-room");
    }

    setup() {
        this.socket.on("handle-error", (err) => {
            this.dispatch(setError(err));
        });

        this.socket.on("rooms", (rooms) => {
            this.dispatch(setRooms(rooms));
        });

        this.socket.on("room-created", (roomId) => {
            if (!this.onRoomCreate) return;
            this.onRoomCreate(roomId);
            this.onRoomCreate = null;
        });

        this.socket.on("joined-room", (update) => {
            if (!this.onRoomUpdate) return;
            this.onRoomUpdate("joined", update);
        });

        this.socket.on("updated-room", (update) => {
            if (!this.onRoomUpdate) return;
            this.onRoomUpdate("updated", update);
        });

        this.socket.on("left-room", () => {
            if (!this.onRoomUpdate) return;
            this.onRoomUpdate("left");
            this.onRoomUpdate = null;
        });
    }
}

export default new SocketAPI();
