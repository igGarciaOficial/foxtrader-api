const crypto = require('./crypto.js');

module.exports = {
    makeToken(email){
        let timeNow = new Date();
        timeNow.setMinutes(timeNow.getMinutes(), 900);
        let expirationTime = timeNow.getTime();
        let token = email + '|' + expirationTime;
        token = crypto.cryptoToMakenToken(token);
        return token;
    },

    aproveToken(tokenObj){
        // Verificar se email corresponde com o email criptografado...
        let obj = crypto.descryptoToResolveToken(tokenObj.token);
        [email, time] = obj.split('|');

        if (tokenObj.email != email){
            return false;
        }

        let now = new Date();

        if( time < now.getTime() ){
            return false;
        }
        return true;
    },

    renoveToken(){
        console.log('Renovando tokens')
    },

    tratarTokenRecebido(headers){
        let xToken = headers['x-token'];
        //let ivToken = headers['iv-token'];
        let email = headers['e-token'];

        return {
            email: email,
            token:  xToken
        } // Fim objeto
    }
}
