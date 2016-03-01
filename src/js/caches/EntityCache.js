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
const EntityCache = Class.extend(Obj, {

    _name: 'bitpack.EntityCache',


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
         * @type {Map.<string, Entity>}
         */
        this.cacheKeyToEntityMap  = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Map.<string, Entity>}
     */
    getCacheKeyToEntityMap() {
        return this.cacheKeyToEntityMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} path
     * @return {boolean}
     */
    delete(path) {
        const cacheKey = this.makeCacheKey(path);
        return this.cacheKeyToEntityMap.delete(cacheKey);
    },

    /**
     * @param {string} path
     * @return {Entity}
     */
    get(path) {
        const cacheKey = this.makeCacheKey(path);
        return this.cacheKeyToEntityMap.get(cacheKey);
    },

    /**
     * @param {string} path
     * @return {boolean}
     */
    has(path) {
        const cacheKey = this.makeCacheKey(path);
        return this.cacheKeyToEntityMap.containsKey(cacheKey);
    },

    /**
     * @param {string} path
     * @param {Entity} entity
     * @return {Entity}
     */
    set(path, entity) {
        const cacheKey = this.makeCacheKey(path);
        return this.cacheKeyToEntityMap.put(cacheKey, entity);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} path
     * @return {string}
     */
    makeCacheKey(path) {
        return path;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default EntityCache;
