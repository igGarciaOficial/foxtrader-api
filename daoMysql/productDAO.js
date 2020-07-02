const pool = require('../utils/databaseMysql.js').promissePool;

module.exports = {

    async createProduct(name, description, price, category){

        let sql = 'INSERT INTO tblProduct(name, description, price, category) values (?, ?, ?, ?);';

        const result = await pool.query(sql, [name, description, price, category]);
        
        return result[0];

    },

    async readProducts(category){
    	let sql = 'SELECT idProduct as id, name, description, price FROM tblProduct where category = ?;';

    	const result = await pool.query(sql, [category]);

    	return result;
    }


}
