const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

/* Controladores */
const USER_CONTROLLER = require('./controller/userController.js');
const CATEGORY_PRODUCT = require('./controller/categoryProductsController.js');
const PRODUCTS_CONTROLLER = require('./controller/productController.js');
const BUSSINESS_CONTROLLER = require('./controller/bussinessController.js');
const SUPORT_SERVICE = require('./services/suporte.js');
const { tratarTokenRecebido } = require('./utils/token.js');
const { isAuthenticated } = require('./utils/validators.js');

//const permitedAddresses = ['https://fox-trader-plataform.netlify.app'];

/*const corsOptions = {
	origin: function(origin, callback){
		if(permitedAddresses.indexOf(origin) !== -1){
			callback(null, true);
		}else{
			callback(new Error('Not allowed by CORS'))
		}
	}
}*/

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'https://fox-trader-plataform.netlify.app');
	app.use(cors());
	next();
})

//app.options('*', cors(corsOptions))

/* Routes to user */
//OK
app.post('/user/register', (req, res) => {
	// OK ROUTE

	let obj = {
		email: req.body.email,
		name: req.body.name,
		indicator: req.body.indicator,
		password : req.body.password
	}

	USER_CONTROLLER.registerUser(obj).then(
		result => {
			res.send(result);
		}
	).catch(err =>{
		//console.log('ERR:', err)
		res.send(err);
	});
});

app.post('/login',  (req, response) => {
	/**
	 * Realizar login na plataforma
	 */
	let email = req.body.email;
	let pwd = req.body.password;
	USER_CONTROLLER.doLogin(email, pwd).then(result => {
		response.status(200).send(result);
	}).catch(err => {
		//console.log('Erro', err.message);
		response.status(403).send({error: err});
	})
})

app.put('/user/updateName',  (req, res) => {
	// ROUTE DEFINED
	/**
	 * Atualizar nome de um usuario especifico
	 */
	let token = tratarTokenRecebido(req.headers);
	let id = req.body.idUser;
	let name = req.body.name;

	USER_CONTROLLER.updateNameUser(id, name, token)
	.then( result => {
		res.status(200).json(result);
	}).catch(err => {
		res.json(err)
	})

});

app.put('/user/updatepassword',  (req, res)=>{
	/*
	* Rota para atualizar senha de usuario
	*/

	let token = tratarTokenRecebido(req.headers);
	let email = req.body.email;
	let pass = req.body.password;
	let newPass = req.body.newPassword;

	USER_CONTROLLER.setPassword(email, pass, newPass, token)
	.then(result => {
		res.status(200).send(result);
	}).catch(err => {
		res.json(err);
	})
})

app.get('/user/affiliate/:linkID',  (req, res) => {
	/**
	 * Pegar quantias de afiliados do usuario em todos os níveis;
	 */
	let tokenTratado = tratarTokenRecebido(req.headers);

	USER_CONTROLLER.getAllAffiliates(req.params.linkID, tokenTratado).then( result=>
		{
			res.status(200).json(result)
		})
		.catch(err => {
			res.json(err)
		});
});

app.get('/user/:id',  (req, res)=>{
	// OK;
	/**
	 * Pegar informações base do usuario: Nome, email e id;
	 */
	let id = req.params.id;

	USER_CONTROLLER.readUser(id).then(r=>{
		res.status(200).json(r);
	}).catch(err => {
		res.json(err);
	})

});

app.get('/user/link/:id',  (req, res)=>{
	/**
	 * Pegar link de afiliacao de um usuario especifico
	 */

	let tokenTratado = tratarTokenRecebido(req.headers);

	let id = req.params.id;
	USER_CONTROLLER.getPersonalLink(id, tokenTratado).then(result=>{
		res.status(200).send(result);
	}).catch(err => {
		console.log('ERRO:', err)
		res.json(err);
	})
})

/* Routes to wallet */

app.get('/user/wallet/:id',  (req, res)=>{
	/**
	 * Pegar saldo da carteira de um usuário especifico.
	 */
	let id = req.params.id;
	let tokenTratado = tratarTokenRecebido(req.headers);

	USER_CONTROLLER.getWallet(id, tokenTratado)
	.then( r => {
		res.status(200).json(r);
	}).catch( err => {
		res.json(err);
	})

});

/* ROUTES TO SHOPPING */
app.get('/shopping/all',  (req, res) => {
	BUSSINESS_CONTROLLER.getAllShopping()
	.then(suc => {
		res.status(200).send(suc);
	}).catch(err => {
		res.json(err);
	})
})

