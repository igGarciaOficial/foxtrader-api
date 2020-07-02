const tokenValidator = require('./token.js');

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

function checkLevelPermissionUser(idUser){
	return true;
}

module.exports = {
	isValidEmail,
	isAuthenticated,
	checkLevelPermissionUser
}