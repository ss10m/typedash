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
                setUserData(data);
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
            <Stats stats={userData.avg} />
            <Stats stats={userData.recentAvg} />
            <Graph data={userData.graph} />
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

const Stats = ({ stats }) => {
    return (
        <div className="stats">
            <div>
                <div>PLAYED</div>
                <div>{stats.count}</div>
            </div>
            <div>
                <div>AVERAGE WPM</div>
                <div>{stats.avg_wpm}</div>
            </div>
            <div>
                <div>AVERAGE ACCURACY</div>
                <div>{stats.avg_acc}</div>
            </div>
        </div>
    );
};

const Graph = ({ data }) => {
    const parsedData = [];
    const accuracyData = [];
    data.forEach((point, index) => {
        parsedData.push(["GAME " + (index + 1), point.wpm]);
        accuracyData.push(["GAME " + (index + 1), point.accuracy]);
    });

    return <Charts type="ordinal" graphWpm={parsedData} graphAccuracy={accuracyData} labelY />;
};

export default Profile;
