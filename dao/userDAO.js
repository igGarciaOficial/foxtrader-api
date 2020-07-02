const pool = require('../utils/databasePostgresql').pool;
const crypto = require('../utils/crypto.js');
const { doLogin } = require('../controller/userController');

module.exports = {

    // OK
    async createUser(dataUser, linkCreated){
        let [name, email, senha, indicator] = dataUser;
        senha = crypto.cryptoPassword(senha);

        let slqTblUser = 'insert into tblUser (colName, colEmail, colLinkId, colIndicator) values ($1, $2, $3, $4);';
        let sqlTblAuth = 'insert into tblAuth (colEmail, colPassword) values ($1, $2);';

        const client = await pool.connect();

        try {

            await client.query('BEGIN');
            await client.query(sqlTblAuth, [email, senha]);

            await client.query(slqTblUser, [name, email, linkCreated, indicator]);
            await client.query('COMMIT');

            return new Promise((res, rej) => {
                res({status:'OK', code:200, message:'User create with sucess'})
            });

        } catch (error) {
            await client.query('ROLLBACK');

            return new Promise( (res, rej) => {
                rej(error);
            })

        } finally{
            client.release();
        }

    },

    //OK
    getUser(userIdOrEmail){
        let sql = '';
        if (userIdOrEmail.includes('@')){
            sql = "SELECT coluserid as id, colname as name, coltype as level FROM tblUser WHERE colEmail = $1::varchar;";
        }else{
            sql = "SELECT coluserid as id, colname as name, coltype as level FROM tblUser WHERE colUserID = $1::bigint;"
        }

        return new Promise( (res, rej) => {

            pool.query(sql, [userIdOrEmail], (err, r)=>{
                if(err)
                    rej(err);

                else if (!r.rowCount)
                    rej({status:'Error', message: 'User not found'})

                res(r.rows);
            })

        });

    },

    getLinkUser(idUser){
        let sql = 'SELECT collinkid as link FROM tblUser WHERE coluserid = $1;';
        return new Promise ( (res, rej) => {
            pool.query(sql, [idUser], (err, r)=>{
                if(err)
                    rej(err)
                else if(r.rowCount == 0)
                    rej({status:'ERROR', code:500, message: 'Error to get the link of user'});

                res(r.rows);
            })
        })
    },


    //OK
    updateUserName(userID, newName){

        let sql = "UPDATE tblUser SET colName = $1 WHERE colUserID = $2;"

        return new Promise( (res, rej) => {
            pool.query( sql, [newName, userID], (err, result) => {
                if (err)
                    rej(err);

                if (result.rowCount === 0 ){
                    rej({status:'Error', message:'User not found'});
                }

                res({status:'OK', message: 'Name updated with success'})
            });
        });
    },

    //OK
    getBallanceUser(userID){
        let sql = "SELECT colWallet as wallet FROM tblUser WHERE colUserID = $1;";
        return new Promise( (res, rej)=>{

            pool.query(sql, [userID], (err, result) => {
                if (err)
                    rej(err);
                res(result.rows[0]);
            });
        })
    },

    getIndicatorUser(idUserOrcolLinkID){
        let sql = 'SELECT colIndicator FROM tblUser WHERE colUserID = $1::BIGSERIAL or colLinkID = $2::VARCHAR;';

        return new Promise( (rs, rj) => {
            pool.query(sql, [idUserOrcolLinkID, idUserOrcolLinkID], (err, res)=>{
                if(err)
                    rj(err)
                else if(res.rowCount === 0)
                    rj({message:'ERROR to realease operation', code:500, status:'ERROR'})

                rs(res.rows)
            })
        })
    },

    getIdUserByLinkIndication(linkIndication){
        let sql = 'SELECT colUserID as id FROM tblUser WHERE colLinkID = $1;';
        return new Promise( (res, rej)=>{
            pool.query(sql, [linkIndication], (err, r)=>{
                if(err){
                    rej({status:'ERROR', code:500, message:'Error to get id user'});
                }else if(r.rowCount === 0){
                    rej({status:'ERROR', code:500, message:'Error to get id user'});
                }
                res(r.rows)
            })
        })
    },

    async getAffiliatesUser(linkIDArray){
        let sql = "SELECT colLinkID as link FROM tblUser WHERE colIndicator = $1";

        let tamanhoArray = linkIDArray.length;
        let index = 1;

        for (index; index < tamanhoArray; index++){
            sql += " or colIndicator = $" + index;
        }

        sql += ";";


        const result = await  pool.query(sql, linkIDArray);

        return result.rows;
    },

    //OK
    updateBallanceUser(userID, newBalance){
        let sql = 'UPDATE tblUser SET colWallet = $1 WHERE colUserID = $2;';

        return new Promise((res, rej)=>{
            pool.query(sql, [newBalance, userID], (err, result)=>{
                if(err)
                    rej(err);

                if(result.rowCount == 0)
                    rej({status:'Error', message:'User not found'})

                res({status:'OK', message: 'Wallet updated with success'});
            })
        })
    },

    //OK
    updateTypeUser(userID, newType){
        let sql = 'UPDATE tblUser SET colType = $1 WHERE colUserID = $2;';

        return new Promise( (res, rej) => {
            pool.query(sql, [newType, userID], (err, result) => {
                if (err)
                    rej(new Error('Error to update type user'));

                if (result.rowCount === 0)
                    rej(new Error('User not found'))

                res({status:'OK', message:'Type user updated with success'});
            })
        })
    },

    async authenticateUser(email, password){
        let sql = "SELECT colPassword FROM tblAuth WHERE colEmail = $1;";

        const result = await pool.query(sql, [email]);

        if(result.rows[0].colpassword == crypto.cryptoPassword(password)){
            return true;
        }
        return false;
    },

    updatePassword(email, newPassword){
        let sql = 'UPDATE tblUser SET colPassword = $1 WHERE colEmail = $2;';
        return new Promise( (res, rej)=>{
            pool.query(sql, [newPassword, email], (err, r)=>{
                if(err)
                    rej(err);
                else if(r.rowCount===0)
                    rej({status:'ERROR', code:500, message:'Error to update the password'});
                res(r.rows)
            })
        })
    }
}
