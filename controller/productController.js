const productDAO = require('../dao/productDAO.js');
const BUSSINESS_DAO = require('../dao/bussinessDAO.js');
const USER_CONTROLLER = require('../controller/userController');
const GeneralController = require('./generalController.js');
const validators = require('../utils/validators.js');


class ProductController extends GeneralController {

    static async buyProduct(idProduct, price, idUser=null, indication=null){

        /**
         *  Confirmar pagamento no mercado pago antes para poder realizar alterações no banco de dados;
         */

        let resultado = await productDAO.buyProduct(idProduct, price, idUser, indication);

        if(resultado.code === 200){
            /**
             * Distribuir comissoes
             */
            let comissoes = await BUSSINESS_DAO.getComissions();
            let cont = 0;
            let user_indicator = null;
            let valorComissao = 0;

            if(indication !== null){
                /** Calcular comissao e distribuir; */
                valorComissao = price * (comissoes[cont]/100);
                user_indicator = await USER_CONTROLLER.getIdUserByLinkIndication(indication);
                user_indicator = user_indicator[0].id;
                USER_CONTROLLER.addCommission(user_indicator, valorComissao);       
                cont += 1;

                let condicao = (cont < comissoes.length) && user_indicator !== null;
                while (condicao){

                    valorComissao = price * (comissoes[cont]/100);
                    let parent = USER_CONTROLLER.getAffiliatorUser(user_indicator);
                    parent = parent[0].colIndicator;

                    if(parent === null || parent === undefined){
                        return new Promise( (res, rej)=>{
                            res({status: 'OK', code: 200, message: 'Compra efetuada com sucesso.'})
                        })
                    }

                    /** Pegando ID para adicionar comisao */
                    user_indicator = await USER_CONTROLLER.getIdUserByLinkIndication(parent);
                    user_indicator = user_indicator[0].id;

                    USER_CONTROLLER.addCommission(user_indicator, valorComissao);  

                    cont+=1
                    condicao = (cont < comissoes.length) && user_indicator !== null;
                } // END WHILE

            }else if(idUser !== null){

                let parent = USER_CONTROLLER.getAffiliatorUser(idUser);
                parent = parent[0].colIndicator;

                let condicaoLoop = (cont < comissoes.length) && (parent!==null && parent!==undefined);

                while (condicaoLoop){
                    valorComissao = price * (comissoes[cont]/100);

                    /** Pegando ID para adicionar comisao */
                    user_indicator = await USER_CONTROLLER.getIdUserByLinkIndication(parent);
                    user_indicator = user_indicator[0].id;

                    USER_CONTROLLER.addCommission(user_indicator, valorComissao);  

                    parent = USER_CONTROLLER.getAffiliatorUser(user_indicator);
                    parent = parent[0].colIndicator;

                    cont+=1
                    let condicaoLoop = (cont < comissoes.length) && (parent!==null && parent!==undefined);
                }

            }

            return new Promise( (res, rej)=>{
                res({status: 'OK', code: 200, message: 'Compra efetuada com sucesso.'})
            })


        }else{
            return new Promise( (res, rej) => {
                rej(resultado)
            })
        }
    }

    static async createProduct(dataProduct, token){

        if (!validators.isAuthenticated(token)){
            return super.defaultAnswerToSetMethod(undefined, 'User not authenticated');
        }

        else if (! await validators.checkLevelPermissionUser(token.email, 'product')){
            return super.defaultAnswerToSetMethod(undefined, 'User unauthorized');
        }

        let name = dataProduct.name;
        let description = dataProduct.description;
        let price = dataProduct.price;
        let category = dataProduct.category;

        //const result =  await productDAO.createProduct(name, description, price, category); 
        return productDAO.createProduct(name, description, price, category);
        //return  super.defaultAnswerToSetMethod(result)
    }

    static getProducts(category){
        /* Comentado por conta da landpage */
        // if(!validators.isAuthenticated(token)){
        //     return super.defaultAnswerToSetMethod(undefined, 'User not authenticated');
        // }

        //const result = await productDAO.readProducts(category);
        return productDAO.readProducts(category)
    }

    static deleteProduct(idProduct, token){
        if(!validators.isAuthenticated(token)){
            return this.defaultAnswerToSetMethod(undefined, 'User not authenticated')
        }else if(!validators.checkLevelPermissionUser(token.email, 'product')){
            return this.defaultAnswerToSetMethod(undefined, 'Operation denied')
        }
        return productDAO.deleteProduct(idProduct);
    }

    static async updateProduct(productData, token){
        if(!validators.isAuthenticated(token)){
            return this.defaultAnswerToSetMethod(undefined, 'User not authenticated')
        }
        else if(! await validators.checkLevelPermissionUser(token.email, 'product')){
            return this.defaultAnswerToSetMethod(undefined, 'Operation denied')
        }

        return productDAO.updateProduct(productData);
    }

}

module.exports = ProductController;