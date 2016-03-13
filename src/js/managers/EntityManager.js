//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Throwables
} from 'bugcore';
import { EntityCache } from '../caches';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const EntityManager = Class.extend(Obj, {

    _name: 'bitpack.EntityManager',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {EntityClass} entityClass
     */
    _constructor(entityClass) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        //TODO BRN: Add watchers for when Entities change. On change, delete cache entry (or reload file and update cache)

        /**
         * @private
         * @type {boolean}
         */
        this.cacheEnabled   = true;

        /**
         * @private
         * @type {EntityCache}
         */
        this.entityCache    = new EntityCache();

        /**
         * @private
         * @type {Class}
         */
        this.entityClass    = entityClass;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {EntityCache}
     */
    getEntityCache() {
        return this.entityCache;
    },

    /**
     * @return {Class}
     */
    getEntityClass() {
        return this.entityClass;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    disableCache() {
        this.cacheEnabled = false;
    },

    /**
     *
     */
    enableCache() {
        this.cacheEnabled = true;
    },

    /**
     * @param {ContextChain} contextChain
     * @param {Object} pathData
     * @return {Promise<Entity>}
     */
    get(contextChain, pathData) {
        const path = this.generatePath(contextChain, pathData);
        return this.cachePass(path, () => {
            const entity = this.generateEntity(contextChain, path, null);
            return entity
                .proof()
                .then(() => {
                    return entity;
                });
        });
    },

    /**
     * @param {ContextChain} contextChain
     * @param {Object} pathData
     * @return {Promise}
     */
    remove(contextChain, pathData) {
        const path      = this.generatePath(contextChain, pathData);
        const entity    = this.generateEntity(contextChain, path, null);
        return entity
            .proof()
            .remove()
            .then(() => {
                this.removeCache(path);
            });
    },

    /**
     * @param {ContextChain} contextChain
     * @param {Object} pathData
     * @param {Object} rawData
     * @return {Promise<Entity>}
     */
    set(contextChain, pathData, rawData) {
        return this.get(contextChain, pathData)
            .then((entity) => {
                return entity
                    .proof()
                    .set(rawData)
                    .then(() => {
                        return entity;
                    });
            });
    },

    /**
     * @param {ContextChain} contextChain
     * @param {Object} pathData
     * @param {{
     * }} updates
     * @return {Promise<Entity>}
     */
    update(contextChain, pathData, updates) {
        return this.get(contextChain, pathData)
            .then((entity) => {
                return entity
                    .proof()
                    .update(updates)
                    .then(() => {
                        return entity;
                    });
            });
    },


    //-------------------------------------------------------------------------------
    // Abstract Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @param {ContextChain} contextChain
     * @param {Object} pathData
     * @return {string}
     */
    generatePath(contextChain, pathData) {   //eslint-disable-line no-unused-vars
        throw Throwables.bug('AbstractMethodNotImplemented', {}, 'Must implement EntityManager.generate');
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Entity} entity
     * @return {Entity}
     */
    addCache(entity) {
        if (this.cacheEnabled) {
            this.entityCache.set(entity.toPath(), entity);
        }
        return entity;
    },

    /**
     * @protected
     * @param {string} path
     */
    removeCache(path) {
        if (this.cacheEnabled) {
            return this.entityCache.delete(path);
        }
    },

    /**
     * @protected
     * @param {string} path
     * @param {function():Promise} getMethod
     * @return {Promise<Entity>}
     */
    cachePass(path, getMethod) {
        const value = this.cacheEnabled ? this.entityCache.get(path) : null;
        if (!value) {
            return getMethod()
                .then((entity) => {
                    return this.addCache(entity);
                });
        }
        return Promise.resolve(value);
    },

    /**
     * @protected
     * @param {ContextChain} contextChain
     * @param {*} pathData
     * @param {Object} rawData
     * @return {Entity}
     */
    generateEntity(contextChain, pathData, rawData) {
        return new this.entityClass(contextChain, pathData, rawData);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default EntityManager;
