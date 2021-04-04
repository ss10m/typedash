import db from ".././config/db.js";

const getQuotes = async (cb) => {
    const query = `WITH stats AS
                    (
                        SELECT res.quote_id, COUNT(*), ROUND(AVG(res.wpm), 2) AS avg_wpm, ROUND(AVG(res.accuracy), 2) AS avg_acc
                        FROM results as res
                        GROUP BY res.quote_id
                        ORDER BY res.quote_id
                    )
                   SELECT quote.id, quote.text, quote.author, quote.source,
                          COALESCE(stats.count, 0) AS count, COALESCE(stats.avg_wpm, 0) AS avg_wpm,
                          COALESCE(stats.avg_acc, 0) AS avg_acc
                   FROM quote
                   LEFT JOIN stats on quote.id = stats.quote_id`;
    const values = [];
    const results = await db.query(query, values);

    cb({
        meta: { ok: true, message: "" },
        data: { quotes: results.rows },
    });
};

export default getQuotes;
