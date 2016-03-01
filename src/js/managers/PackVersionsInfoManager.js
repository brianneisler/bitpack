//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Map,
    Proxy
} from 'bugcore';
import { EntityManager } from './';
import { PackVersionsInfoEntity } from '../entities';
import { Firebase } from '../util';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EntityManager}
 */
const PackVersionsInfoManager = Class.extend(EntityManager, {

    _name: 'bitpack.PackVersionsInfoManager',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor() {

        this._super(PackVersionsInfoEntity);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, PackVersionsInfoWatcher>}
         */
        this.packNameToWatcher  = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Map.<string, PackVersionsInfoWatcher>}
     */
    getPackNameToWatcherMap() {
        return this.packNameToWatcher;
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
     *      packType: string
     * }} pathData
     * @return {string}
     */
    generatePath(contextChain, pathData) {
        return Firebase.path(contextChain, ['packs', pathData.packType, pathData.packClass, pathData.packScope, pathData.packName, 'versionsInfo']);
    }
});



//-------------------------------------------------------------------------------
// Private Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {PackVersionsInfoManager}
 */
PackVersionsInfoManager.instance        = null;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {PackVersionsInfoManager}
 */
PackVersionsInfoManager.getInstance = function() {
    if (PackVersionsInfoManager.instance === null) {
        PackVersionsInfoManager.instance = new PackVersionsInfoManager();
    }
    return PackVersionsInfoManager.instance;
};


//-------------------------------------------------------------------------------
// Static Proxy
//-------------------------------------------------------------------------------

Proxy.proxy(PackVersionsInfoManager, Proxy.method(PackVersionsInfoManager.getInstance), [
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

export default PackVersionsInfoManager;
