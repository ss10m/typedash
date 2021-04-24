// Libraries & utils
import React, { useState, useEffect, useRef, useCallback } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

// Icons
import { FiRefreshCw } from "react-icons/fi";

// Components
import Pagination from "./Pagination/Pagination";
import QuoteModal from "components/QuoteModal/QuoteModal";

// Constants
import { handleResponse } from "helpers";

// Styles
import * as Styles from "./styles";

const Highscores = () => {
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [scores, setScores] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [marginBottom, setMarginBottom] = useState(0);
    const [quoteModal, setQuoteModal] = useState(false);
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
                setScores(data.results);
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
        <>
            <Styles.Highscores>
                <Styles.Tabs>
                    <p>HIGHSCORES</p>
                    <RefreshButton fetchData={fetchData} disabled={isFetching} />
                </Styles.Tabs>
                <Header />
                <Styles.Scores ref={containerRef}>
                    <Scores
                        scores={scores}
                        countPerPage={rowCountRef.current}
                        setQuoteModal={setQuoteModal}
                    />
                </Styles.Scores>
                <Pagination
                    page={page}
                    updatePage={updatePage}
                    pageCount={pageCount}
                    disabled={isFetching}
                    marginBottom={marginBottom}
                />
            </Styles.Highscores>
            {quoteModal && (
                <QuoteModal quoteId={quoteModal} closeModal={() => setQuoteModal(null)} />
            )}
        </>
    );
};

const RefreshButton = ({ fetchData, disabled }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refresh = () => {
        if (disabled || isRefreshing) return;
        setIsRefreshing(true);
        fetchData();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 800);
    };

    return (
        <Styles.RefreshBtn
            onClick={refresh}
            $disabled={disabled || isRefreshing}
            $animate={isRefreshing}
        >
            <span>
                <FiRefreshCw />
            </span>
        </Styles.RefreshBtn>
    );
};

export const Header = () => {
    return (
        <Styles.Header>
            <Styles.Rank>#</Styles.Rank>
            <Styles.Username>USERNAME</Styles.Username>
            <Styles.Wpm>WPM</Styles.Wpm>
            <Styles.Accuracy>ACCURACY</Styles.Accuracy>
            <Styles.Time>TIME</Styles.Time>
            <Styles.Quote>QUOTE</Styles.Quote>
        </Styles.Header>
    );
};

const Scores = ({ scores, countPerPage, setQuoteModal }) => {
    if (!scores) {
        return null;
    }
    if (!scores.length) {
        return <Styles.NoResults>No results found</Styles.NoResults>;
    }

    return scores.map((score, index) => (
        <Styles.Result key={index} $hideBorder={index + 1 === countPerPage}>
            <Styles.RankValue>{score.rank}</Styles.RankValue>
            <Styles.UsernameValue>
                <Link to={`/profile/${score.username}`}>{score.display_name}</Link>
            </Styles.UsernameValue>
            <Styles.WpmValue>{`${score.wpm}wpm`}</Styles.WpmValue>
            <Styles.AccuracyValue>{`${score.accuracy}%`}</Styles.AccuracyValue>
            <Styles.TimeValue>{moment(score.played_at).fromNow()}</Styles.TimeValue>
            <Styles.QuoteValue>
                <span
                    onClick={() => setQuoteModal(score.quote_id)}
                >{`${score.quote_id}`}</span>
            </Styles.QuoteValue>
        </Styles.Result>
    ));
};

export default Highscores;
