

class GeneralController{

    static defaultAnswerToSetMethod(obj=[{affectedRows:0}], messageParamCaseError=''){
        obj = ( obj[0] == undefined )?obj:obj[0];

        return new Promise( (res, rej) => {
            obj.affectedRows != 0 ?res( {status: 'OK'} ):rej({status: 'ERROR', message:messageParamCaseError});
        })

    }

}

module.exports = GeneralController;
