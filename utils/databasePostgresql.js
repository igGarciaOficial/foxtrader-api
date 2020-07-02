const { Pool } = require('pg');

const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'fox-server',//'databaseFox',
    password: 's3nh@Postgres',
    port: 5432
});

module.exports= {pool};