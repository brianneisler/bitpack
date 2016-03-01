//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Map,
    Obj
} from 'bugcore';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const PackCache = Class.extend(Obj, {

    _name: 'bitpack.PackCache',


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

        /**
         * @private
         * @type {Map.<string, Pack>}
         */
        this.cacheKeyToPackMap  = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Map.<string, Pack>}
     */
    getCacheKeyToPackMap() {
        return this.cacheKeyToPackMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @param {string} packVersionNumber
     * @return {boolean}
     */
    delete(packType, packClass, packScope, packName, packVersionNumber) {
        const cacheKey = this.makeCacheKey(packType, packClass, packScope, packName,  packVersionNumber);
        return this.cacheKeyToPackMap.delete(cacheKey);
    },

    /**
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @param {string} packVersionNumber
     * @return {Pack}
     */
    get(packType, packClass, packScope, packName, packVersionNumber) {
        const cacheKey = this.makeCacheKey(packType, packClass, packScope, packName,  packVersionNumber);
        return this.cacheKeyToPackMap.get(cacheKey);
    },

    /**
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @param {string} packVersionNumber
     * @return {boolean}
     */
    has(packType, packClass, packScope, packName, packVersionNumber) {
        const cacheKey = this.makeCacheKey(packType, packClass, packScope, packName,  packVersionNumber);
        return this.cacheKeyToPackMap.containsKey(cacheKey);
    },

    /**
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @param {string} packVersionNumber
     * @param {Pack} pack
     * @return {Pack}
     */
    set(packType, packClass, packScope, packName, packVersionNumber, pack) {
        const cacheKey = this.makeCacheKey(packType, packClass,  packScope, packName,  packVersionNumber);
        return this.cacheKeyToPackMap.put(cacheKey, pack);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @param {string} packVersionNumber
     * @return {string}
     */
    makeCacheKey(packType, packClass, packScope, packName, packVersionNumber) {
        return packType + '@' + packClass + '@' + packScope + '@' + packName + '@' + packVersionNumber;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackCache;
