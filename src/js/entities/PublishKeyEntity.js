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
        return this.getRawData().createdAt;
    },

    /**
     * @return {string}
     */
    getKey() {
        return this.getRawData().key;
    },

    /**
     * @return {string}
     */
    getPackHash() {
        return this.getRawData().packHash;
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

    /**
     * @return {number}
     */
    getUpdatedAt() {
        return this.getRawData().updatedAt;
    },

    /**
     * @returns {?number}
     */
    getUsedAt() {
        return this.getRawData().usedAt;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PublishKeyEntity;
