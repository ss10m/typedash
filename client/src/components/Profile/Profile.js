// Libraries & utils
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

// Icons
import { RiUser3Line } from "react-icons/ri";

// Components
import Charts from "components/Charts/Charts";
import Username from "./Username/Username";
import Results from "./Results/Results";
import QuoteModal from "components/QuoteModal/QuoteModal";
import Error from "components/Error/Error";

// Constants
import { handleResponse } from "helpers";

// SCSS
import "./Profile.scss";

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
        <div className="profile">
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
        </div>
    );
};

const Header = React.memo(({ username }) => {
    return (
        <div className="header">
            <div className="avatar">
                <RiUser3Line />
            </div>
            <Username text={username} />
        </div>
    );
});

const Stats = ({ allTime, recent }) => {
    return (
        <>
            <div className="stats">
                <div className="row">
                    <div className="title">ALL TIME STATS</div>
                    <div className="details">
                        <div className="stat">
                            <div>PLAYED</div>
                            <div>{allTime.count}</div>
                        </div>
                        <div className="stat">
                            <div>AVERAGE WPM</div>
                            <div>{allTime.avg_wpm}</div>
                        </div>
                        <div className="stat">
                            <div>AVERAGE ACCURACY</div>
                            <div>{allTime.avg_acc + "%"}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="title">RECENT FORM</div>
                    <div className="details">
                        <div className="stat">
                            <div>PLAYED</div>
                            <div>{recent.count}</div>
                        </div>
                        <div className="stat">
                            <div>AVERAGE WPM</div>
                            <div>{recent.avg_wpm}</div>
                        </div>
                        <div className="stat">
                            <div>AVERAGE ACCURACY</div>
                            <div>{recent.avg_acc + "%"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
