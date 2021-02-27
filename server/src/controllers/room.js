import db, { QUOTE_IDS } from ".././config/db.js";

const generateQuote = async (recentQuotes) => {
    const available = QUOTE_IDS.filter((id) => !recentQuotes.includes(id));
    const randomId = available[Math.floor(Math.random() * available.length)];
    const quoteQuery = `SELECT * FROM quote 
                        WHERE id = $1`;
    const values = [randomId];

    recentQuotes.push(randomId);
    if (recentQuotes.length > 5) recentQuotes.shift();

    const [quoteResult, topResults] = await Promise.all([
        db.query(quoteQuery, values),
        getTopResults(randomId),
    ]);

    const { id, text, author, source } = quoteResult.rows[0];
    const length = text.split(" ").length;
    return { id, text, author, source, length, results: topResults };
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
                      RANK () OVER (ORDER BY res.played_at DESC)
                      FROM results as res
                      INNER JOIN users ON users.id = res.user_id
                      WHERE quote_id = $1
                      ORDER BY res.played_at DESC
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
                      RANK () OVER (ORDER BY res.played_at DESC)
                      FROM results as res
                      INNER JOIN users ON users.id = res.user_id
                      WHERE quote_id = $1 AND user_id = $2
                      ORDER BY res.played_at DESC
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
    getTopResults,
    getRecentResults,
    getPlayerTopResults,
    getPlayerRecentResults,
    saveScores,
};
