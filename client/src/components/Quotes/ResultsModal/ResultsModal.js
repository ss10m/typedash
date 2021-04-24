// Libraries & utils
import { useState, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

// Constants
import { handleResponse } from "helpers";
import { RESULT_TYPE } from "helpers/constants";

// Components
import withClickWatcher from "components/withClickWatcher/withClickWatcher";

// Styles
import * as Styles from "./styles";

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

    return (
        <Styles.Background>
            <Styles.Wrapper>
                {results && (
                    <Modal quoteId={quoteId} results={results} closeModal={closeModal} />
                )}
            </Styles.Wrapper>
        </Styles.Background>
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
            <Styles.Modal ref={ref}>
                <Styles.Tabs>
                    <Styles.Tab
                        onClick={() => changeView(RESULT_TYPE.TOP)}
                        selected={view === RESULT_TYPE.TOP}
                    >
                        TOP 10
                    </Styles.Tab>
                    <Styles.Tab
                        onClick={() => changeView(RESULT_TYPE.RECENT)}
                        selected={view === RESULT_TYPE.RECENT}
                    >
                        RECENT
                    </Styles.Tab>
                </Styles.Tabs>
                <Styles.Results>
                    <ResultsHeader />
                    <ResultsData
                        data={view === RESULT_TYPE.TOP ? results.top : results.recent}
                    />
                </Styles.Results>
                <Styles.Footer>
                    <p>{`QUOTE#${quoteId}`}</p>
                    <Styles.Button onClick={closeModal}>CLOSE</Styles.Button>
                </Styles.Footer>
            </Styles.Modal>
        );
    })
);

const ResultsHeader = () => {
    return (
        <Styles.ResultsHeader>
            <Styles.Rank>#</Styles.Rank>
            <Styles.Username>USERNAME</Styles.Username>
            <Styles.Wpm>WPM</Styles.Wpm>
            <Styles.Accuracy>ACCURACY</Styles.Accuracy>
            <Styles.Time>TIME</Styles.Time>
        </Styles.ResultsHeader>
    );
};

const ResultsData = ({ data }) => {
    if (!data.length) {
        return <Styles.ResultsData empty>No results found</Styles.ResultsData>;
    }
    return (
        <Styles.ResultsData>
            {data.map((score, index) => (
                <Styles.Result key={index}>
                    <Styles.RankValue>{score.rank}</Styles.RankValue>
                    <Styles.UsernameValue>
                        <Link to={`/profile/${score.username}`}>{score.display_name}</Link>
                    </Styles.UsernameValue>
                    <Styles.WpmValue>{`${score.wpm}wpm`}</Styles.WpmValue>
                    <Styles.AccuracyValue>{`${score.accuracy}%`}</Styles.AccuracyValue>
                    <Styles.TimeValue>{moment(score.played_at).fromNow()}</Styles.TimeValue>
                </Styles.Result>
            ))}
        </Styles.ResultsData>
    );
};

export default ResultsModal;
