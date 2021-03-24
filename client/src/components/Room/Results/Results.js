// Libraries & utils
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import classnames from "classnames";

// Constants
import { RESULT_TYPE } from "helpers/constants";

// SCSS
import "./Results.scss";

const Results = ({ quote, updateResults }) => {
    const [view, setView] = useState(RESULT_TYPE.TOP);
    const viewRef = useRef(RESULT_TYPE.TOP);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!quote) return;
        const { type, force, data } = quote.results;

        if (viewRef.current !== type) {
            if (!force) return;
            viewRef.current = type;
            setView(type);
        }
        setData(data);
    }, [quote]);

    const changeView = (newView) => {
        if (view === newView) return;
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
                    TOP 10
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
                    YOUR TOP 10
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
                    <ResultsData data={data} />
                </div>
            </div>
            <div className="results-footer"></div>
        </div>
    );
};

const ResultsData = ({ data }) => {
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
