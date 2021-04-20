import db from ".././config/db.js";

const getProfile = async (username, cb) => {
    const id = await getUserId(username);

    if (!id) {
        return cb({
            meta: {
                ok: false,
                message: "Username not found",
            },
            data: {},
        });
    }

    const [
        avgStats,
        recentAvgStats,
        graphData,
        topResults,
        recentResults,
    ] = await Promise.all([
        getAvgStats(id),
        getRecentAvgStats(id),
        getGraphData(id),
        getTopResults(id),
        getRecentResults(id),
    ]);

    const { avg, recentAvg } = validateData(avgStats[0], recentAvgStats[0]);

    cb({
        meta: { ok: true, message: "" },
        data: {
            avg,
            recentAvg,
            graph: graphData.reverse(),
            topResults,
            recentResults,
        },
    });
};

const validateData = (avgStats, recentAvgStats) => {
    Object.keys(avgStats).forEach((key) => {
        if (!avgStats[key]) avgStats[key] = 0;
        if (!recentAvgStats[key]) recentAvgStats[key] = 0;
    });
    return { avg: avgStats, recentAvg: recentAvgStats };
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

const getTopResults = async (id) => {
    const query = `SELECT res.wpm, res.accuracy, res.quote_id, res.played_at,
                   RANK () OVER (ORDER BY res.wpm DESC, res.accuracy DESC)
                   FROM results as res
                   WHERE res.user_id = $1
                   ORDER BY res.wpm DESC, res.accuracy DESC, res.played_at
                   LIMIT 10`;
    const values = [id];
    const results = await db.query(query, values);
    return results.rows;
};

const getRecentResults = async (id) => {
    const query = `SELECT res.wpm, res.accuracy, res.quote_id, res.played_at,
                   RANK () OVER (ORDER BY res.played_at DESC, res.wpm DESC)
                   FROM results as res
                   WHERE res.user_id = $1
                   ORDER BY res.played_at DESC, res.wpm DESC
                   LIMIT 10`;
    const values = [id];
    const results = await db.query(query, values);
    return results.rows;
};

export default getProfile;
