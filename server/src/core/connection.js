export class Connection {
    static browserIds = {};
    static socketIdtoBrowserId = {};

    constructor(browserId, socketId) {
        this.browserId = browserId;
        this.socketId = socketId;
        this.isValid = this.addId(browserId, socketId);
    }

    addId(browserId, socketId) {
        let connections = Connection.browserIds[browserId];
        if (connections !== undefined) {
            if (connections >= 4) {
                return false;
            }
            Connection.browserIds[browserId] += 1;
        } else {
            Connection.browserIds[browserId] = 1;
        }

        Connection.socketIdtoBrowserId[socketId] = browserId;
        return true;
    }

    static removeConnection(socketId) {
        let browserId = this.socketIdtoBrowserId[socketId];
        if (!browserId) return;
        let connectecUsers = this.browserIds[browserId];
        if (connectecUsers <= 1) {
            delete this.browserIds[browserId];
        } else {
            this.browserIds[browserId] -= 1;
        }
        delete this.socketIdtoBrowserId[socketId];
    }
}
