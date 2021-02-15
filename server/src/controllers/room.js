import db, { TOTAL_QUOTES } from ".././config/db.js";

const generateQuote = async () => {
    const randomId = Math.floor(Math.random() * TOTAL_QUOTES) + 1;
    const query = "SELECT * FROM quote WHERE id = $1";
    const values = [randomId];
    const result = await db.query(query, values);
    const query2 = `SELECT users.display_name, results.wpm, results.played_at, results.accuracy
                    FROM results 
                    INNER JOIN users ON users.id = results.user_id 
                    WHERE quote_id = $1
                    ORDER BY results.wpm DESC`;
    const values2 = [randomId];
    const result2 = await db.query(query2, values2);
    console.log(result2.rows);
    const { id, text, author, source } = result.rows[0];
    const length = text.split(" ").length;
    return { id, text, author, source, length, recent: result2.rows };
};

const saveScores = async (scores) => {
    if (!scores.length) return;
    console.log("===================================================");
    // const currentTime = new Date().getTime();
    // while (currentTime + 3000 >= new Date().getTime()) {}

    let topScore;
    scores.forEach((score) => {
        if (!topScore || topScore.wpm < score.wpm) topScore = score;
    });

    console.log(generateExpressions(scores.length, 4));
    const query = `INSERT INTO results(user_id, quote_id, wpm, accuracy) 
                   VALUES ${generateExpressions(scores.length, 4)}`;
    const values = scores.flat();
    db.query(query, values);

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
