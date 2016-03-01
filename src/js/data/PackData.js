//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class
} from 'bugcore';
import { Data } from './';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Data}
 */
const PackData = Class.extend(Data, {

    _name: 'bitpack.PackData',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getMain() {
        return this.getRawData().main;
    },

    /**
     * @return {string}
     */
    getName() {
        return this.getRawData().name;
    },

    /**
     * @return {Object.<string, string>}
     */
    getNpmDependencies() {
        return this.getRawData().npmDependencies || {};
    },

    /**
     * @return {string}
     */
    getScope() {
        return this.getRawData().scope;
    },

    /**
     * @return {string}
     */
    getPackClass() {
        return this.getRawData().class;
    },

    /**
     * @return {string}
     */
    getType() {
        return this.getRawData().type;
    },

    /**
     * @return {string}
     */
    getVersion() {
        return this.getRawData().version;
    },


    //-------------------------------------------------------------------------------
    // Data Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toCacheKey() {
        return this.getType() + '-' + this.getPackClass() + '-' + this.getScope() + '-' + this.getName() + '-' + this.getVersion();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackData;
