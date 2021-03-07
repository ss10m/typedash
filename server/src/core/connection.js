export class Connection {
    static browserIds = {};
    static socketIdtoBrowserId = {};
    static io = null;

    constructor(browserId, socketId) {
        this.browserId = browserId;
        this.socketId = socketId;
        this.isValid = this.validate();
    }

    validate() {
        let connections = Connection.browserIds[this.browserId];
        if (connections) {
            connections.push(this.socketId);
            if (connections.length > 4) {
                const removedId = connections.shift();
                Connection.io
                    .to(removedId)
                    .emit("handle-error", "It looks like you opened more tabs than allowed");
                if (Connection.io.sockets.connected[removedId]) {
                    Connection.io.sockets.connected[removedId].disconnect();
                }
            }
        } else {
            Connection.browserIds[this.browserId] = [this.socketId];
        }

        Connection.socketIdtoBrowserId[this.socketId] = this.browserId;
        return true;
    }

    static setSocket(io) {
        this.io = io;
    }

    static removeConnection(socketId) {
        const browserId = this.socketIdtoBrowserId[socketId];
        const connections = Connection.browserIds[browserId];
        const index = connections.indexOf(socketId);

        if (index > -1) {
            connections.splice(index, 1);
        }

        if (!connections.length) {
            delete this.browserIds[browserId];
        }
        delete this.socketIdtoBrowserId[socketId];
    }

    static logoutClients(browserId) {
        const connections = Connection.browserIds[browserId];
        connections.forEach((socketId) => {
            this.io.to(socketId).emit("clear-session");
        });
    }
}
