//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Throwables
} from 'bugcore';
import { PackDownloadCache } from '../caches';
import { PackDownload, PackPackage } from '../core';
import fs from 'fs-promise';
import path from 'path';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const PackDownloadStore = Class.extend(Obj, {

    _name: 'bitpack.PackDownloadStore',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} cacheDir
     */
    _constructor(cacheDir) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        //TODO BRN: Add watchers for when packDownloads change. On change, delete cache entry (or reload file and update cache)

        /**
         * @private
         * @type {string}
         */
        this.cacheDir                   = cacheDir;

        /**
         * @private
         * @type {PackDownloadCache}
         */
        this.packDownloadCache        = new PackDownloadCache();
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
     * @return {PackDownloadCache}
     */
    getPackDownloadCache() {
        return this.packDownloadCache;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} packUrl
     * @return {PackDownload}
     */
    async download(packUrl) {
        let packDownload = this.packDownloadCache.get(packUrl);
        if (!packDownload) {
            packDownload = await this.loadFromPackCacheDir(packUrl);
            if (!packDownload) {
                packDownload = this.downloadPack(packUrl);
            }
            this.packDownloadCache.set(packUrl, packDownload);
        }
        return packDownload;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} packUrl
     * @returns {PackDownload}
     */
    async downloadPack(packUrl) {
        const cacheFilePath     = this.makeCachePath(packUrl);
        const packPackage     = await PackPackage.fromUrl(packUrl);
        await packPackage.saveToFile(cacheFilePath);
        return new PackDownload(packUrl, packPackage);
    },

    /**
     * @private
     * @param {string} packUrl
     * @return {PackDownload}
     */
    async loadFromPackCacheDir(packUrl) {
        const cacheFilePath     = this.makeCachePath(packUrl);
        try {
            await this.validateCacheFilePath(cacheFilePath);
            const packPackage = await PackPackage.fromTarball(cacheFilePath);
            return new PackDownload(packUrl, packPackage);
        } catch(throwable) {
            if (throwable.code !== 'ENOENT') {
                throw throwable;
            }
        }
    },

    /**
     * @private
     * @param {string} packUrl
     * @return {string}
     */
    makeCachePath(packUrl) {
        return path.resolve(this.cacheDir, packUrl
            .replace(/^(http(s)?):\/\//, ''));

    },

    /**
     * @private
     * @param {string} cacheFilePath
     */
    async validateCacheFilePath(cacheFilePath) {
        const stats     = await fs.stat(cacheFilePath);
        if (!stats.isFile()) {
            throw Throwables.exception('CacheNotAFile', {}, 'The cache file path "' + cacheFilePath + '" is not a file');
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackDownloadStore;
