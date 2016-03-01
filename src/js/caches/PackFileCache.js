//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Map,
    Obj
} from 'bugcore';
import path from 'path';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const PackFileCache = Class.extend(Obj, {

    _name: 'pack.PackFileCache',


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
         * @type {Map.<string, PackFile>}
         */
        this.cacheKeyToPackFileMap  = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Map.<string, PackFile>}
     */
    getCacheKeyToPackFileMap() {
        return this.cacheKeyToPackFileMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} packFilePath
     * @return {boolean}
     */
    delete(packFilePath) {
        const cacheKey = this.makeCacheKey(packFilePath);
        return this.cacheKeyToPackFileMap.delete(cacheKey);
    },

    /**
     * @param {string} packFilePath
     * @return {PackFile}
     */
    get(packFilePath) {
        const cacheKey = this.makeCacheKey(packFilePath);
        return this.cacheKeyToPackFileMap.get(cacheKey);
    },

    /**
     * @param {string} packFilePath
     * @return {boolean}
     */
    has(packFilePath) {
        const cacheKey = this.makeCacheKey(packFilePath);
        return this.cacheKeyToPackFileMap.containsKey(cacheKey);
    },

    /**
     * @param {string} packFilePath
     * @param {PackFile} packFile
     * @return {PackFile}
     */
    set(packFilePath, packFile) {
        const cacheKey = this.makeCacheKey(packFilePath);
        return this.cacheKeyToPackFileMap.put(cacheKey, packFile);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} packFilePath
     * @return {string}
     */
    makeCacheKey(packFilePath) {
        return path.resolve(packFilePath);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackFileCache;
