//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Throwables
} from 'bugcore';
import {
    PackCache
} from '../caches';
import {
    Pack
} from '../core';
import {
    PathUtil
} from '../util';
import fs from 'fs-promise';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const PackStore = Class.extend(Obj, {

    _name: 'bitpack.PackStore',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} execDir
     * @param {PackFileStore} packFileStore
     */
    _constructor(execDir, packFileStore) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.execDir            = execDir;

        /**
         * @private
         * @type {PackCache}
         */
        this.packCache          = new PackCache();

        /**
         * @private
         * @type {PackFileStore}
         */
        this.packFileStore      = packFileStore;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getExecDir() {
        return this.execDir;
    },

    /**
     * @return {PackCache}
     */
    getPackCache() {
        return this.packCache;
    },

    /**
     * @return {PackFileStore}
     */
    getPackFileStore() {
        return this.packFileStore;
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
     * @return {Pack}
     */
    async loadPack(packType, packClass, packScope, packName, packVersionNumber) {
        let pack = this.packCache.get(packType, packClass, packScope, packName, packVersionNumber);
        if (!pack) {
            pack = await this.doLoadPack(packType, packClass, packScope, packName, packVersionNumber);
            if (pack) {
                this.packCache.set(packType, packClass, packScope, packName, packVersionNumber, pack);
            }
        }
        return pack;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @param {string} packVersionNumber
     * @return {Pack}
     */
    async doLoadPack(packType, packClass, packScope, packName, packVersionNumber) {
        const packFilePath = PathUtil.resolvePackFilePath(this.execDir, packType, packClass, packScope, packName, packVersionNumber);
        const packFile = await this.packFileStore.loadPackFile(packFilePath, {
            class: packClass,
            scope: packScope,
            type: packType
        });
        if (!packFile) {
            throw Throwables.exception('PackDoesNotExist');
        }
        return new Pack(packFile);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackStore;
