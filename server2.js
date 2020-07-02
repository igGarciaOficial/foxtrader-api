const express = require('express');
const app = express();

/* Controladores */
const USER_CONTROLLER = require('./controller/userController.js');
const CATEGORY_PRODUCT_CONTROLLER = require('./controller/categoryProductsController.js');
const PRODUCT_CONTROLLER = require('./controller/productController.js');
const BUSSINESS_DAO = require('./dao/bussinessDAO.js');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

/* Criando rotas */
/* Routes to user */

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
			res.status(200).json(result);
		}
	).catch(err =>{
		res.json(err);
	});
});


app.put('/user/updateName', (req, res) => {
	// ROUTE DEFINED

	let id = req.body.idUser;
	let name = req.body.name;
	

	USER_CONTROLLER.updateNameUser(id, name)
	.then( result => {
		res.status(200).json(result);
	}).catch(err => {
		res.json(err)
	})

});

app.get('/user/affiliate/:linkID', (req, res) => {
	
	USER_CONTROLLER.getAllAffiliates(req.params.linkID).then( result=>
		{
			res.status(200).json(result)
		})
		.catch(err => {
			res.json(err)
		});
});

app.get('/user/:id', (req, res)=>{
	// OK;

	let id = req.params.id;

	USER_CONTROLLER.readUser(id).then(r=>{
		res.status(200).json(r);
	}).catch(err => {
		res.json(err);
	})

});


/* Routes to wallet */

app.get('/user/wallet/:id', (req, res)=>{
	let id = req.params.id;

	USER_CONTROLLER.getWallet(id)
	.then( r => {
		res.status(200).json(r);
	}).catch( err => {
		res.json(err);
	})

});

app.put('/user/wallet', (req, res)=>{
	let id = req.body.id;
	let value = req.body.value;

	USER_CONTROLLER.setWallet(id, value).then( r =>{
		res.status(200).json(r);
	}).catch(err => {
		res.json(err);
	})
})


/* Routes to categories */

app.post('/categoryProduct', (req, res)=>{
	// OK

	let name = req.body.name;
	let description = req.body.description;
	let user = req.body.idUser;

	CATEGORY_PRODUCT_CONTROLLER.createCategory(user, name, description)
	.then( r => {
		res.status(200).json(r);
	}).catch(err => {
		res.json(err);
	})
})


app.get('/categoryProduct', (req, res)=>{
	CATEGORY_PRODUCT_CONTROLLER.readCategories()
	.then( result =>{
		res.status(200).json(result);
	}).catch(err => {
		res.json(err);
	})
})

/** Routes to product */

app.post('/product', (req, res) =>{
	PRODUCT_CONTROLLER.createProduct(req.body)
	.then( result => {
		res.status(200).json(result);
	}).catch( err => {
		res.json( err );
	})
})

app.get('/product/:category', (req, res) => {

	PRODUCT_CONTROLLER.getProducts(req.params.category)
	.then( result => {
		res.status(200).json(result);
	}).catch( err => {
		res.json(err);
	})

});

app.get('/', (req, res)=>{
	res.status(200).send('<h1>Servidor no ar!</h1>')
})


app.get('/comissoes', async (req, res)=>{
	let resposta = await BUSSINESS_DAO.getComissions();
	res.status(200).send(resposta)
})

var port = process.env.PORT || 5000;
app.set('port', port);
app.listen(port);
//console.log(port);

//sudo kill -9 $(sudo lsof -t -i:9001)