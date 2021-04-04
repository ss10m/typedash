import db, { QUOTE_IDS, TOTAL_RESULTS } from ".././config/db.js";
import { RESULT_TYPE } from "../util/constants.js";

const generateQuote = async (recentQuotes, requestedQuote = null) => {
    let quoteId = requestedQuote;
    if (!quoteId) {
        const available = QUOTE_IDS.filter((id) => !recentQuotes.includes(id));
        quoteId = available[Math.floor(Math.random() * available.length)];
    }

    recentQuotes.push(quoteId);
    if (recentQuotes.length > 5) recentQuotes.shift();

    const [quoteResult, topResults, statsResults] = await Promise.all([
        getQuote(quoteId),
        getTopResults(quoteId),
        getStats(quoteId),
    ]);

    const { id, text, author, source } = quoteResult[0];
    const length = text.split(" ").length;
    const stats = statsResults[0];
    const results = { type: RESULT_TYPE.TOP, force: true, data: topResults };
    return { id, text, author, source, length, stats, results };
};

const getQuote = async (quoteId) => {
    const quoteQuery = `SELECT * FROM quote 
                        WHERE id = $1`;
    const values = [quoteId];
    const quoteResults = await db.query(quoteQuery, values);
    return quoteResults.rows;
};

const getStats = async (quoteId) => {
    const topQuery = `SELECT COUNT(*), ROUND(AVG(res.wpm), 2) AS avg_wpm, ROUND(AVG(res.accuracy), 2) AS avg_acc
                      FROM results as res
                      WHERE quote_id = $1`;
    const values = [quoteId];
    const topResults = await db.query(topQuery, values);
    return topResults.rows;
};

const getTopResults = async (quoteId) => {
    const topQuery = `SELECT users.display_name, res.wpm, res.accuracy, res.played_at,
                      RANK () OVER (ORDER BY res.wpm DESC, res.accuracy DESC)
                      FROM results as res
                      INNER JOIN users ON users.id = res.user_id
                      WHERE quote_id = $1
                      ORDER BY res.wpm DESC, res.accuracy DESC, res.played_at
                      LIMIT 10`;
    const values = [quoteId];
    const topResults = await db.query(topQuery, values);
    return topResults.rows;
};

const getRecentResults = async (quoteId) => {
    const topQuery = `SELECT users.display_name, res.wpm, res.accuracy, res.played_at,
                      RANK () OVER (ORDER BY res.played_at DESC, res.wpm DESC)
                      FROM results as res
                      INNER JOIN users ON users.id = res.user_id
                      WHERE quote_id = $1
                      ORDER BY res.played_at DESC, res.wpm DESC
                      LIMIT 10`;
    const values = [quoteId];
    const recentResults = await db.query(topQuery, values);
    return recentResults.rows;
};

const getPlayerTopResults = async (quoteId, playerId) => {
    const topQuery = `SELECT users.display_name, res.wpm, res.accuracy, res.played_at,
                      RANK () OVER (ORDER BY res.wpm DESC, res.accuracy DESC)
                      FROM results as res
                      INNER JOIN users ON users.id = res.user_id
                      WHERE quote_id = $1 AND user_id = $2
                      ORDER BY res.wpm DESC, res.accuracy DESC, res.played_at
                      LIMIT 10`;
    const values = [quoteId, playerId];
    const playerTopResults = await db.query(topQuery, values);
    return playerTopResults.rows;
};

const getPlayerRecentResults = async (quoteId, playerId) => {
    const topQuery = `SELECT users.display_name, res.wpm, res.accuracy, res.played_at,
                      RANK () OVER (ORDER BY res.played_at DESC, res.wpm DESC)
                      FROM results as res
                      INNER JOIN users ON users.id = res.user_id
                      WHERE quote_id = $1 AND user_id = $2
                      ORDER BY res.played_at DESC, res.wpm DESC
                      LIMIT 10`;
    const values = [quoteId, playerId];
    const playerRecentResults = await db.query(topQuery, values);
    return playerRecentResults.rows;
};

const saveScores = async (scores) => {
    if (!scores.length) return;
    const query = `INSERT INTO results(user_id, quote_id, wpm, accuracy)
                   VALUES ${generateExpressions(scores.length, 4)}`;
    const values = scores.flat();
    await db.query(query, values);
    TOTAL_RESULTS.current += scores.length;
    console.log(scores);
};

const generateExpressions = (rowCount, columnCount) => {
    let index = 1;
    return Array(rowCount)
        .fill(0)
        .map(
            (v) =>
                `(${Array(columnCount)
                    .fill(0)
                    .map((v) => `$${index++}`)
                    .join(", ")})`
        )
        .join(", ");
};

export {
    generateQuote,
    getStats,
    getTopResults,
    getRecentResults,
    getPlayerTopResults,
    getPlayerRecentResults,
    saveScores,
};
