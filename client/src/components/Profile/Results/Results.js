// Libraries & utils
import { useState } from "react";
import moment from "moment";
import classnames from "classnames";

// Constants
import { RESULT_TYPE } from "helpers/constants";

// SCSS
import "./Results.scss";

const Results = ({ top, recent, setQuoteModal }) => {
    const [view, setView] = useState(RESULT_TYPE.TOP);

    const changeView = (newView) => {
        if (newView === view) return;
        setView(newView);
    };

    return (
        <div className="profile-results">
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
            </div>
            <div className="results">
                <div className="results-header">
                    <div className="rank">#</div>
                    <div className="wpm">WPM</div>
                    <div className="accuracy">ACCURACY</div>
                    <div className="time">TIME</div>
                    <div className="quote">QUOTE</div>
                </div>
                <div className="data">
                    <ResultsData
                        data={view === RESULT_TYPE.TOP ? top : recent}
                        setQuoteModal={setQuoteModal}
                    />
                </div>
            </div>
            <div className="results-footer"></div>
        </div>
    );
};

const ResultsData = ({ data, setQuoteModal }) => {
    if (!data.length) {
        return <div className="empty">No results found</div>;
    }
    return data.map((score, index) => (
        <Score key={index} score={score} setQuoteModal={setQuoteModal} />
    ));
};

const Score = ({ score, setQuoteModal }) => {
    return (
        <div className="result">
            <div className="rank">{score.rank}</div>
            <div className="wpm">{`${score.wpm}wpm`}</div>
            <div className="accuracy">{`${score.accuracy}%`}</div>
            <div className="time">{moment(score.played_at).fromNow()}</div>
            <div className="quote">
                <span
                    onClick={() => setQuoteModal(score.quote_id)}
                >{`#${score.quote_id}`}</span>
            </div>
        </div>
    );
};

export default Results;
