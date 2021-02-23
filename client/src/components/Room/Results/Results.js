// Libraries & utils
import { useEffect, useState, useRef } from "react";
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

const Results = ({ quote, updateResults }) => {
    const [view, setView] = useState(RESULT_TYPE.TOP);
    const viewRef = useRef(RESULT_TYPE.TOP);
    const quoteRef = useRef(null);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const socket = SocketAPI.getSocket();
        socket.on("updated-results", ({ id, type, data, force }) => {
            if (quoteRef.current.id !== id) return;
            if (viewRef.current !== type) {
                if (!force) return;
                setView(type);
            }
            setData(data);
            setIsFetching(false);
        });

        return () => {
            socket.off("updated-results");
        };
    }, []);

    useEffect(() => {
        if (!quote) return;
        setIsFetching(false);
        setView(RESULT_TYPE.TOP);
        setData(quote.results);
        quoteRef.current = quote;
    }, [quote]);

    const changeView = (newView) => {
        if (view === newView) return;
        setIsFetching(true);
        setView(newView);
        viewRef.current = newView;
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
