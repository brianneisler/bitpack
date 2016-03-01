//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Promises,
    Throwables,
    TypeUtil
} from 'bugcore';
import { PackFileCache } from '../caches';
import { PackFile } from '../core';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const PackFileStore = Class.extend(Obj, {

    _name: 'bitpack.PackFileStore',


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

        //TODO BRN: Add watchers for when packFiles change. On change, delete cache entry (or reload file and update cache)
        /**
         * @private
         * @type {PackFileCache}
         */
        this.packFileCache        = new PackFileCache();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {PackFileCache}
     */
    getPackFileCache() {
        return this.packFileCache;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} packFilePath
     * @param {Object=} defaultData
     * @return {PackFile}
     */
    async loadPackFile(packFilePath, defaultData = {}) {
        let packFile = this.packFileCache.get(packFilePath);
        if (!packFile) {
            try {
                packFile = await PackFile.loadFromFile(packFilePath, defaultData);
                this.validatePackFile(packFile);
            } catch (throwable) {
                if (throwable.type !== 'NoPackFileFound') {
                    throw throwable;
                }
            }
            if (packFile) {
                this.packFileCache.set(packFilePath, packFile);
            }
        }
        return packFile;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {PackFile} packFile
     */
    validatePackFile(packFile) {
        if (!TypeUtil.isString(packFile.getName())) {
            throw Throwables.exception('InvalidPackFile', {}, 'Invalid pack.json file, "name" must be specified.');
        }
        if (!TypeUtil.isString(packFile.getVersion())) {
            throw Throwables.exception('InvalidPackFile', {}, 'Invalid pack.json file, "version" must be specified.');
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackFileStore;
