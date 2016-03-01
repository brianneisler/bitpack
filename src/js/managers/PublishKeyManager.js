//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    ObjectUtil,
    Proxy
} from 'bugcore';
import { EntityManager } from './';
import { PublishKeyEntity } from '../entities';
import {
    Firebase,
    KeyUtil
} from '../util';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EntityManager}
 */
const PublishKeyManager = Class.extend(EntityManager, {

    _name: 'bitpack.PublishKeyManager',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor() {
        this._super(PublishKeyEntity);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ContextChain} contextChain
     * @param {{
     *  packClass: string,
     *  packHash: string,
     *  packName: string,
     *  packScope: string,
     *  packType: string,
     *  packVersionNumber: string
     * }} rawData
     * @return {Promise<PublishKeyEntity>}
     */
    create(contextChain, rawData) {
        ObjectUtil.assign(rawData, {
            key: KeyUtil.generate()
        });
        return this.set(contextChain, { key: rawData.key }, rawData);
    },


    //-------------------------------------------------------------------------------
    // EntityManager Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {ContextChain} contextChain
     * @param {{
     *      key: string
     * }} pathData
     * @return {string}
     */
    generatePath(contextChain, pathData) {
        return Firebase.path(contextChain, ['publishKeys', pathData.key]);
    }
});


//-------------------------------------------------------------------------------
// Private Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {PublishKeyManager}
 */
PublishKeyManager.instance        = null;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {PublishKeyManager}
 */
PublishKeyManager.getInstance = function() {
    if (PublishKeyManager.instance === null) {
        PublishKeyManager.instance = new PublishKeyManager();
    }
    return PublishKeyManager.instance;
};


//-------------------------------------------------------------------------------
// Static Proxy
//-------------------------------------------------------------------------------

Proxy.proxy(PublishKeyManager, Proxy.method(PublishKeyManager.getInstance), [
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

export default PublishKeyManager;
