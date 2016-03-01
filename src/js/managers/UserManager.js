//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Proxy
} from 'bugcore';
import { EntityManager } from './';
import { UserEntity } from '../entities';
import { Firebase } from '../util';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EntityManager}
 */
const UserManager = Class.extend(EntityManager, {

    _name: 'bitpack.UserManager',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor() {
        this._super(UserEntity);
    },


    //-------------------------------------------------------------------------------
    // EntityManager Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {ContextChain} contextChain
     * @param {{
     *      userId: string
     * }} pathData
     * @return {string}
     */
    generatePath(contextChain, pathData) {
        return Firebase.path(contextChain, ['users', pathData.userId]);
    }
});


//-------------------------------------------------------------------------------
// Private Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {UserManager}
 */
UserManager.instance        = null;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {UserManager}
 */
UserManager.getInstance = function() {
    if (UserManager.instance === null) {
        UserManager.instance = new UserManager();
    }
    return UserManager.instance;
};


//-------------------------------------------------------------------------------
// Static Proxy
//-------------------------------------------------------------------------------

Proxy.proxy(UserManager, Proxy.method(UserManager.getInstance), [
    'disableCache',
    'enableCache',
    'get',
    'remove',
    'set',
    'update'
]);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default UserManager;
