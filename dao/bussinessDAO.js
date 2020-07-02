const pool = require('../utils/databasePostgresql').pool;

module.exports = {

    getComissions(){
        let sql = 'SELECT colLevel as level, colPercentual as percentual FROM tblCommission;';

        return new Promise( (res, rej) => {
            pool.query(sql, [], (err, resultado)=>{
                if(err)
                    rej(err)
                else if(resultado.rowCount==0)
                    rej({status:'ERROR', code:500, message: 'Error to get the comissions.'})
                res(resultado.rows)
            })
        })
    },

    getCountCommissions(){
        let sql = 'SELECT COUNT(*) FROM tblCommission;';
        return new Promise((res, rej) => {
            
            pool.query(sql, [], (err, resultado) => {
                if(err)
                    rej(err);
                
                res(resultado.rows);
            })
        })
    }

}