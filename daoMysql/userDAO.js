const pool = require('../utils/databaseMysql.js').promissePool;
const conn = require('../utils/databaseMysql.js').connection;
const connection = require('../utils/databaseMysql.js');
const cryptoPwd = require('../utils/crypto.js');

//  Functinos to create
// *************************
//  Create user;
//  Update user;
//  Delete user;
//  Read user;

//  Withdraw;
//  Affiliate;


module.exports = {

	createUser(dataUser, linkCreated){
		/* Analizar possibilidade de gerar senha para user... */
		/* Integrar disparador de email */
		let [name, email, senha, indicator] = dataUser;
		senha = cryptoPwd(senha);

		let slqTblUser = 'insert into tblUser ( name, email, linkId, indicator) values (?, ?, ?, ?);';
		let sqlTblAuth = 'insert into tblAuth (email, password) values (?, ?);';

		return new Promise((resolve, reject) => {

			//pool.getConnection( (err, conn) => {
			//	if (err)
			//		reject(err);

			conn.beginTransaction((err) => {
				if (err)
					reject(err);
				conn.query(sqlTblAuth, [email, senha], (err, rows) =>{
					if (err){
						conn.rollback();
						reject(err);
					}

					conn.query(slqTblUser, [name, email, linkCreated, indicator], (err, rows)=>{
						if (err){
							conn.rollback();
							console.log('Error ', err)
							reject(err);
						}

						conn.commit((err) =>{
							if (err){
								conn.rollback();
								reject(err);
							}
							resolve({status:'ok', message:'User create with sucess'})
						})
					});
				});


			})
			//})
		});

	},

	async updateUserName(userID, newName){

		let sql = 'UPDATE tblUser set name = ? where userID = ?;';
		//console.log('Dentro do PUT')


		return await pool.query(sql, [newName, userID]);

	},

	updateBallanceUser(userID, newBalance){},

	updateTypeUser(userID, newType){},

	async getInfoUser(userIDorEmail){

		let sql = 'SELECT name, email, linkID FROM tblUser WHERE userID = ? or email = ?;';

		const [rows, fields] = await pool.query(sql, [userIDorEmail, userIDorEmail]);
		//console.log(rows);
		return rows;
	},


	async getWallet(idUser){
		let sql = 'SELECT wallet from tblUser where userID = ?;';

		const [value, fields] = await pool.query(sql, [idUser]);
		return value;
	},

	async updateWallet(idUser, value){
		let sql = 'UPDATE tblUser SET wallet = ? where userID = ?;';

		const result = await pool.query(sql, [value, idUser]);
		return result;
	},

	deleteUser(userID){},


	/* Get Affiliate users */

	async getAffiliatesUser(linkIDArray){
		let sql = "SELECT linkID FROM tblUser where indicator = ?";
		let tamanhoArray = linkIDArray.length;

		let index = 1;
		for (index; index < tamanhoArray; index++){
			sql += " or indicator = ?"
		}
		sql += ';';
		//console.log('SQL: ' + sql)
		//console.log('LINKS: ', )
		const result = await pool.query(sql, linkIDArray);
		return result[0];
	}

}
