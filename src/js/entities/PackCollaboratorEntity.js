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
        return this.getData('createdAt');
    },

    /**
     * @return {boolean}
     */
    getOwner() {
        return this.getData('owner');
    },

    /**
     * @return {string}
     */
    getUserId() {
        return this.getData('userId');
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

export default PackCollaboratorEntity;
