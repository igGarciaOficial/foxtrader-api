const pool = require('../utils/databaseMysql').promissePool;

module.exports = {

    async createCategory(name, desc){
        let sql = 'INSERT INTO tblCategoryProducts(name, description) values (?, ?);'

        const result = await pool.query(sql, [name, desc]);
        return result;
    },

    async getCategories(){
        let sql = 'SELECT idCategory as id, name, description FROM tblCategoryProducts;';

        const result = await pool.query(sql);
        return result[0];
    }

}