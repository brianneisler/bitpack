//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Config,
    Throwables
} from 'bugcore';
import fs from 'fs-promise';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Config}
 */
const PackConfig = Class.extend(Config, {

    _name: 'bitpack.PackConfig',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} filePath
     * @param {boolean} exists
     */
    _constructor(filePath, exists) {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.exists     = exists;

        /**
         * @private
         * @type {string}
         */
        this.filePath   = filePath;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getExists() {
        return this.exists;
    },

    /**
     * @return {string}
     */
    getFilePath() {
        return this.filePath;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    async saveToFile() {
        const json = this.toJson();
        const options = {
            encoding: 'utf8',
            mode: 0o600,
            flag: 'w'
        };
        console.log('Writing to file ', this.filePath);
        await fs.writeFile(this.filePath, json, options);
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} filePath
 * @param {Object} defaults
 * @return {PackConfig}
 */
PackConfig.loadFromFile = async function(filePath, defaults = {}) {
    let exists      = false;
    let data        = defaults;
    try {
        await PackConfig.validateConfigFile(filePath);
        const fileData = await fs.readFile(filePath, 'utf8');
        data = fileData ? JSON.parse(fileData) : {};
        exists = true;
    } catch(throwable) {
        if (throwable.code !== 'ENOENT') {
            throw throwable;
        }
    }

    const packConfig = new PackConfig(filePath, exists);
    packConfig.updateProperties(data);
    return packConfig;
};

/**
 * @static
 * @param {string} filePath
 */
PackConfig.validateConfigFile = async function(filePath) {
    const stats     = await fs.stat(filePath);
    if (!stats.isFile()) {
        throw Throwables.exception('ConfigNotAFile', {}, 'The config path "' + filePath + '" is not a file');
    }
    const perms = stats.mode.toString(8);
    if (perms.substr(3) !== '600') {
        throw Throwables.exception('BadConfigSecurityPerms', {}, 'Cannot read a config file with perms "' + perms.substr(3) + '. Perms must be 600');
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackConfig;
