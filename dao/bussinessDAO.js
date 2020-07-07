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
    },

    getLevelPermission(email){
        let sql = 'SELECT colType as level FROM tblUser WHERE colEmail = $1;';
        return new Promise( (res, rej) => {
            pool.query(sql, [email], (err, result) =>{
                if(err)
                    rej(err);
                res(result.rows);
            })
        })
    },

    async getTelemetry(){

        let hoje = new Date();
        let anoH = hoje.getFullYear();
        let mesH = hoje.getMonth();
        mesH += 1;
        mesH = (mesH.toString().length == 1)? '0' + mesH: mesH;

        let dayH = hoje.getDate();
        dayH = (dayH.toString().length == 1)? '0'+dayH : dayH;


        let dataInicial = `${anoH}-${mesH}-01 00:00:00`;
        let dataFinal = `${anoH}-${mesH}-${dayH} 23:59:59`;

        let sqlAllMovimentationSite = 'SELECT SUM(colPrice) FROM tblSales;';
        let sqlAllMovimentationMonth = 'SELECT SUM(colPrice) FROM tblSales WHERE colOcurrency >= $1::TIMESTAMPTZ AND colOcurrency <= $2::TIMESTAMPTZ;';
        let sqlWalletUsers =  'SELECT SUM(colWallet), COUNT(colEmail) FROM tblUser;';


        let resultAllSite = await pool.query(sqlAllMovimentationSite, []);
        let resultMonth = await pool.query(sqlAllMovimentationMonth, [dataInicial, dataFinal]);
        let resultWalletUsers = await pool.query(sqlWalletUsers, []);


        let obj = {
            monthMoney: resultMonth.rows[0].sum,
            allSiteMoney: resultAllSite.rows[0].sum,
            walletUsers: resultWalletUsers.rows[0].sum,
            usersRegistreds: resultWalletUsers.rows[0].count,
        }
        
        return obj;
    },

}