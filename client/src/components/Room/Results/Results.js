// Libraries & utils
import { useEffect, useState } from "react";
import moment from "moment";
import classnames from "classnames";

// Socket API
import SocketAPI from "core/SocketClient";

// Components
import MoonLoader from "react-spinners/MoonLoader";

// Constants
import { RESULT_TYPE } from "helpers/constants";

// SCSS
import "./Results.scss";

const Results = ({ quote, state, updateResults }) => {
    const [view, setView] = useState(RESULT_TYPE.TOP);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        console.log("SOCKET");
        const socket = SocketAPI.getSocket();
        socket.on("updated-results", ({ type, data }) => {
            setIsFetching(false);
            setView(type);
            setData(data);
        });

        return () => {
            socket.off("updated-results");
        };
    }, []);

    useEffect(() => {
        if (quote) {
            setData(quote.recent);
            console.log("quote changed");
        }
    }, [quote]);

    useEffect(() => {
        console.log("state changed");
        console.log(state);
    }, [state]);

    const changeView = (newView) => {
        if (view === newView) return;
        setIsFetching(true);
        setView(newView);
        updateResults(newView);
    };

    return (
        <div className="recent-results">
            <div className="tabs">
                <div
                    className={classnames({ selected: view === RESULT_TYPE.TOP })}
                    onClick={() => changeView(RESULT_TYPE.TOP)}
                >
                    TOP
                </div>
                <div
                    className={classnames({ selected: view === RESULT_TYPE.RECENT })}
                    onClick={() => changeView(RESULT_TYPE.RECENT)}
                >
                    RECENT
                </div>
                <div
                    className={classnames({ selected: view === RESULT_TYPE.PLAYER_TOP })}
                    onClick={() => changeView(RESULT_TYPE.PLAYER_TOP)}
                >
                    YOUR TOP
                </div>
                <div
                    className={classnames({ selected: view === RESULT_TYPE.PLAYER_RECENT })}
                    onClick={() => changeView(RESULT_TYPE.PLAYER_RECENT)}
                >
                    YOUR RECENT
                </div>
            </div>
            <div className="results">
                <div className="header">
                    <div className="rank">#</div>
                    <div className="username">USERNAME</div>
                    <div className="wpm">WPM</div>
                    <div className="accuracy">ACCURACY</div>
                    <div className="time">TIME</div>
                </div>
                <div className="data">
                    <ResultsData isFetching={isFetching} data={data} />
                </div>
            </div>
        </div>
    );
};

const ResultsData = ({ isFetching, data }) => {
    if (isFetching) {
        return (
            <div className="empty">
                <MoonLoader
                    color="whitesmoke"
                    loading={true}
                    css="display: block;"
                    size={60}
                />
            </div>
        );
    }
    if (!data.length) {
        return <div className="empty">No results found</div>;
    }

    return data.map((score, index) => (
        <div key={index} className="result">
            <div className="rank">{score.rank}</div>
            <div className="username">{score.display_name}</div>
            <div className="wpm">{`${score.wpm}wpm`}</div>
            <div className="accuracy">{`${score.accuracy}%`}</div>
            <div className="time">{moment(score.played_at).fromNow()}</div>
        </div>
    ));
};

export default Results;
