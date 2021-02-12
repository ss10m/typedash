import Pool from "pg-pool";

import quotes from "../util/quotes.js";

let TOTAL_QUOTES = 0;

const pgPool = new Pool({
    host: "db",
    database: "typedash",
    port: 5432,
    user: "typedash",
    password: "pw",
});

pgPool.connect(async (err) => {
    if (err) {
        console.error("connection error", err.stack);
    } else {
        console.log("connected");

        const queryInsert = `SELECT COUNT(*) FROM quote`;
        const result = await pgPool.query(queryInsert, null);

        let totalQuotes = parseInt(result.rows[0].count);

        if (!totalQuotes) {
            quotes.forEach((quote) => {
                const queryInsert = `INSERT INTO quote(text, author, source) VALUES($1, $2, $3)`;
                const valuesInsert = [quote.text, quote.author, quote.source];
                pgPool.query(queryInsert, valuesInsert);
            });
            totalQuotes = quotes.length;
        }
        TOTAL_QUOTES = totalQuotes;
    }
});

export default {
    query: (text, params, callback) => {
        return pgPool.query(text, params, callback);
    },
};

export { pgPool, TOTAL_QUOTES };
