// Libraries & utils
import React, { useState, useEffect } from "react";
import moment from "moment";

// Components
import MoonLoader from "react-spinners/MoonLoader";
import Pagination from "./Pagination/Pagination";

// Constants
import { handleResponse } from "helpers";

// SCSS
import "./Highscores.scss";

const Highscores = () => {
    const [page, setPage] = useState(1);
    const [highscores, setHighscores] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    console.log("CURRENT: " + page);

    useEffect(() => {
        console.log("FETCHING: " + page);
        setIsFetching(true);
        fetch("/api/highscores", {
            method: "POST",
            body: JSON.stringify({ page }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(handleResponse)
            .then((data) => {
                console.log(data);
                setHighscores([...data]);
                setIsFetching(false);
            })
            .catch(() => {});
    }, [page]);

    return (
        <>
            <div className="highscores">
                <div className="tabs">
                    <div>HIGHSCORES</div>
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
                        <HighscoresData isFetching={isFetching} data={highscores} />
                    </div>
                </div>
                <Pagination page={page} setPage={setPage} />
            </div>
        </>
    );
};

const HighscoresData = ({ isFetching, data }) => {
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

export default Highscores;
