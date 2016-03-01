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
const QueryResultData = Class.extend(Data, {

    _name: 'bitpack.QueryResultData',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getPackClass() {
        return this.getRawData().packClass;
    },

    /**
     * @return {string}
     */
    getPackName() {
        return this.getRawData().packName;
    },

    /**
     * @return {string}
     */
    getPackScope() {
        return this.getRawData().packScope;
    },

    /**
     * @return {string}
     */
    getPackType() {
        return this.getRawData().packType;
    },

    /**
     * @return {string}
     */
    getPackVersionNumber() {
        return this.getRawData().packVersionNumber;
    },


    //-------------------------------------------------------------------------------
    // Data Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toCacheKey() {
        return this.getPackType() + '-' + this.getPackScope() + '-' + this.getPackName() + '-' + this.getPackVersionNumber();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default QueryResultData;
