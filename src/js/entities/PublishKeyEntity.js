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
const PublishKeyEntity = Class.extend(Entity, {

    _name: 'bitpack.PublishKeyEntity',


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
    getKey() {
        return this.getData('key');
    },

    /**
     * @return {string}
     */
    getPackClass() {
        return this.getData('packClass');
    },

    /**
     * @return {string}
     */
    getPackHash() {
        return this.getData('packHash');
    },

    /**
     * @return {string}
     */
    getPackName() {
        return this.getData('packName');
    },

    /**
     * @return {string}
     */
    getPackScope() {
        return this.getData('packScope');
    },

    /**
     * @return {string}
     */
    getPackType() {
        return this.getData('packType');
    },

    /**
     * @return {string}
     */
    getPackVersionNumber() {
        return this.getData('packVersionNumber');
    },

    /**
     * @return {number}
     */
    getUpdatedAt() {
        return this.getData('updatedAt');
    },

    /**
     * @returns {?number}
     */
    getUsedAt() {
        return this.getData('usedAt');
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PublishKeyEntity;
