const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 's3nh@Mysql',
	database: 'databaseFox',
	multipleStatements: true
});

const pool = mysql.createPool({
	connectionLimit : 50,
	host: 'localhost',
	user: 'root',
	password: 's3nh@Mysql',
	database: 'databaseFox'

});

const promissePool = pool.promise();

module.exports = {promissePool, pool, connection};