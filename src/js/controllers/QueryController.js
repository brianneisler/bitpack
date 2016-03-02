//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Map,
    Obj
} from 'bugcore';
import {
    PackQueryStore
} from '../stores';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const QueryController = Class.extend(Obj, {

    _name: 'bitpack.QueryController',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor() {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AuthController}
         */
        this.authController                 = null;

        /**
         * @private
         * @type {Map.<CurrentUser, PackQueryStore>}
         */
        this.currentUserToPackQueryStoreMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {AuthController}
     */
    getAuthController() {
        return this.authController;
    },

    /**
     * @param {AuthController} authController
     * @return {QueryController}
     */
    setAuthController(authController) {
        this.authController = authController;
        return this;
    },

    /**
     * @return {Map.<CurrentUser, PackQueryStore>}
     */
    getCurrentUserToPackQueryStoreMap() {
        return this.currentUserToPackQueryStoreMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packQuery
     * @return {QueryResultData}
     */
    async query(contextChain, packType, packClass, packScope, packQuery) {
        const currentUser = await this.authController.getCurrentUser(contextChain);
        const packQueryStore = this.generatePackQueryStore(currentUser);
        return await packQueryStore.query(contextChain, packType, packClass, packScope, packQuery);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CurrentUser} currentUser
     * @return {PackQueryStore}
     */
    generatePackQueryStore(currentUser) {
        let packQueryStore    = this.currentUserToPackQueryStoreMap.get(currentUser);
        if (!packQueryStore) {
            packQueryStore        = new PackQueryStore();
            this.currentUserToPackQueryStoreMap.put(currentUser, packQueryStore);
        }
        return packQueryStore;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default QueryController;
