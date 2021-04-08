import db from "../config/db.js";

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

const getQuote = async (id, cb) => {
    if (!id) {
        return cb({
            meta: {
                ok: false,
                message: "Id not found",
            },
            data: {},
        });
    }

    const query = `SELECT quote.id, quote.text, quote.author, quote.source,
                          COUNT(*), ROUND(AVG(res.wpm), 2) AS avg_wpm, 
                          ROUND(AVG(res.accuracy), 2) AS avg_acc
                   FROM results AS res
                   INNER JOIN quote ON quote.id = res.quote_id
                   WHERE quote_id = $1
                   GROUP BY quote.id`;
    const values = [id];
    const results = await db.query(query, values);

    if (!results.rows.length) {
        return cb({
            meta: {
                ok: false,
                message: "Quote not found",
            },
            data: {},
        });
    }

    cb({
        meta: { ok: true, message: "" },
        data: { quote: results.rows[0] },
    });
};

export { getQuotes, getQuote };
