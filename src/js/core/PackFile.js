//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    IJsonable,
    IObjectable,
    Obj,
    ObjectUtil,
    Throwables
} from 'bugcore';
import {
    PackData
} from '../data';
import fs from 'fs-promise';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const PackFile = Class.extend(Obj, {

    _name: 'bitpack.PackFile',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} filePath
     * @param {PackData} packData
     */
    _constructor(filePath, packData) {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.filePath       = filePath;

        /**
         * @private
         * @type {PackData}
         */
        this.packData     = packData;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getFilePath() {
        return this.filePath;
    },

    /**
     * @return {string}
     */
    getMain() {
        return this.packData.getMain();
    },

    /**
     * @return {string}
     */
    getName() {
        return this.packData.getName();
    },

    /**
     * @return {Object.<string, string>}
     */
    getNpmDependencies() {
        return this.packData.getNpmDependencies();
    },

    /**
     * @return {string}
     */
    getPackClass() {
        return this.packData.getPackClass();
    },

    /**
     * @return {PackData}
     */
    getPackData() {
        return this.packData;
    },

    /**
     * @return {string}
     */
    getScope() {
        return this.packData.getScope();
    },

    /**
     * @return {string}
     */
    getType() {
        return this.packData.getType();
    },

    /**
     * @return {string}
     */
    getVersion() {
        return this.packData.getVersion();
    },


    //-------------------------------------------------------------------------------
    // IJsonable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toJson() {
        return JSON.stringify(this.toObject());
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject() {
        return this.packData.toObject();
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
            mode: 0o644,
            flag: 'w'
        };
        console.log('Writing to file ', this.filePath);
        return await fs.writeFile(this.filePath, json, options);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(PackFile, IJsonable);
Class.implement(PackFile, IObjectable);


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} filePath
 * @param {Object=} defaultData
 * @return {PackFile}
 */
PackFile.loadFromFile = async function(filePath, defaultData = {}) {
    try {
        const fileData      = await fs.readFile(filePath, 'utf8');
        const data          = ObjectUtil.assign({}, defaultData, JSON.parse(fileData));
        return new PackFile(filePath, new PackData(data));
    } catch(error) {
        if (error.code === 'ENOENT') {
            throw Throwables.exception('NoPackFileFound', {}, 'Could not find pack file at "' + filePath + '"');
        }
        throw error;
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackFile;
