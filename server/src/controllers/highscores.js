import db, { TOTAL_RESULTS } from ".././config/db.js";

const getHighscores = async (page, rowCount, cb) => {
    const pageCount = Math.ceil(TOTAL_RESULTS.current / rowCount);
    const query = `SELECT users.username, users.display_name, res.wpm, res.accuracy, res.played_at, res.quote_id,
                   RANK () OVER (ORDER BY res.wpm DESC, res.accuracy DESC)
                   FROM results as res
                   INNER JOIN users ON users.id = res.user_id
                   ORDER BY res.wpm DESC, res.accuracy DESC, res.played_at
                   LIMIT $1 OFFSET $2`;
    const values = [rowCount, (page - 1) * rowCount];
    const results = await db.query(query, values);

    cb({
        meta: { ok: true, message: "" },
        data: { page, results: results.rows, pageCount },
    });
};

export default getHighscores;
