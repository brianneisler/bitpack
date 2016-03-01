//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    DataUtil,
    Obj,
    Promises,
    Throwables
} from 'bugcore';
import semver from 'semver';
import { PackQueryCache } from '../caches';
import { QueryResultData } from '../data';
import {
    PackVersionsInfoManager
} from '../managers';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const PackQueryStore = Class.extend(Obj, {

    _name: 'bitpack.PackQueryStore',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        //TODO BRN: Add watchers for when packQuerys change. On change, delete cache entry (or reload file and update cache)
        /**
         * @private
         * @type {PackQueryCache}
         */
        this.packQueryCache        = new PackQueryCache();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {PackQueryCache}
     */
    getPackQueryCache() {
        return this.packQueryCache;
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
        let queryResultData = this.packQueryCache.get(packType, packClass, packScope, packQuery);
        if (!queryResultData) {
            queryResultData = await this.doQuery(contextChain, packType, packClass, packScope, packQuery);
            this.packQueryCache.set(packType, packClass, packScope, packQuery, queryResultData);
        }
        return queryResultData;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packQuery
     * @return {QueryResultData}
     */
    async doQuery(contextChain, packType, packClass, packScope, packQuery) {
        const packQueryData = this.parsePackQuery(packType, packClass, packScope, packQuery);
        const packVersionsInfoEntity = await this.loadPackVersionsInfoEntity(contextChain, packQueryData);
        if (!packVersionsInfoEntity) {
            throw Throwables.exception('PackDoesNotExist', {}, 'A pack by the name "' + packQueryData.pathName + '" does not exist.');
        }
        const versionNumber = this.resolvePackVersionNumber(packQueryData, packVersionsInfoEntity);
        if (!versionNumber) {
            throw Throwables.exception('NoVersionMatch', {}, 'Cannot find a version match for "' + packQuery + '"');
        }
        return new QueryResultData({
            class: packQueryData.packClass,
            name: packQueryData.packName,
            scope: packQueryData.packScope,
            type: packQueryData.packtType,
            versionNumber
        });
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {{
     *      packClass: string,
     *      packName: string,
     *      packScope: string,
     *      packType: string,
     * }} pathData
     * @return {PackVersionsInfoEntity}
     */
    async loadPackVersionsInfoEntity(contextChain, pathData) {
        return await PackVersionsInfoManager.get(contextChain, pathData);
    },

    /**
     * @private
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packQuery
     * @return {{
     *      packClass: string,
     *      packName: string,
     *      packScope: string,
     *      packtType: string,
     *      versionQuery: string
     * }}
     */
    parsePackQuery(packType, packClass, packScope, packQuery) {
        if (packQuery.indexOf('@') > -1) {
            const parts = packQuery.split('@');
            return {
                packClass,
                packName: parts[0],
                packScope,
                packType,
                versionQuery: parts[1]
            };
        }
        return {
            packClass,
            packName: packQuery,
            packScope,
            packType,
            versionQuery: ''
        };
    },

    /**
     * @private
     * @param {PackVersionsInfoEntity} packVersionsInfoEntity
     * @return {string}
     */
    resolveLastPublishedPack(packVersionsInfoEntity) {
        return packVersionsInfoEntity.getLast();
    },

    /**
     * @private
     * @param {{
     *      versionQuery: string
     * }} packQueryData
     * @param {PackVersionsInfoEntity} packVersionsInfoEntity
     * @return {string}
     */
    resolvePackVersionNumber(packQueryData, packVersionsInfoEntity) {
        if (packQueryData.versionQuery) {
            return this.resolvePackVersionQuery(packQueryData.versionQuery, packVersionsInfoEntity);
        }
        return this.resolveLastPublishedPack(packVersionsInfoEntity);
    },

    /**
     * @private
     * @param {string} versionQuery
     * @param {PackVersionsInfoEntity} packVersionsInfoEntity
     * @return {string}
     */
    resolvePackVersionQuery(versionQuery, packVersionsInfoEntity) {
        const allVersions = DataUtil.map(packVersionsInfoEntity.getAll() || {}, version => version);
        return semver.maxSatisfying(allVersions, versionQuery);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackQueryStore;
