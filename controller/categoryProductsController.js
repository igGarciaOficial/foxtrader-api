const GeneralController = require('./generalController.js');
const categoryProductDAO = require('../dao/categoryServicesDAO.js');

const validators = require('../utils/validators.js');

class CategoryProductController extends GeneralController{


    static createCategory(name, description, token){
        if (!validators.isAuthenticated(token)){
            return super.defaultAnswerToSetMethod(undefined, 'User not authenticated');
        }

        else if(!validators.checkLevelPermissionUser(token.email)){
            return super.defaultAnswerToSetMethod(undefined, 'User unautorized');
        }
        return categoryProductDAO.createCategory(name, description);
    }

    static readCategories(){
        return categoryProductDAO.getCategories();
    }

    static updateCategory(id, name, description, token){
        if (!validators.isAuthenticated(token)){
            return super.defaultAnswerToSetMethod(undefined, 'User not authenticated');
        }
        else if(!validators.checkLevelPermissionUser(token.email)){
            return super.defaultAnswerToSetMethod(undefined, 'User unautorized');
        }
        return categoryProductDAO.updateCategory(id, name, description);
    }

}

module.exports = CategoryProductController;
