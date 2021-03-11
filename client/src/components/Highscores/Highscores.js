// Libraries & utils
import React, { useState, useEffect, useRef, useCallback } from "react";
import moment from "moment";
import { Collapse } from "react-collapse";
import classnames from "classnames";

// Icons
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

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

    const fetchData = useCallback(() => {
        setIsFetching(true);
        fetch("/api/highscores", {
            method: "POST",
            body: JSON.stringify({ page: pageRef.current, rowCount: rowCountRef.current }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(handleResponse)
            .then((data) => {
                if (pageRef.current !== data.page) return;
                setHighscores(data.results);
                setPageCount(data.pageCount);
                setIsFetching(false);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const containerHeight = containerRef.current.clientHeight;
        const rowCount = Math.floor(containerHeight / 40);
        setMarginBottom(containerHeight % 40);
        rowCountRef.current = rowCount;
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, fetchData]);

    const updatePage = (updatedPage) => {
        if (isFetching) return;
        setPage(updatedPage);
        pageRef.current = updatedPage;
    };

    return (
        <div className="highscores">
            <div className="tabs">
                <div>HIGHSCORES</div>
                <RefreshButton fetchData={fetchData} />
            </div>
            <div className="header">
                <div className="rank">#</div>
                <div className="fields">
                    <div className="username">USERNAME</div>
                    <div className="wpm">WPM</div>
                    <div className="accuracy">ACCURACY</div>
                    <div className="time">TIME</div>
                    <div className="expand"></div>
                </div>
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

const RefreshButton = ({ fetchData }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refresh = () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        fetchData();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 800);
    };

    return (
        <div
            className={classnames("refresh-btn", {
                "refresh-btn-disabled": isRefreshing,
            })}
            onClick={refresh}
        >
            <span
                className={classnames({
                    current: isRefreshing,
                })}
            >
                <FiRefreshCw />
            </span>
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

    return data.map((score, index) => <Score key={index} score={score} />);
};

const Score = ({ score }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="result-wrapper" onClick={() => setExpanded(!expanded)}>
            <div className="num">{score.rank}</div>
            <div className="details">
                <div className="result">
                    <div className="username">{score.display_name}</div>
                    <div className="wpm">{`${score.wpm}wpm`}</div>
                    <div className="accuracy">{`${score.accuracy}%`}</div>
                    <div className="time">{moment(score.played_at).fromNow()}</div>
                    <span
                        className={classnames("icon", {
                            expanded,
                        })}
                    >
                        {expanded ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                </div>
                <Collapse isOpened={expanded}>
                    <div className="quote">{`${score.text} (ID ${score.id})`}</div>
                </Collapse>
            </div>
        </div>
    );
};

export default Highscores;
