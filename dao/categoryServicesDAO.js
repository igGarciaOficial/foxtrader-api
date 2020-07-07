const pool = require('../utils/databasePostgresql').pool;

module.exports = {
    createCategory(name, desc){
        let sql = 'INSERT INTO tblCategoryProducts(colName, colDescription) values ($1, $2);';

        return new Promise( (res, rej) => {

            pool.query(sql, [name, desc], (err, result) => {
                if(err)
                    rej(err);
                else if(!result.rowCount)
                    rej({status:'Error', code:500, message: 'Error to create category'});

                res({status:'OK', code:200, message: 'Categoria criada com sucesso'});
            })
        });
    },

    getCategories(){
        let sql = 'SELECT colidCategory as id, colname as name, coldescription as description FROM tblCategoryProducts ORDER BY colName;';

        return new Promise( (res, rej) => {
            pool.query(sql, [], (err, result) => {
                if(err)
                    rej(err);
                else if (result.rowCount === 0)
                    rej({status:'Error', message: 'Error to get categories'});
                
                if(result.rows != undefined)
                    res(result.rows);
                else
                    res([])
            })
        })
    },

    updateCategory(id, name, description){
        let sql = 'UPDATE tblCategoryProducts SET colName = $1, colDescription = $2 WHERE colIdCategory = $3;';

        return new Promise( (res, rej) => {
            pool.query(sql, [name, description, id], (err, result) => {
                if(err)
                    rej(err)

                else if (result.rowCount === 0 )
                    rej({status: 'ERROR', message:`Error to update the category ${name}`});
                res({status:'OK', code:200, message:'Categoria atualizada com sucesso'});
        })
      })
    }
}
