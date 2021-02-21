import db, { TOTAL_QUOTES } from ".././config/db.js";

const generateQuote = async () => {
    const randomId = Math.floor(Math.random() * TOTAL_QUOTES) + 1001;
    const quoteQuery = `SELECT * FROM quote 
                        WHERE id = $1`;
    const topQuery = `SELECT users.display_name, results.wpm, results.played_at, results.accuracy
                      FROM results 
                      INNER JOIN users ON users.id = results.user_id 
                      WHERE quote_id = $1
                      ORDER BY results.wpm DESC
                      LIMIT 10`;
    const values = [randomId];

    const [quoteResult, topResult] = await Promise.all([
        db.query(quoteQuery, values),
        db.query(topQuery, values),
    ]);
    const top = topResult.rows;
    const { id, text, author, source } = quoteResult.rows[0];
    const length = text.split(" ").length;
    return { id, text, author, source, length, recent: top };
};

const saveScores = async (scores) => {
    if (!scores.length) return;
    console.log("===================================================");

    // let topScore;
    // scores.forEach((score) => {
    //     if (!topScore || topScore.wpm < score.wpm) topScore = score;
    // });

    // const query = `INSERT INTO results(user_id, quote_id, wpm, accuracy)
    //                VALUES ${generateExpressions(scores.length, 4)}`;
    // const values = scores.flat();
    // db.query(query, values);

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

export { generateQuote, saveScores };
