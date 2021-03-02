import db from ".././config/db.js";

const getHighscores = async (page, cb) => {
    console.log(page);
    const query = `SELECT users.display_name, res.wpm, res.accuracy, res.played_at, quote.text,
                   RANK () OVER (ORDER BY res.wpm DESC, res.accuracy DESC)
                   FROM results as res
                   INNER JOIN users ON users.id = res.user_id
                   INNER JOIN quote ON quote.id = res.quote_id
                   ORDER BY res.wpm DESC, res.accuracy DESC, res.played_at
                   LIMIT 20 OFFSET $1`;
    const values = [(page - 1) * 20];
    const results = await db.query(query, values);
    //console.log(results.rows);

    setTimeout(() => {
        cb({
            meta: { ok: true, message: "" },
            data: results.rows,
        });
    }, 200);
};

export default getHighscores;
