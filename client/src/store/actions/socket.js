const CONNECT = "redux/socket/CONNECT";
const CONNECT_SUCCESS = "redux/socket/CONNECT_SUCCESS";
const CONNECT_FAIL = "redux/socket/CONNECT_FAIL";

const DISCONNECT = "redux/socket/DISCONNECT";
const DISCONNECT_SUCCESS = "redux/socket/DISCONNECT_SUCCESS";
const DISCONNECT_FAIL = "redux/socket/DISCONNECT_FAIL";

const SEND = "redux/message/SEND";
const SEND_SUCCESS = "redux/message/SEND_SUCCESS";
const SEND_FAIL = "redux/message/SEND_FAIL";

export const connectSocket = () => {
    return {
        type: "socket",
        types: [CONNECT, CONNECT_SUCCESS, CONNECT_FAIL],
        promise: (socket) => socket.connect(),
    };
};

export const disconnectSocket = () => {
    return {
        type: "socket",
        types: [DISCONNECT, DISCONNECT_SUCCESS, DISCONNECT_FAIL],
        promise: (socket) => socket.disconnect(),
    };
};
export const send = (chatId, content) => {
    const message = { chatId, content };
    return {
        type: "socket",
        types: [SEND, SEND_SUCCESS, SEND_FAIL],
        promise: (socket) => socket.emit("SendMessage", message),
    };
};
