// Libraries & utils
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

// Context
import { useRoomContext } from "../context";

// Constants
import { RESULT_TYPE } from "helpers/constants";

// Styles
import * as Styled from "./styles";

const Results = ({ updateResults }) => {
    const [view, setView] = useState(RESULT_TYPE.TOP);
    const viewRef = useRef(RESULT_TYPE.TOP);
    const [results, setResults] = useState([]);

    const { data } = useRoomContext();
    const { quote } = data;

    useEffect(() => {
        if (!quote) return;
        const { type, force, data } = quote.results;

        if (viewRef.current !== type) {
            if (!force) return;
            viewRef.current = type;
            setView(type);
        }
        setResults(data);
    }, [quote]);

    const changeView = (newView) => {
        if (view === newView) return;
        setView(newView);
        viewRef.current = newView;
        updateResults(newView);
    };

    return (
        <>
            <Styled.Tabs>
                <Styled.Tab
                    $selected={view === RESULT_TYPE.TOP}
                    onClick={() => changeView(RESULT_TYPE.TOP)}
                >
                    TOP 10
                </Styled.Tab>
                <Styled.Tab
                    $selected={view === RESULT_TYPE.RECENT}
                    onClick={() => changeView(RESULT_TYPE.RECENT)}
                >
                    RECENT
                </Styled.Tab>
                <Styled.Tab
                    $selected={view === RESULT_TYPE.PLAYER_TOP}
                    onClick={() => changeView(RESULT_TYPE.PLAYER_TOP)}
                >
                    YOUR TOP 10
                </Styled.Tab>
                <Styled.Tab
                    $selected={view === RESULT_TYPE.PLAYER_RECENT}
                    onClick={() => changeView(RESULT_TYPE.PLAYER_RECENT)}
                >
                    YOUR RECENT
                </Styled.Tab>
            </Styled.Tabs>
            <Styled.Results>
                <Styled.ResultsHeader>
                    <Styled.Rank>#</Styled.Rank>
                    <Styled.Username>USERNAME</Styled.Username>
                    <Styled.Wpm>WPM</Styled.Wpm>
                    <Styled.Accuracy>ACCURACY</Styled.Accuracy>
                    <Styled.Time>TIME</Styled.Time>
                </Styled.ResultsHeader>
                <ResultsData results={results} />
            </Styled.Results>
            <Styled.Footer />
        </>
    );
};

const ResultsData = ({ results }) => {
    if (!results.length) {
        return <Styled.ResultsData empty>No results found</Styled.ResultsData>;
    }
    return (
        <Styled.ResultsData>
            {results.map((score, index) => (
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
export default Results;
