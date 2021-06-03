// Libraries & utils
import React, { useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";

// Socket API
import SocketAPI from "core/SocketClient";

// Constants
import { STATE } from "helpers/constants";

const RoomStateContext = React.createContext(undefined);

const RoomProvider = ({ value, children }) => {
    return <RoomStateContext.Provider value={value}>{children}</RoomStateContext.Provider>;
};

const useRoomContext = () => {
    return React.useContext(RoomStateContext);
};

const initialState = {
    room: null,
    state: { current: STATE.PREGAME },
    completed: false,
    isReady: false,
    isRunning: false,
    isSpectating: false,
    viewSpectators: false,
    playNext: false,
    quote: null,
    players: [],
    spectators: [],
    graph: {
        wpm: [],
        accuracy: [],
    },
    error: "",
};

const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_ROOM":
            return { ...state, ...action.data };
        case "UPDATE_GRAPH":
            const { wpm, accuracy } = action.graph;
            return {
                ...state,
                graph: {
                    wpm: [...state.graph.wpm, wpm],
                    accuracy: [...state.graph.accuracy, accuracy],
                },
            };
        case "CLEAR_GRAPH":
            return {
                ...state,
                graph: {
                    wpm: [],
                    accuracy: [],
                },
            };
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

const useRoomReducer = () => {
    const history = useHistory();
    const { id } = useParams();

    const [data, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        SocketAPI.joinRoom(id);
        const socket = SocketAPI.getSocket();

        socket.on("updated-room", (data) => {
            dispatch({ type: "UPDATE_ROOM", data });
            //leave: () => history.push(""),
        });

        return () => {
            socket.off("updated-room");
            SocketAPI.leaveRoom();
        };
    }, [id, history]);

    return {
        data,
        dispatch,
    };
};

const toggleIsRunning = (dispatch, isRunning) => {
    dispatch({ type: "UPDATE_ROOM", data: { isRunning } });
};

const setViewSpectators = (dispatch, viewSpectators) => {
    dispatch({ type: "UPDATE_ROOM", data: { viewSpectators } });
};

const setCompleted = (dispatch, completed) => {
    dispatch({ type: "UPDATE_ROOM", data: { completed } });
};

const setGraph = (dispatch, graph) => {
    dispatch({ type: "UPDATE_GRAPH", graph });
};

const clearGraph = (dispatch) => {
    dispatch({ type: "CLEAR_GRAPH" });
};

export {
    RoomProvider,
    useRoomContext,
    useRoomReducer,
    toggleIsRunning,
    setViewSpectators,
    setCompleted,
    setGraph,
    clearGraph,
};
