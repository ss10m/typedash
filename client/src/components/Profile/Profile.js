// Libraries & utils
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

// Icons
import { RiUser3Line } from "react-icons/ri";

// Components
import Charts from "components/Charts/Charts";
import Username from "./Username/Username";

// Constants
import { handleResponse } from "helpers";

// SCSS
import "./Profile.scss";

const Profile = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback((username) => {
        setIsLoading(true);
        fetch("/api/profile", {
            method: "POST",
            body: JSON.stringify({ username }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(handleResponse)
            .then((data) => {
                const { avg, recentAvg, graph } = data;
                const graphData = { wpm: [], accuracy: [] };
                graph.forEach((point, index) => {
                    graphData["wpm"].push(["GAME " + (index + 1), point.wpm]);
                    graphData["accuracy"].push(["GAME " + (index + 1), point.accuracy]);
                });
                setUserData({ avg, recentAvg, graph: graphData });
            })
            .catch(() => {
                setUserData(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchData(username);
    }, [username, fetchData]);

    if (isLoading) return <div>isLoading</div>;
    if (!userData) return <div>User not found</div>;

    return (
        <div className="profile">
            <Header username={username} />
            <Stats allTime={userData.avg} recent={userData.recentAvg} />
            <Charts
                type="ordinal"
                header={`LAST ${userData.graph.wpm.length} GAMES`}
                graphWpm={userData.graph.wpm}
                graphAccuracy={userData.graph.accuracy}
                showEmpty
                labelY
            />
            <div>asdg</div>
        </div>
    );
};

const Header = ({ username }) => {
    return (
        <div className="header">
            <div className="avatar">
                <RiUser3Line />
            </div>
            <Username text={username} />
        </div>
    );
};

const Stats = ({ allTime, recent }) => {
    return (
        <>
            <div className="stats-header">STATS</div>
            <div className="stats">
                <div className="row">
                    <div className="title">ALL TIME</div>
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
                <div className="row">
                    <div className="title">RECENT FORM</div>
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
        </>
    );
};

export default Profile;
