const pool = require('../utils/databasePostgresql').pool;

module.exports = {

    createProduct(name, description, price, category){
        let sql = 'INSERT INTO tblProduct(colname, coldescription, colprice, colcategory) values ($1, $2, $3, $4);';

        return new Promise( (res, rej) => {
            pool.query(sql, [name, description, price, category], (err, result) => {

                if(err)
                    rej(err)
                else if(result.rowCount == 0)
                    res({status:200, message:'Error to create product'})

                res({status:200, message:'Produto criado com sucesso'});
            })
        })
    },

    readProducts(category){
        let sql = 'SELECT colIdProduct as id, colName as name, colDescription as description, colPrice as price, colCategory as category FROM tblProduct where colCategory = $1 ORDER BY colName;';

        return new Promise( (res, rej) => {
            pool.query(sql, [category], (err, result) => {
                if(err)
                    rej(err)
                else if(result.rowCount == 0)
                    res({status:200, message: 'Nenhum produto cadastrado', rows:[]})

                res(result.rows)
            })
        })
    },

    updateProduct(productData){
        let sql = 'UPDATE tblProduct SET colName=$1, colDescription=$2, colPrice=$3, colCategory=$4 WHERE colIdProduct=$5;'

        return new Promise((res, rej) =>{
            pool.query(sql, [productData.name, productData.description, productData.price,
            productData.category, productData.id], (err, result)=>{

                if(err)
                    rej(err);
                else if(result.rowCount == 0)
                    rej({ message:'Error to update the product', status:'ERROR'});
                    //rej({status:500, message:'Error to update the product'})
                res({code: 200, status: 'OK', message:'Produto atualizado com sucesso!'});
            })
        })
    },

    deleteProduct(idProduct){
        let sql = 'DELETE FROM tblProduct where colIdProduct = $1;';

        return new Promise( (res, rej) => {
            pool.query(sql, [idProduct], (err, r)=>{
                if(err)
                    rej(err)
                else if (r.rowCount === 0)
                    rej({status:500, message:'Error to delete the product'})

                res(r.rows);
            })
        })
    },

    async buyProduct(idProduct, price, idUser=null, indication=null){

        let sqlShopping = 'INSERT INTO tblSales(colPrice, colSeller, colProduct) VALUES($1, $2, $3) RETURNING colId;'
        let sqlRelationshipUserProduct = 'INSERT INTO tblProductsUser(colIdUser, colIdProduct, colTransaction) VALUES($1, $2, $3);';

        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            const result = await client.query(sqlShopping, [price, indication, idProduct]);

            if(idUser !== null){
                await client.query(sqlRelationshipUserProduct, [idUser, idProduct, result.rows[0].colId]);
            }
            await client.query('COMMIT')
            return new Promise( (res, rej)=>{
                res({status: 'OK', code:200, message:'Success'})
            })
        } catch (error) {
            await client.query('ROLLBACK');
            return new Promise( (res, rej)=>{
                rej({status:'ERROR', code:500, message:'Error to realease the shopping'});
            })
        }finally{
            client.release()
        }


    }

}
