const GeneralController = require('./generalController.js');
const CATEGORY_DAO = require('../dao/categoryServicesDAO.js');
const PRODUCT_DAO = require('../dao/productDAO.js');
const BUSSINESS_DAO = require('../dao/bussinessDAO.js');

const validators = require('../utils/validators.js');


class BussinessController extends GeneralController{

	static async getAllShopping(){

		let categories = await CATEGORY_DAO.getCategories();
		let produtos = [];

		let i = 0;
		for(i in categories){
			produtos = await PRODUCT_DAO.readProducts(categories[i].id);
			categories[i]['products'] = (produtos.message == undefined)?produtos:[];	
		}

		return new Promise((res, rej) => {
			res(categories);
		})

	}

	static async getTelemetry(token){

		if(!validators.isAuthenticated(token)){
			return Promise.reject({status:'ERROR', message: 'User not authenticated.'})
		}else if( await !validators.checkLevelPermissionUser( token.email, 'telemetry')){
			return this.defaultAnswerToSetMethod({}, 'User not authorized.');
		}

		return BUSSINESS_DAO.getTelemetry();
	}

}

module.exports = BussinessController;