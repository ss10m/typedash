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
                message: "Invalid id",
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

const getResults = async (id, cb) => {
    if (!id) {
        return cb({
            meta: {
                ok: false,
                message: "Invalid id",
            },
            data: {},
        });
    }

    const [top, recent] = await Promise.all([getTopResults(id), getRecentResults(id)]);

    cb({
        meta: {
            ok: true,
            message: "",
        },
        data: {
            results: {
                top,
                recent,
            },
        },
    });
};

const getTopResults = async (quoteId) => {
    const topQuery = `SELECT users.display_name, users.username, res.wpm, res.accuracy, res.played_at,
                      RANK () OVER (ORDER BY res.wpm DESC, res.accuracy DESC)
                      FROM results as res
                      INNER JOIN users ON users.id = res.user_id
                      WHERE quote_id = $1
                      ORDER BY res.wpm DESC, res.accuracy DESC, res.played_at
                      LIMIT 10`;
    const values = [quoteId];
    const results = await db.query(topQuery, values);
    return results.rows;
};

const getRecentResults = async (quoteId) => {
    const topQuery = `SELECT users.display_name, users.username, res.wpm, res.accuracy, res.played_at,
                      RANK () OVER (ORDER BY res.played_at DESC, res.wpm DESC)
                      FROM results as res
                      INNER JOIN users ON users.id = res.user_id
                      WHERE quote_id = $1
                      ORDER BY res.played_at DESC, res.wpm DESC
                      LIMIT 10`;
    const values = [quoteId];
    const results = await db.query(topQuery, values);
    return results.rows;
};

export { getQuotes, getQuote, getResults };
