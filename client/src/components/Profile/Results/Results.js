// Libraries & utils
import { useState } from "react";
import moment from "moment";

// Constants
import { RESULT_TYPE } from "helpers/constants";

// Styles
import * as Styled from "./styles";

const Results = ({ top, recent, setQuoteModal }) => {
    const [view, setView] = useState(RESULT_TYPE.TOP);

    const changeView = (newView) => {
        if (newView === view) return;
        setView(newView);
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
            </Styled.Tabs>
            <Styled.Results>
                <Styled.ResultsHeader>
                    <Styled.Rank>#</Styled.Rank>
                    <Styled.Wpm>WPM</Styled.Wpm>
                    <Styled.Accuracy>ACCURACY</Styled.Accuracy>
                    <Styled.Time>TIME</Styled.Time>
                    <Styled.Quote>QUOTE</Styled.Quote>
                </Styled.ResultsHeader>
                <ResultsData
                    data={view === RESULT_TYPE.TOP ? top : recent}
                    setQuoteModal={setQuoteModal}
                />
            </Styled.Results>
            <Styled.Footer />
        </>
    );
};

const ResultsData = ({ data, setQuoteModal }) => {
    if (!data.length) {
        return <Styled.ResultsData empty>No results found</Styled.ResultsData>;
    }

    return (
        <Styled.ResultsData>
            {data.map((score, index) => (
                <Styled.Result key={index}>
                    <Styled.RankValue>{score.rank}</Styled.RankValue>
                    <Styled.WpmValue>{`${score.wpm}wpm`}</Styled.WpmValue>
                    <Styled.AccuracyValue>{`${score.accuracy}%`}</Styled.AccuracyValue>
                    <Styled.TimeValue>{moment(score.played_at).fromNow()}</Styled.TimeValue>
                    <Styled.QuoteValue>
                        <span
                            onClick={() => setQuoteModal(score.quote_id)}
                        >{`#${score.quote_id}`}</span>
                    </Styled.QuoteValue>
                </Styled.Result>
            ))}
        </Styled.ResultsData>
    );
};

export default Results;
