//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    ObjectUtil,
    Proxy
} from 'bugcore';
import _ from 'lodash';
import { EntityManager } from './';
import { PackVersionEntity } from '../entities';
import { SemanticVersionField } from '../fields';
import { Firebase, FirebaseMulti } from '../util';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EntityManager}
 */
const PackVersionManager = Class.extend(EntityManager, {

    _name: 'bitpack.PackVersionManager',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor() {
        this._super(PackVersionEntity);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ContextChain} contextChain
     * @param {{
     *      packClass: string,
     *      packName: string,
     *      packScope: string,
     *      packType: string
     * }} pathData
     * @param {string} packVersion
     * @return {Promise<PackVersionEntity>}
     */
    create(contextChain, pathData, packVersion) {
        const semanticVersion = SemanticVersionField.parse(packVersion);
        const data = {
            published: false,
            packHash: '',
            packUrl: '',
            semanticVersion: semanticVersion,
            versionNumber: semanticVersion.version
        };
        pathData = ObjectUtil.assign({}, pathData, {
            versionNumber: semanticVersion.version
        });
        return this.set(contextChain, pathData, data);
    },

    /**
     * @param {ContextChain} contextChain
    * @param {{
     *      packClass: string,
     *      packName: string,
     *      packScope: string,
     *      packType: string,
     *      versionNumber: string
     * }} pathData
     * @param {{
     *      published: boolean,
     *      packHash: string,
     *      packUrl: string
     * }} data
     * @return {Promise}
     */
    updatePublished(contextChain, pathData, data) {
        const pathParts = this.generatePathParts(pathData);
        const updates = FirebaseMulti
            .update(pathParts.concat(['versions', pathData.versionNumber]), data)
            .set(pathParts.concat(['versionsInfo', 'last']),  pathData.versionNumber)
            .set(pathParts.concat(['versionsInfo', 'all', pathData.versionNumber]), pathData.versionNumber)
            .build();
        return Firebase
            .proof(contextChain, [])
            .update(updates);
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
     *      versionNumber: string
     * }} pathData
     * @return {string}
     */
    generatePath(contextChain, pathData) {
        return Firebase.path(contextChain, ['packs', pathData.packType, pathData.packClass, pathData.packScope, pathData.packName, 'versions', pathData.versionNumber]);
    },

    /**
     * @private
     * @param pathData
     * @returns {Array<string>}
     */
    generatePathParts(pathData) {
        return ['packs', pathData.packType, pathData.packClass, pathData.packScope, pathData.packName];
    }
});


//-------------------------------------------------------------------------------
// Private Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {PackVersionManager}
 */
PackVersionManager.instance        = null;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {PackVersionManager}
 */
PackVersionManager.getInstance = function() {
    if (PackVersionManager.instance === null) {
        PackVersionManager.instance = new PackVersionManager();
    }
    return PackVersionManager.instance;
};


//-------------------------------------------------------------------------------
// Static Proxy
//-------------------------------------------------------------------------------

Proxy.proxy(PackVersionManager, Proxy.method(PackVersionManager.getInstance), [
    'create',
    'disableCache',
    'enableCache',
    'get',
    'remove',
    'set',
    'update',
    'updatePublished'
]);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackVersionManager;
