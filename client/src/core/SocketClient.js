import io from "socket.io-client";

class SocketAPI {
    constructor() {
        this.socket = null;
    }

    connect() {
        this.socket = io.connect();
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
        this.socket.on("hello", () => console.log("onHello"));
    }

    emit(event, data) {
        if (!this.isConnected()) return;
        this.socket.emit(event, data);
    }
}

export default new SocketAPI();
