import Pool from "pg-pool";

import quotes from "../util/quotes.js";

let QUOTE_IDS = [];

const pgPool = new Pool({
    host: "db",
    database: "typedash",
    port: 5432,
    user: "typedash",
    password: "pw",
});

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len) throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

pgPool.connect(async (err) => {
    if (err) {
        console.error("connection error", err.stack);
    } else {
        const query = `SELECT array_agg(quote.id) as ids FROM quote`;
        const result = await pgPool.query(query, null);
        const ids = result.rows[0].ids;
        console.log(ids);

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

        // const query3 = `SELECT *
        //             FROM quote
        //             WHERE tokens @@ to_tsquery('can & a & man');`;
        // const result3 = await pgPool.query(query3, null);
        // console.log(result3.rows);
    }
});

export default {
    query: (text, params, callback) => {
        return pgPool.query(text, params, callback);
    },
};

export { pgPool, QUOTE_IDS };
