// Libraries & utils
import React, { useState, useEffect, useRef } from "react";
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
    const [pageCount, setPageCount] = useState(1);
    const [highscores, setHighscores] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [marginBottom, setMarginBottom] = useState(0);
    const pageRef = useRef(1);
    const containerRef = useRef(null);
    const rowCountRef = useRef(null);

    useEffect(() => {
        const containerHeight = containerRef.current.clientHeight;
        const rowCount = Math.floor(containerHeight / 40);
        console.log(containerHeight, 25 * 40, rowCount);

        console.log(containerHeight % 40);
        setMarginBottom(containerHeight % 40);
        rowCountRef.current = rowCount;
    }, []);

    useEffect(() => {
        console.log("FETCHING: " + page);

        setIsFetching(true);
        fetch("/api/highscores", {
            method: "POST",
            body: JSON.stringify({ page, rowCount: rowCountRef.current }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(handleResponse)
            .then((data) => {
                console.log(
                    "CURRENT: " + page + " REF: " + pageRef.current + " FETCHED: " + data.page
                );
                if (pageRef.current !== data.page) return;
                setHighscores(data.results);
                setPageCount(data.pageCount);
                setIsFetching(false);
            })
            .catch(() => {});
    }, [page]);

    const updatePage = (updatedPage) => {
        if (isFetching) return;
        setPage(updatedPage);
        pageRef.current = updatedPage;
    };

    return (
        <div className="highscores">
            <div className="tabs">
                <div>HIGHSCORES</div>
            </div>
            <div className="header">
                <div className="rank">#</div>
                <div className="username">USERNAME</div>
                <div className="wpm">WPM</div>
                <div className="accuracy">ACCURACY</div>
                <div className="time">TIME</div>
            </div>
            <div className="results-wrapper" ref={containerRef}>
                <div className="results">
                    <HighscoresData isFetching={isFetching} data={highscores} />
                </div>
            </div>
            <Pagination
                page={page}
                updatePage={updatePage}
                pageCount={pageCount}
                disabled={isFetching}
                marginBottom={marginBottom}
            />
        </div>
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
