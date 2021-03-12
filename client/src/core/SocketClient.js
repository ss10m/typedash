import io from "socket.io-client";

import { setSession, clearSession, setError } from "store/actions";

class SocketAPI {
    constructor() {
        this.socket = null;
    }

    connect = () => {
        let id = localStorage.getItem("sync-id");
        if (!id) {
            id = Math.random().toString(36).substr(2, 9);
            localStorage.setItem("sync-id", id);
        }
        this.socket = io.connect({ query: `id=${id}` });
        this.socket.on("connect", () => this.dispatch(setSession({ isConnected: true })));
        this.setup();
    };

    disconnect = () => {
        this.socket.disconnect();
        this.socket = null;
    };

    setDispatch = (dispatch) => {
        this.dispatch = dispatch;
    };

    getSocket = () => {
        return this.socket;
    };

    getSocketId = () => {
        return this.socket.id;
    };

    isConnected = () => {
        return this.socket != null && this.socket.connected;
    };

    emit = (event, data = null) => {
        if (!this.isConnected()) return;
        this.socket.emit(event, data);
    };

    joinLobby = () => {
        console.log("joinLobby");
        this.emit("join-lobby");
    };

    refreshLobby = () => {
        console.log("refreshLobby");
        this.emit("refresh-lobby");
    };

    leaveLobby = () => {
        console.log("leaveLobby");
        this.emit("leave-lobby");
    };

    createRoom = () => {
        console.log("createRoom");
        this.emit("create-room");
    };

    joinRoom = (id) => {
        console.log("joinRoom");
        this.emit("join-room", id);
    };

    leaveRoom = () => {
        console.log("leaveRoom");
        this.emit("leave-room");
    };

    updateStatus = (progress) => {
        console.log("updateStatus");
        this.emit("update-progress", progress);
    };

    setReady = (isReady) => {
        this.emit("set-ready", isReady);
    };

    setSpectate = (spectate) => {
        this.emit("set-spectate", spectate);
    };

    setPlayNext = (playNext) => {
        this.emit("set-play-next", playNext);
    };

    updateResults = (resultType) => {
        this.emit("update-results", resultType);
    };

    setup = () => {
        this.socket.on("handle-error", (err) => {
            this.dispatch(setError(err));
        });
        this.socket.on("clear-session", (err) => {
            this.disconnect();
            this.dispatch(clearSession());
        });
    };
}

export default new SocketAPI();
