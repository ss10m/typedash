// Libraries & utils
import React, { useState, useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import Switch from "react-switch";
import { Chart } from "react-charts";
import Select from "react-select";

// Socket API
import SocketAPI from "core/SocketClient";

// Constants
import { STATE } from "helpers/constants";

// Components
import Racer from "./Racer/Racer";
import Scoreboard from "./Scoreboard/Scoreboard";
import Timer from "./Timer/Timer";
import Countdown from "./Countdown/Countdown";
import Status from "./Status/Status";
import Results from "./Results/Results";
import Error from "../Error/Error";

// SCSS
import "./Room.scss";

const Room = () => {
    const {
        room,
        state,
        isReady,
        isSpectating,
        playNext,
        players,
        spectators,
        quote,
        error,
        isRunning,
        setIsRunning,
    } = useRoomApi();

    const history = useHistory();
    const [graphWpm, setGraphWpm] = useState({
        data: [],
    });
    const [graphAccuracy, setGraphAccuracy] = useState({
        data: [],
    });

    if (error) return <Error msg={error} goBack={() => history.goBack()} />;
    if (!room) return null;

    const socketId = SocketAPI.getSocketId();

    return (
        <div className="room">
            {state.countdown && (
                <Countdown
                    duration={state.countdown}
                    isSpectating={isSpectating}
                    onCancel={SocketAPI.setReady}
                />
            )}
            <div className="status">
                <button onClick={history.goBack}>LEAVE ROOM</button>
                <div>
                    <p>{state.current}</p>
                </div>
                <div>{room.name}</div>
            </div>

            <Scoreboard players={players} socketId={socketId} />
            <div>
                {spectators.map((user, index) => (
                    <div key={index}>{user.username}</div>
                ))}
            </div>

            <div className="stats">
                <Status
                    state={state}
                    isSpectating={isSpectating}
                    toggleSpectate={SocketAPI.toggleSpectate}
                    playNext={playNext}
                    setPlayNext={SocketAPI.setPlayNext}
                />
                <ReadyUp isReady={isReady} setReady={SocketAPI.setReady} />
                <Timer state={state} />
            </div>

            <Racer
                state={state}
                isRunning={isRunning && !isSpectating}
                isSpectating={isSpectating}
                setIsRunning={setIsRunning}
                currentQuote={quote}
                updateStatus={SocketAPI.updateStatus}
                setGraphWpm={setGraphWpm}
                setGraphAccuracy={setGraphAccuracy}
            />

            <GraphWrapper graphWpm={graphWpm} graphAccuracy={graphAccuracy} />

            <Results quote={quote} updateResults={SocketAPI.updateResults} />
        </div>
    );
};

const GraphWrapper = ({ graphWpm, graphAccuracy }) => {
    const [width, setWidth] = useState("100%");
    const [selected, setSelected] = useState({ value: "wpm", label: "WPM" });

    const [data, setData] = useState([
        [0, 77],
        [1, 67],
        [2, 82],
        [3, 88],
        [4, 103],
    ]);

    useEffect(() => {
        setWidth(width === "100%" ? "99.99%" : "100%");
    }, [graphWpm]);

    const options = useMemo(
        () => [
            { value: "wpm", label: "WPM" },
            { value: "accuracy", label: "ACCURACY" },
        ],
        []
    );

    const customStyles = useMemo(
        () => ({
            control: (base, state) => ({
                ...base,
                background: "#162029",
                borderRadius: state.isFocused ? "3px 3px 0 0" : "3px",
                borderColor: "#3a5068",
                boxShadow: state.isFocused ? null : null,
                "&:hover": {
                    borderColor: "#56779a",
                    cursor: "pointer",
                },
            }),
            menu: (base) => ({
                ...base,
                marginTop: 0,
            }),
            menuList: (base) => ({
                ...base,
                padding: "10px 0",
                background: "#2c3f54",
                color: "whitesmoke",
            }),
            singleValue: (provided) => ({
                ...provided,
                color: "whitesmoke",
            }),
            option: (styles, state) => ({
                ...styles,
                cursor: "pointer",
                background: state.isSelected ? "#3a5068" : "#2c3f54",
                "&:hover": {
                    background: "#56779a",
                },
                "&:active": {
                    background: "#3e9dff",
                },
            }),
        }),
        []
    );

    return (
        <>
            <div className="header33">
                <p>WPM TIMELINE</p>
                <div className="select-graph">
                    <Select
                        value={selected}
                        options={options}
                        autosize={true}
                        styles={customStyles}
                        onChange={(value) => setSelected(value)}
                    />
                </div>
            </div>
            <Graph data={data} width={width} />
        </>
    );
};

/*


theme={(theme) => ({
                            ...theme,
                            //borderRadius: 0,
                            colors: {
                                ...theme.colors,
                                primary: "#3a5068",
                                primary50: "#3a5068",
                                primary25: "#2c3f54",
                            },
                        })}

                        */

const Graph = ({ data, width }) => {
    const currentData = useMemo(
        () => [
            {
                label: "WPM",
                data,
            },
        ],
        [data]
    );

    const axes = useMemo(
        () => [
            { primary: true, type: "linear", position: "bottom", show: true },
            { type: "linear", position: "left", show: true },
        ],
        []
    );

    if (!data.length) return null;

    console.log(width);
    const lineChart = (
        <div className="chart">
            <div className="foreground" style={{ width }}>
                <Chart data={currentData} axes={axes} tooltip primaryCursor secondaryCursor />
            </div>
        </div>
    );

    return lineChart;
};

const ReadyUp = ({ isReady, setReady }) => {
    const [isToggleDisabled, setIsToggleDisabled] = useState(false);

    useEffect(() => {
        setIsToggleDisabled(false);
    }, [isReady]);

    const toggle = () => {
        if (isToggleDisabled) return;
        setIsToggleDisabled(true);
        setReady(!isReady.current);
    };

    return (
        <label>
            <span>READY</span>
            <Switch onChange={toggle} checked={isReady.current} />
        </label>
    );
};

const useRoomApi = () => {
    const history = useHistory();
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [state, setState] = useState({ current: STATE.PREGAME });
    const [isReady, setIsReady] = useState({ current: false });
    const [isRunning, setIsRunning] = useState(false);
    const [isSpectating, setIsSpectating] = useState(false);
    const [playNext, setPlayNext] = useState(false);
    const [quote, setQuote] = useState(null);
    const [players, setPlayers] = useState([]);
    const [spectators, setSpectators] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        SocketAPI.joinRoom(id);
        const socket = SocketAPI.getSocket();

        socket.on("updated-room", (data) => {
            const fields = Object.keys(data);

            const setFunctions = {
                room: (data) => setRoom(data),
                state: (data) => setState(data),
                isReady: (data) => setIsReady({ current: data }),
                isRunning: (data) => setIsRunning(data),
                isSpectating: (data) => setIsSpectating(data),
                playNext: (data) => setPlayNext(data),
                quote: (data) => setQuote(data),
                players: (data) => setPlayers(data),
                spectators: (data) => setSpectators(data),
                error: (data) => setError(data),
                leave: () => history.push(""),
            };

            for (let field of fields) {
                const setFunction = setFunctions[field];
                if (!setFunction) continue;
                setFunction(data[field]);
            }
        });

        return () => {
            socket.off("updated-room");
            SocketAPI.leaveRoom();
        };
    }, [id, history]);

    return {
        room,
        state,
        isReady,
        isSpectating,
        playNext,
        players,
        spectators,
        quote,
        error,
        isRunning,
        setIsRunning,
    };
};

export default Room;
