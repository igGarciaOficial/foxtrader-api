//const UserDAO = require('../daoMysql/userDAO.js');
const USER_DAO = require('../dao/userDAO.js');
const BUSSINESS_DAO = require('../dao/bussinessDAO.js');

const crypto = require('../utils/crypto.js');
const tokenModule = require('../utils/token.js');
const validators = require('../utils/validators.js');

const GeneralController =require('./generalController.js');

class UserController extends GeneralController{

	static async addCommission(idUser, value){
		if (value < 0){
			return new Promise ( (resolve, reject)=>{
				reject( {status: 'Error', message: 'value is not valid' } );
			});
		}

		let balanceUser = await this.getWallet(idUser, {}, true);
		balanceUser = balanceUser.wallet + value;

		return USER_DAO.updateBallanceUser(idUser, balanceUser);
	}

	static async doLogin(email, password){
		let result = await USER_DAO.authenticateUser(email, password);
		if (result){
			let tokenGerado = tokenModule.makeToken(email);
			let nameQuery = await USER_DAO.getUser(email);
			return  new Promise( (res, rej) =>{
				res({
					status: 'OK',
					code: 200,
					token: { email: email, token: tokenGerado, name: nameQuery[0].name, id:nameQuery[0].id, l:nameQuery[0].level}
				})
			})

		}

		return new Promise( (res, rej) => {
			rej( new Error('Invalid data'))
		})
	}

	static getIdUserByLinkIndication(link){
		return USER_DAO.getIdUserByLinkIndication(link);
	}

	static getAffiliatorUser(idUserOrLinkId){
		return USER_DAO.getIndicatorUser(idUserOrLinkId);
	}

	static getPersonalLink(idUser, token){
		if(!validators.isAuthenticated(token)){
			return new Promise((res, rej)=>{
				rej({status:'ERROR', message:'User not authenticated'})
			})
		}
		return USER_DAO.getLinkUser(idUser);
	}

	static getWallet(idUser, token, system=false){
		
		if( !system && !validators.isAuthenticated(token)){
			return new Promise( (resolve, reject)=>{
				reject( [{status: 'Error', message: 'User not authenticated' }] );
			});
		}

		return USER_DAO.getBallanceUser(idUser);

	}

	static async getAllAffiliates(linkIdUser, token){

		if(!validators.isAuthenticated(token)){
			return super.defaultAnswerToSetMethod(undefined, 'User not authenticated');
		}

		let maxLevelAffiliates = await BUSSINESS_DAO.getCountCommissions();
		maxLevelAffiliates = maxLevelAffiliates[0].count;

		let degreeAfiliates = [];
		let index = 0;
		let resultQuery = null;

		linkIdUser = [linkIdUser];

		let condicao = (index < maxLevelAffiliates) && (linkIdUser.length !== 0);

		while (condicao){

			resultQuery = await USER_DAO.getAffiliatesUser(linkIdUser); /* Realizando busca; */

			linkIdUser = []; // Limpando lista que será usada;

			resultQuery.map( item => linkIdUser.push(item.link))	/* Recriando lista de links; */

			degreeAfiliates.push(resultQuery.length);	/* Adicionando contabilizacao de afiliados; */
			//console.log('AFF:', degreeAfiliates)
			/* Atualizando valores de loop */
			index+=1;
			condicao = (index < maxLevelAffiliates) && (linkIdUser.length !== 0);
		}

		while (degreeAfiliates.length < maxLevelAffiliates){
			degreeAfiliates.push(0)
		}
		return degreeAfiliates;

	}

	static async registerUser(objectUserData){

		const email = objectUserData.email

		if (!validators.isValidEmail(email))
			return {State: 'Error', message: "Email isn't valid"}

		let now = new Date();
		let dateNow = now.getFullYear().toString() + (now.getMonth()+1).toString() +now.getDay().toString() + now.getMinutes().toString() + now.getHours().toString();
		let creatorLink = email+' '+ dateNow;
		const linkCreateToUser = crypto.cryptoPassword(creatorLink);

		// name, email, senha, indicator
		const data = [
			objectUserData.name,
			email,
			objectUserData.password,
			objectUserData.indicator
		];

		return USER_DAO.createUser(data, linkCreateToUser);
	}

	static readUser(idUser, token=''){
		if (!validators.isAuthenticated(token))
			return new Promise( (resolve, reject) => {
				reject( [{status: 'Error', message: 'User not authenticated'}] );
			})

		return USER_DAO.getUser(idUser);
	}

	static async setPassword(email, password, newPassword, token){

		if(!validators.isAuthenticated(token)){
			return this.defaultAnswerToSetMethod(undefined, 'User not authenticated');
		}

		let result = await USER_DAO.authenticateUser(email, password);
		
		if (result)
			return USER_DAO.updatePassword(email, newPassword);
		return this.defaultAnswerToSetMethod(undefined, 'Password is wrong.')
	}

	static async setWallet(idUser, value, token){
		/*if (!validators.isAuthenticated(token)){
			return new Promise ( (resolve, reject)=>{
				reject( {status: 'Error', message: 'User not authenticated' } );
			});
		}
		else*/ 
		/* Comentado pois isto será uma função de sistema
		*/
		if (value < 0){
			return new Promise ( (resolve, reject)=>{
				reject( {status: 'Error', message: 'value is not valid' } );
			});
		}

		let balanceUser = await this.getWallet(idUser, token);
		balanceUser = balanceUser.wallet + value;

		return USER_DAO.updateBallanceUser(idUser, balanceUser);

	}

	static updateNameUser(id, name, token){
		if (!validators.isAuthenticated(token)){
			return new Promise((res, rej)=>{
				rej(  {status: 'Error', message: 'User not authenticated' } );
			})
		}

		return USER_DAO.updateUserName(id, name);
	}

	static withdrawMoney(idUser, money){
		/**
		 * 1 - checar quantia disponivel
		 * 2 - Realizar transação
		 * 3 - Atualizar carteira
		 */
	}
}

module.exports = UserController;
