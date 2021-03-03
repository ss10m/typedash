import Pool from "pg-pool";

import quotes from "../util/quotes.js";

let QUOTE_IDS = [];
let TOTAL_RESULTS = { current: 0 };

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
        const query = `SELECT array_agg(quote.id) as ids FROM quote`;
        const result = await pgPool.query(query, null);
        const ids = result.rows[0].ids;
        console.log(ids);

        const query2 = `SELECT count(*) FROM results;`;
        const result2 = await pgPool.query(query2, null);
        TOTAL_RESULTS.current = parseInt(result2.rows[0].count);

        if (!ids || !ids.length) {
            for (const quote of quotes) {
                const queryInsert = `INSERT INTO quote(text, author, source) VALUES($1, $2, $3)`;
                const valuesInsert = [quote.text, quote.author, quote.source];
                await pgPool.query(queryInsert, valuesInsert);
            }

            const queryVector = `UPDATE quote d1  
                            SET tokens = to_tsvector(d1.text)  
                            FROM quote d2;`;
            await pgPool.query(queryVector, null);
        } else {
            QUOTE_IDS = ids;
        }
    }
});

export default {
    query: (text, params, callback) => {
        return pgPool.query(text, params, callback);
    },
};

export { pgPool, QUOTE_IDS, TOTAL_RESULTS };
