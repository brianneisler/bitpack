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
const PackQueryCache = Class.extend(Obj, {

    _name: 'bitpack.PackQueryCache',


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
         * @type {Map.<string, QueryResultData>}
         */
        this.cacheKeyToQueryResultDataMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Map.<string, QueryResultData>}
     */
    getCacheKeyToQueryResultDataMap() {
        return this.cacheKeyToQueryResultDataMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packQuery
     * @return {QueryResultData}
     */
    get(packType, packClass, packScope, packQuery) {
        const cacheKey = this.makeCacheKey(packType, packClass, packScope, packQuery);
        return this.cacheKeyToQueryResultDataMap.get(cacheKey);
    },

    /**
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packQuery
     * @return {boolean}
     */
    has(packType, packClass, packScope, packQuery) {
        const cacheKey = this.makeCacheKey(packType, packClass, packScope, packQuery);
        return this.cacheKeyToQueryResultDataMap.containsKey(cacheKey);
    },

    /**
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packQuery
     * @param {QueryResultData} queryResultData
     */
    set(packType, packClass, packScope, packQuery, queryResultData) {
        const cacheKey = this.makeCacheKey(packType, packClass, packScope, packQuery);
        this.cacheKeyToQueryResultDataMap.put(cacheKey, queryResultData);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packQuery
     * @return {string}
     */
    makeCacheKey(packType, packClass, packScope, packQuery) {
        return packType + '@' + packClass + '@' + packScope + '@' + packQuery;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackQueryCache;
