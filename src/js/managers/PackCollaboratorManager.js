//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Proxy
} from 'bugcore';
import { EntityManager } from './';
import { PackCollaboratorEntity } from '../entities';
import {
    Firebase
} from '../util';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EntityManager}
 */
const PackCollaboratorManager = Class.extend(EntityManager, {

    _name: 'bitpack.PackCollaboratorManager',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor() {
        this._super(PackCollaboratorEntity);
    },


    //-------------------------------------------------------------------------------
    // EntityManager Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {ContextChain} contextChain
     * @param {{
     *      packClass: string,
     *      packName: string,
     *      packScope: string,
     *      packType: string,
     *      userId: string
     * }} pathData
     * @return {string}
     */
    generatePath(contextChain, pathData) {
        return Firebase.path(contextChain, ['packs', pathData.packType, pathData.packClass, pathData.packScope, pathData.packName, 'collaborators', pathData.userId]);
    }
});


//-------------------------------------------------------------------------------
// Private Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {PackCollaboratorManager}
 */
PackCollaboratorManager.instance        = null;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {PackCollaboratorManager}
 */
PackCollaboratorManager.getInstance = function() {
    if (PackCollaboratorManager.instance === null) {
        PackCollaboratorManager.instance = new PackCollaboratorManager();
    }
    return PackCollaboratorManager.instance;
};


//-------------------------------------------------------------------------------
// Static Proxy
//-------------------------------------------------------------------------------

Proxy.proxy(PackCollaboratorManager, Proxy.method(PackCollaboratorManager.getInstance), [
    'create',
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

export default PackCollaboratorManager;
