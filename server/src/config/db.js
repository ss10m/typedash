import Pool from "pg-pool";

export const pgPool = new Pool({
    host: "db",
    database: "typing",
    port: 5432,
    user: "typing",
    password: "pw",
});

export default {
    query: (text, params, callback) => {
        return pgPool.query(text, params, callback);
    },
};
