//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class
} from 'bugcore';
import Entity from './Entity';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Entity}
 */
const PackVersionsInfoEntity = Class.extend(Entity, {

    _name: 'bitpack.PackVersionsInfoEntity',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {ContextChain} contextChain
     * @param {*} pathData
     * @param {{
     *  all: Object<string, string>,
     *  createdAt: number,
     *  last: string,
     *  updatedAt: number
     * }} rawData
     */
    _constructor(contextChain, pathData, rawData) {

        this._super(contextChain, pathData, rawData);


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this._allHash                = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object.<string, string>}
     */
    getAll() {
        return this.getData('all');
    },

    /**
     * @return {number}
     */
    getCreatedAt() {
        return this.getData('createdAt');
    },

    /**
     * @return {string}
     */
    getLast() {
        return this.getData('last');
    },

    /**
     * @return {number}
     */
    getUpdatedAt() {
        return this.getData('updatedAt');
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackVersionsInfoEntity;
