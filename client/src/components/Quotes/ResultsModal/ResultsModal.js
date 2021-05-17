// Libraries & utils
import { useState, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

// Hooks
import { useEventListener } from "hooks";

// Constants
import { handleResponse } from "helpers";
import { RESULT_TYPE } from "helpers/constants";

// Components
import withClickWatcher from "components/withClickWatcher/withClickWatcher";

// Styles
import * as Styled from "./styles";

const ResultsModal = ({ quoteId, closeModal }) => {
    const [results, setResults] = useState(null);

    useEffect(() => {
        fetch(`/api/quote/${quoteId}/results`)
            .then(handleResponse)
            .then(({ results }) => {
                setResults(results);
            })
            .catch(() => closeModal());
    }, [quoteId, closeModal]);

    useEffect(() => {
        const scrollY = window.pageYOffset;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            window.scrollTo(0, scrollY);
        };
    }, []);

    useEventListener("keydown", (event) => {
        if (event.keyCode === 27) {
            closeModal();
        }
    });

    return (
        <Styled.Background>
            <Styled.Wrapper>
                {results && (
                    <Modal quoteId={quoteId} results={results} closeModal={closeModal} />
                )}
            </Styled.Wrapper>
        </Styled.Background>
    );
};

const Modal = withClickWatcher(
    forwardRef((props, ref) => {
        const { isVisible, quoteId, results, closeModal } = props;
        const [view, setView] = useState(RESULT_TYPE.TOP);

        useEffect(() => {
            if (!isVisible) closeModal();
        }, [isVisible, closeModal]);

        const changeView = (newView) => {
            if (newView === view) return;
            setView(newView);
        };

        return (
            <Styled.Modal ref={ref}>
                <Styled.Tabs>
                    <Styled.Tab
                        onClick={() => changeView(RESULT_TYPE.TOP)}
                        selected={view === RESULT_TYPE.TOP}
                    >
                        TOP 10
                    </Styled.Tab>
                    <Styled.Tab
                        onClick={() => changeView(RESULT_TYPE.RECENT)}
                        selected={view === RESULT_TYPE.RECENT}
                    >
                        RECENT
                    </Styled.Tab>
                </Styled.Tabs>
                <Styled.Results>
                    <ResultsHeader />
                    <ResultsData
                        data={view === RESULT_TYPE.TOP ? results.top : results.recent}
                    />
                </Styled.Results>
                <Styled.Footer>
                    <p>{`QUOTE#${quoteId}`}</p>
                    <Styled.Button onClick={closeModal}>CLOSE</Styled.Button>
                </Styled.Footer>
            </Styled.Modal>
        );
    })
);

const ResultsHeader = () => {
    return (
        <Styled.ResultsHeader>
            <Styled.Rank>#</Styled.Rank>
            <Styled.Username>USERNAME</Styled.Username>
            <Styled.Wpm>WPM</Styled.Wpm>
            <Styled.Accuracy>ACCURACY</Styled.Accuracy>
            <Styled.Time>TIME</Styled.Time>
        </Styled.ResultsHeader>
    );
};

const ResultsData = ({ data }) => {
    if (!data.length) {
        return <Styled.ResultsData empty>No results found</Styled.ResultsData>;
    }
    return (
        <Styled.ResultsData>
            {data.map((score, index) => (
                <Styled.Result key={index}>
                    <Styled.RankValue>{score.rank}</Styled.RankValue>
                    <Styled.UsernameValue>
                        <Link to={`/profile/${score.username}`}>{score.display_name}</Link>
                    </Styled.UsernameValue>
                    <Styled.WpmValue>{`${score.wpm}wpm`}</Styled.WpmValue>
                    <Styled.AccuracyValue>{`${score.accuracy}%`}</Styled.AccuracyValue>
                    <Styled.TimeValue>{moment(score.played_at).fromNow()}</Styled.TimeValue>
                </Styled.Result>
            ))}
        </Styled.ResultsData>
    );
};

export default ResultsModal;
