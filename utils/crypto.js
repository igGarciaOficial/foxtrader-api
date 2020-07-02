const crypto = require('crypto');
const algorithm = 'sha256' ;//'aes-256-cbc-hmac-sha1';
//const iv_password = 32;
const iv_token = 24;
const algorithmToken = 'aes-192-cbc';
const typeNumber = 'hex';
const charSet = 'utf8';
const secretToken = "4294967296";
const key = crypto.scryptSync(secretToken, 'salt', iv_token);
//const secret = "2.147.483.647";


const cryptoPassword = (pwd) => {
	const hash = crypto.createHash(algorithm);
	hash.update(pwd);
	return hash.digest(typeNumber);

}

function cryptoToMakenToken(text){
	const iv = Buffer.alloc(16, 0);
	const cipher = crypto.createCipheriv(algorithmToken, key, iv);
    let encrypted = cipher.update(text, charSet, typeNumber);
    encrypted += cipher.final(typeNumber);
    return encrypted;
}

const descryptoToResolveToken = (text) => {
	const iv = Buffer.alloc(16, 0);
	const decipher = crypto.createDecipheriv(algorithmToken, key, iv);
	let descrypt = decipher.update(text, typeNumber, charSet);
	descrypt += decipher.final(charSet);
	return descrypt;
}

module.exports = {cryptoPassword, cryptoToMakenToken, descryptoToResolveToken};
