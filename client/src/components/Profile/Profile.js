// Libraries & utils
import { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

// SCSS
import "./Profile.scss";

const Profile = () => {
    const { username } = useParams();

    const fetchData = useCallback((name) => {
        console.log("FETCHING: " + name);
        // setIsFetching(true);
        // fetch("/api/highscores", {
        //     method: "POST",
        //     body: JSON.stringify({ page: pageRef.current, rowCount: rowCountRef.current }),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // })
        //     .then(handleResponse)
        //     .then((data) => {
        //         if (pageRef.current !== data.page) return;
        //         setHighscores(data.results);
        //         setPageCount(data.pageCount);
        //         setIsFetching(false);
        //     })
        //     .catch(() => {});
    }, []);

    useEffect(() => {
        fetchData(username);
    }, [username, fetchData]);

    return <h1>profile</h1>;
};

export default Profile;
