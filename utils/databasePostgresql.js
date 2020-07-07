const { Pool } = require('pg');

/*const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'fox-server',//'databaseFox',
    password: 's3nh@Postgres',
    port: 5432
});*/

const pool = new Pool({
	user: 'xpgcjxflprjvjf',
	host: 'ec2-54-234-44-238.compute-1.amazonaws.com',
	database: 'd8o103e9atqme8',
	password: '0ed23a86e551a96cb436070b7c5d3ec75549474d4009cde85087d283e9b68a5f',
	port: 5432
});


module.exports= {pool};