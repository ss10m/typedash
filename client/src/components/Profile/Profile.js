// Libraries & utils
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Textfit } from "react-textfit";

// Icons
import { RiUser3Line } from "react-icons/ri";

// Components
import Charts from "components/Charts/Charts";
import Results from "./Results/Results";
import QuoteModal from "components/QuoteModal/QuoteModal";
import Error from "components/Error/Error";

// Constants
import { handleResponse } from "helpers";

// Styles
import * as Styled from "./styles";

const Profile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [containsError, setContainsError] = useState(false);
    const [quoteModal, setQuoteModal] = useState(false);

    const fetchData = useCallback((username) => {
        fetch("/api/profile", {
            method: "POST",
            body: JSON.stringify({ username }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(handleResponse)
            .then((data) => {
                const { avg, recentAvg, graph, topResults, recentResults } = data;
                const graphData = { wpm: [], accuracy: [] };
                graph.forEach((point, index) => {
                    graphData["wpm"].push(["GAME " + (index + 1), point.wpm]);
                    graphData["accuracy"].push(["GAME " + (index + 1), point.accuracy]);
                });
                setProfile({ avg, recentAvg, graph: graphData, topResults, recentResults });
            })
            .catch(() => {
                setContainsError(true);
            });
    }, []);

    useEffect(() => {
        setProfile(null);
        setContainsError(false);
        fetchData(username);
    }, [username, fetchData]);

    if (containsError) return <Error msg="User not found" />;
    if (!profile) return null;

    return (
        <Styled.Profile>
            <Header username={username} />
            <Stats allTime={profile.avg} recent={profile.recentAvg} />
            <Charts
                type="ordinal"
                header={`LAST ${profile.graph.wpm.length} GAMES`}
                graphWpm={profile.graph.wpm}
                graphAccuracy={profile.graph.accuracy}
                showEmpty
                labelY
            />
            <Results
                top={profile.topResults}
                recent={profile.recentResults}
                setQuoteModal={setQuoteModal}
            />
            {quoteModal && (
                <QuoteModal quoteId={quoteModal} closeModal={() => setQuoteModal(null)} />
            )}
        </Styled.Profile>
    );
};

const Header = React.memo(({ username }) => {
    return (
        <Styled.Header>
            <Styled.Avatar>
                <RiUser3Line />
            </Styled.Avatar>
            <Styled.Username>
                <div>
                    <Textfit
                        mode="single"
                        forceSingleModeWidth={false}
                        max={500}
                        style={{
                            height: "100%",
                            lineHeight: "80px",
                            fontWeight: "600",
                        }}
                    >
                        {username.toUpperCase()}
                    </Textfit>
                </div>
            </Styled.Username>
        </Styled.Header>
    );
});

const Stats = ({ allTime, recent }) => {
    return (
        <Styled.Stats>
            <Styled.StateRow>
                <Styled.StatsHeader>ALL TIME STATS</Styled.StatsHeader>
                <Styled.StatsColumns>
                    <Styled.Stat>
                        <Styled.StatHeader>PLAYED</Styled.StatHeader>
                        <Styled.StatValue>{allTime.count}</Styled.StatValue>
                    </Styled.Stat>
                    <Styled.Stat>
                        <Styled.StatHeader>AVERAGE WPM</Styled.StatHeader>
                        <Styled.StatValue>{allTime.avg_wpm}</Styled.StatValue>
                    </Styled.Stat>
                    <Styled.Stat>
                        <Styled.StatHeader>AVERAGE ACCURACY</Styled.StatHeader>
                        <Styled.StatValue>{allTime.avg_acc + "%"}</Styled.StatValue>
                    </Styled.Stat>
                </Styled.StatsColumns>
            </Styled.StateRow>
            <Styled.StateRow>
                <Styled.StatsHeader>RECENT FORM</Styled.StatsHeader>
                <Styled.StatsColumns>
                    <Styled.Stat>
                        <Styled.StatHeader>PLAYED</Styled.StatHeader>
                        <Styled.StatValue>{recent.count}</Styled.StatValue>
                    </Styled.Stat>
                    <Styled.Stat>
                        <Styled.StatHeader>AVERAGE WPM</Styled.StatHeader>
                        <Styled.StatValue>{recent.avg_wpm}</Styled.StatValue>
                    </Styled.Stat>
                    <Styled.Stat>
                        <Styled.StatHeader>AVERAGE ACCURACY</Styled.StatHeader>
                        <Styled.StatValue>{recent.avg_acc + "%"}</Styled.StatValue>
                    </Styled.Stat>
                </Styled.StatsColumns>
            </Styled.StateRow>
        </Styled.Stats>
    );
};

export default Profile;
