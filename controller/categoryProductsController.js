const GeneralController = require('./generalController.js');
const categoryProductDAO = require('../dao/categoryServicesDAO.js');

const validators = require('../utils/validators.js');

class CategoryProductController extends GeneralController{


    static async createCategory(name, description, token){
        if (!validators.isAuthenticated(token)){
            return super.defaultAnswerToSetMethod(undefined, 'User not authenticated');
        }

        else if(! await validators.checkLevelPermissionUser(token.email, 'category')){
            return super.defaultAnswerToSetMethod(undefined, 'User unautorized.');
        }
        return categoryProductDAO.createCategory(name, description);
    }

    static async deleteCategory(id, token){
        
        if(! validators.isAuthenticated(token)){
            return this.defaultAnswerToSetMethod(undefined, 'User not authenticated. Please do the login again.')
        }else if(! await validators.checkLevelPermissionUser(token.email, 'category')){
            return this.defaultAnswerToSetMethod(undefined, 'User not authorized.')
        }

        return categoryProductDAO.deleteCategory(id);
    }

    static readCategories(){
        return categoryProductDAO.getCategories();
    }

    static async updateCategory(id, name, description, token){
        if (!validators.isAuthenticated(token)){
            return super.defaultAnswerToSetMethod(undefined, 'User not authenticated');
        }
        
        else if(! await validators.checkLevelPermissionUser(token.email, 'category')){
            return super.defaultAnswerToSetMethod(undefined, 'User unautorized');
        }
        return categoryProductDAO.updateCategory(id, name, description);
    }

}

module.exports = CategoryProductController;
