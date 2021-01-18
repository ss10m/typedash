import io from "socket.io-client";

import { setError, setRoom, updateRoom, clearRoom, setRooms } from "store/actions";

class SocketAPI {
    constructor() {
        this.socket = null;
    }

    connect() {
        let id = localStorage.getItem("sync-id");
        if (!id) {
            id = Math.random().toString(36).substr(2, 9);
            localStorage.setItem("sync-id", id);
        }
        this.socket = io.connect({ query: `id=${id}` });
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

    setup() {
        this.socket.on("handle-error", (err) => {
            this.dispatch(setError(err));
        });

        this.socket.on("rooms", (rooms) => {
            this.dispatch(setRooms(rooms));
        });

        this.socket.on("joined-room", (room) => {
            this.dispatch(setRoom(room));
        });

        this.socket.on("left-room", () => {
            this.dispatch(clearRoom());
        });

        this.socket.on("updated-room", (update) => {
            this.dispatch(updateRoom(update));
        });
    }

    emit(event, data = null) {
        if (!this.isConnected()) return;
        this.socket.emit(event, data);
    }
}

export default new SocketAPI();
