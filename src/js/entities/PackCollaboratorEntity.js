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
const PackCollaboratorEntity = Class.extend(Entity, {

    _name: 'bitpack.PackCollaboratorEntity',


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
     * @return {boolean}
     */
    getOwner() {
        return this.getRawData().owner;
    },

    /**
     * @return {string}
     */
    getUserId() {
        return this.getRawData().userId;
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

export default PackCollaboratorEntity;
