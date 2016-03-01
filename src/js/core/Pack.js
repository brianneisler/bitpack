//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
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
const Pack = Class.extend(Obj, {

    _name: 'bitpack.Pack',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {PackFile} packFile
     */
    _constructor(packFile) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PackFile}
         */
        this.packFile     = packFile;

        /**
         * @private
         * @type {function(function(Error), *)}
         */
        this.packMethod       = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getMain() {
        return this.packFile.getMain();
    },

    /**
     * @return {string}
     */
    getName() {
        return this.packFile.getName();
    },

    /**
     * @return {Object.<string, string>}
     */
    getNpmDependencies() {
        return this.packFile.getNpmDependencies();
    },

    /**
     * @return {string}
     */
    getPackClass() {
        return this.packFile.getPackClass();
    },

    /**
     * @return {function(function(Error), *)}
     */
    getPackMethod() {
        return this.packMethod;
    },

    /**
     * @return {string}
     */
    getPackPath() {
        return path.dirname(this.packFile.getFilePath());
    },

    /**
     * @return {string}
     */
    getScope() {
        return this.packFile.getScope();
    },

    /**
     * @return {string}
     */
    getType() {
        return this.packFile.getType();
    },
    /**
     * @return {string}
     */
    getVersion() {
        return this.packFile.getVersion();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Array.<*>} packArgs
     */
    runPack(packArgs) {
        if (!this.packMethod) {
            this.packMethod = require(path.resolve(this.getPackPath(), this.main));
        }
        return this.packMethod.apply(null, packArgs);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default Pack;