app.get('/shopping/categories',  (req, res)=>{
	/**
	 * Pegar categorias existentes
	 */
	CATEGORY_PRODUCT.readCategories()
	.then(result => {
		res.status(200).send(result);
	}).catch(err => {
		res.json(err);
	})
})

app.post('/shopping/category',  (req, res) => {
	/**
	 * Criar nova categoria
	 */
	let tokenTratado = tratarTokenRecebido(req.headers);
	let name = req.body.name;
	let description = req.body.description;

	CATEGORY_PRODUCT.createCategory(name, description, tokenTratado)
	.then(result=>{
		res.status(200).send(result);
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
});

app.put('/shopping/category',  (req, res)=>{
	let token = tratarTokenRecebido(req.headers);
	let id = req.body.id;
	let name = req.body.name;
	let description = req.body.description;

	CATEGORY_PRODUCT.updateCategory(id, name, description, token)
	.then(result => {
		res.status(200).send(result);
	}).catch(err => {
		res.json(err);
	})
})

app.delete('/shopping/category',  (req, res) => {
	let id = req.body.id;

	let token = tratarTokenRecebido(req.headers);
	CATEGORY_PRODUCT.deleteCategory(id, token)
	.then(result => {
		res.status(200).send(result);
	}).catch(err => {
		if(err.code == '23503')
			res.json({status: 'ERROR', message:'A categoria especificada tem produtos linkados, remova todos os produtos antes de excluir a categoria.'})
		res.json(err);
	})
})

/* ROUTES TO PRODUCT */

app.get('/shopping/category/products/:id',  (req, res)=>{
	/**
	 *  Pegar todos os produtos de uma categoria específica.
	 */
	let id = req.params.id;
	PRODUCTS_CONTROLLER.getProducts(id)
	.then(result => {
		res.status(200).send(result)
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
})

app.post('/shopping/product/new',  (req, res) => {
	/*
	* Rota para criar um novo produto
	*/
	let tokenTratado = tratarTokenRecebido(req.headers);
	let name = req.body.name;
	let description = req.body.description;
	let price = req.body.price;
	let category = req.body.category;

	let productObj = {
		name,
		description,
		price,
		category
	}

	PRODUCTS_CONTROLLER.createProduct(productObj, tokenTratado)
	.then( resul=> {
		console.log(resul)
		res.status(200).send(resul);
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
})

app.put('/shopping/product',  (req, res) => {
	/*
	* ROTA PARA ATUALIZAÇÃO DE DADOS DE UM PRODUTO
	*/
	let name = req.body.name;
	let price = req.body.price;
	let description = req.body.description;
	let category = req.body.category;
	let id = req.body.id;
	let obj = {name, price, description, category, id};

	let token = tratarTokenRecebido(req.headers);

	PRODUCTS_CONTROLLER.updateProduct(obj, token)
	.then(suc => {
		res.status(200).send(suc);
	}).catch(err => {
		res.json(err);
	})
})

app.delete('/shopping/product',  (req, res)=>{
	let id = req.body.id;
	let token = tratarTokenRecebido(req.headers);

	PRODUCTS_CONTROLLER.deleteProduct(id, token)
	.then(result => {
		res.status(200).send(result);
	}).catch(err => {
		res.json(err);
	})
})

/*
* ROUTES TO SUPORT
*/

app.post('/suport/email', (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	let message = req.body.message;


	let resultado = SUPORT_SERVICE.contactSuporteByEmail(name, email, message)
	/*.then(result=>{
		res.status(200).json(result);
	}).catch(err => {
		res.json(err);
	})*/
	res.send(resultado);

})

/*
 * Route to test token;
*/

app.post('/checkToken',  (req, res) => {
	let token = tratarTokenRecebido(req.headers);

	if( isAuthenticated(token) ){
		res.status(200).json({ status:'OK' });
	}else{
		res.send({ status: 'ERROR' });		
	}
})

/*
 * Routes to business
*/

app.get('/business/telemetry',  (req, res)=> {
	let token = tratarTokenRecebido(req.headers);
	
	BUSSINESS_CONTROLLER.getTelemetry(token)
	.then(result => {
		res.status(200).json(result);
	}).catch(err => {
		res.json(err);
	})

})

app.get('/', (req, res)=>{
	res.send('<h1>Servidor no ar</h1>')
})

var port = process.env.PORT || 5000;
app.set('port', port);
app.listen(port);
