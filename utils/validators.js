const tokenValidator = require('./token.js');
const { permissionsRoutesToLevel } = require('./globalVariables.js');
const { getTypeUser } = require('../dao/userDAO.js');

const levelPermission = {
	userApplication : ['readUser']
}

function isValidEmail(email){
	let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	let patt = new RegExp(mailformat);
	let res = patt.exec(email);

	if (res)
		return true;
	return false;
}

function isAuthenticated(token){
	return tokenValidator.aproveToken(token);
}

async function checkLevelPermissionUser(email, route){
	let levelUser = await getTypeUser(email);
	levelUser = levelUser[0].type;

	if (permissionsRoutesToLevel[route] == undefined || permissionsRoutesToLevel[route] == null )
		return true
	else if( permissionsRoutesToLevel[route].includes(levelUser))
		return true;
	return false
}

module.exports = {
	isValidEmail,
	isAuthenticated,
	checkLevelPermissionUser
}