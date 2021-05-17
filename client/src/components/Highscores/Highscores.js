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
import * as Styled from "./styles";

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
            <Styled.Highscores>
                <Styled.Tabs>
                    <p>HIGHSCORES</p>
                    <RefreshButton fetchData={fetchData} disabled={isFetching} />
                </Styled.Tabs>
                <Header />
                <Styled.Scores ref={containerRef}>
                    <Scores
                        scores={scores}
                        countPerPage={rowCountRef.current}
                        setQuoteModal={setQuoteModal}
                    />
                </Styled.Scores>
                <Pagination
                    page={page}
                    updatePage={updatePage}
                    pageCount={pageCount}
                    disabled={isFetching}
                    marginBottom={marginBottom}
                />
            </Styled.Highscores>
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
        <Styled.RefreshBtn
            onClick={refresh}
            $disabled={disabled || isRefreshing}
            $animate={isRefreshing}
        >
            <span>
                <FiRefreshCw />
            </span>
        </Styled.RefreshBtn>
    );
};

export const Header = () => {
    return (
        <Styled.Header>
            <Styled.Rank>#</Styled.Rank>
            <Styled.Username>USERNAME</Styled.Username>
            <Styled.Wpm>WPM</Styled.Wpm>
            <Styled.Accuracy>ACCURACY</Styled.Accuracy>
            <Styled.Time>TIME</Styled.Time>
            <Styled.Quote>QUOTE</Styled.Quote>
        </Styled.Header>
    );
};

const Scores = ({ scores, countPerPage, setQuoteModal }) => {
    if (!scores) {
        return null;
    }
    if (!scores.length) {
        return <Styled.NoResults>No results found</Styled.NoResults>;
    }

    return scores.map((score, index) => (
        <Styled.Result key={index} $hideBorder={index + 1 === countPerPage}>
            <Styled.RankValue>{score.rank}</Styled.RankValue>
            <Styled.UsernameValue>
                <Link to={`/profile/${score.username}`}>{score.display_name}</Link>
            </Styled.UsernameValue>
            <Styled.WpmValue>{`${score.wpm}wpm`}</Styled.WpmValue>
            <Styled.AccuracyValue>{`${score.accuracy}%`}</Styled.AccuracyValue>
            <Styled.TimeValue>{moment(score.played_at).fromNow()}</Styled.TimeValue>
            <Styled.QuoteValue>
                <span
                    onClick={() => setQuoteModal(score.quote_id)}
                >{`${score.quote_id}`}</span>
            </Styled.QuoteValue>
        </Styled.Result>
    ));
};

export default Highscores;
