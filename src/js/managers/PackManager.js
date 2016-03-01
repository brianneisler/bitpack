//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Proxy
} from 'bugcore';
import { EntityManager } from './';
import { PackEntity } from '../entities';
import { Firebase } from '../util';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EntityManager}
 */
const PackManager = Class.extend(EntityManager, {

    _name: 'bitpack.PackManager',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor() {
        this._super(PackEntity);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ContextChain} contextChain
     * @param {{
     *      class: string,
     *      name: string,
     *      scope: string,
     *      type: string
     * }} rawData
     * @param {UserData} userData
     * @return {Promise<PackEntity>}
     */
    create(contextChain, rawData, userData) {
        const userId = userData.getId();
        const data = {
            collaborators: {
                [userId]: {
                    createdAt: Firebase.timestamp(),
                    owner: true,
                    updatedAt: Firebase.timestamp(),
                    userId: userId
                }
            },
            info: {
                class: rawData.class,
                createdAt: Firebase.timestamp(),
                name: rawData.name,
                scope: rawData.scope,
                type: rawData.type,
                updatedAt: Firebase.timestamp()
            }
        };
        return Firebase
            .proof(contextChain, ['packs', rawData.type, rawData.class, rawData.scope, rawData.name])
            .set(data)
            .then(() => {
                const path      = this.generatePath(contextChain, {
                    packClass: rawData.class,
                    packName: rawData.name,
                    packScope: rawData.scope,
                    packType: rawData.type
                });
                const entity    = this.generateEntity(contextChain, path, data.info);
                return this.addCache(entity);
            });
    },


    //-------------------------------------------------------------------------------
    // EntityManager Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {ContextChain} contextChain
     * @param {{
     *      packName: string,
     *      packScope: string,
     *      packType: string
     * }} pathData
     * @return {string}
     */
    generatePath(contextChain, pathData) {
        return Firebase.path(contextChain, ['packs', pathData.packType, pathData.packScope, pathData.packName, 'info']);
    }
});


//-------------------------------------------------------------------------------
// Private Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {PackManager}
 */
PackManager.instance        = null;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {PackManager}
 */
PackManager.getInstance = function() {
    if (PackManager.instance === null) {
        PackManager.instance = new PackManager();
    }
    return PackManager.instance;
};


//-------------------------------------------------------------------------------
// Static Proxy
//-------------------------------------------------------------------------------

Proxy.proxy(PackManager, Proxy.method(PackManager.getInstance), [
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

export default PackManager;
