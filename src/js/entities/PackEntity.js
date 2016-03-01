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
const PackEntity = Class.extend(Entity, {

    _name: 'bitpack.PackEntity',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getCreatedAt() {
        return this.getRawData().createdAt;
    },

    /**
     * @return {string}
     */
    getName() {
        return this.getRawData().name;
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
    getType() {
        return this.getRawData().type;
    },

    /**
     * @return {number}
     */
    getUpdatedAt() {
        return this.getRawData().updatedAt;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackEntity;
