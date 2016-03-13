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
        return this.getData('createdAt');
    },

    /**
     * @return {string}
     */
    getName() {
        return this.getData('name');
    },

    /**
     * @return {string}
     */
    getScope() {
        return this.getData('scope');
    },

    /**
     * @return {string}
     */
    getType() {
        return this.getData('type');
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

export default PackEntity;
