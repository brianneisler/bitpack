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
const PackDownloadCache = Class.extend(Obj, {

    _name: 'bitpack.PackDownloadCache',


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
         * @type {Map.<string, PackDownload>}
         */
        this.cacheKeyToPackDownloadMap  = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getCacheDir() {
        return this.cacheDir;
    },

    /**
     * @return {Map.<string, PackDownload>}
     */
    getCacheKeyToPackDownloadMap() {
        return this.cacheKeyToPackDownloadMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} packUrl
     * @return {boolean}
     */
    delete(packUrl) {
        const cacheKey = this.makeCacheKey(packUrl);
        return this.cacheKeyToPackDownloadMap.delete(cacheKey);
    },

    /**
     * @param {string} packUrl
     * @return {PackDownload}
     */
    get(packUrl) {
        const cacheKey = this.makeCacheKey(packUrl);
        return this.cacheKeyToPackDownloadMap.get(cacheKey);
    },

    /**
     * @param {string} packUrl
     * @return {boolean}
     */
    has(packUrl) {
        const cacheKey = this.makeCacheKey(packUrl);
        return this.cacheKeyToPackDownloadMap.containsKey(cacheKey);
    },

    /**
     * @param {string} packUrl
     * @param {PackDownload} packDownload
     * @return {PackDownload}
     */
    set(packUrl, packDownload) {
        const cacheKey = this.makeCacheKey(packUrl);
        return this.cacheKeyToPackDownloadMap.put(cacheKey, packDownload);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} packUrl
     * @return {string}
     */
    makeCacheKey(packUrl) {
        return packUrl;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackDownloadCache;
