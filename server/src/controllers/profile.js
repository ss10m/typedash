import db from ".././config/db.js";

const getProfile = async (username, cb) => {
    console.log(username);

    const id = await getUserId(username);
    console.log(id);

    if (!id) {
        return setTimeout(() => {
            cb({
                meta: {
                    ok: false,
                    message: "Username not found",
                },
                data: {},
            });
        }, 1000);
    }

    const [avgStats, recentAvgStats, graphData] = await Promise.all([
        getAvgStats(id),
        getRecentAvgStats(id),
        getGraphData(id),
    ]);

    console.log(avgStats);
    console.log(recentAvgStats);
    console.log(graphData);

    setTimeout(() => {
        cb({
            meta: { ok: true, message: "" },
            data: {
                avg: avgStats[0],
                recentAvg: recentAvgStats[0],
                graph: graphData.reverse(),
            },
        });
    }, 1000);
};

const getUserId = async (username) => {
    const query = `SELECT id
                   FROM users
                   WHERE users.username = $1`;
    const values = [username];
    const results = await db.query(query, values);
    return results.rows.length ? results.rows[0].id : null;
};

const getAvgStats = async (id) => {
    const query = `SELECT COUNT(*), ROUND(AVG(res.wpm), 2) AS avg_wpm,  ROUND(AVG(res.accuracy), 2) AS avg_acc
                   FROM results as res
                   WHERE res.user_id = $1`;
    const values = [id];
    const results = await db.query(query, values);
    return results.rows;
};

const getRecentAvgStats = async (id) => {
    const query = `WITH rec AS
                    (
                        SELECT *
                        FROM results as res
                        WHERE res.user_id = $1
                        ORDER BY res.played_at DESC
                        LIMIT 10
                    )
                   SELECT COUNT(*), ROUND(AVG(rec.wpm), 2) AS avg_wpm,  ROUND(AVG(rec.accuracy), 2) AS avg_acc
                   FROM rec`;

    const values = [id];
    const results = await db.query(query, values);
    return results.rows;
};

const getGraphData = async (id) => {
    const topQuery = `SELECT res.wpm, res.accuracy, res.played_at
                      FROM results as res
                      WHERE res.user_id = $1
                      ORDER BY res.played_at DESC
                      LIMIT 10`;
    const values = [id];
    const results = await db.query(topQuery, values);
    return results.rows;
};

export default getProfile;
