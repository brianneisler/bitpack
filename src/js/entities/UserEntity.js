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
const UserEntity = Class.extend(Entity, {

    _name: 'bitpack.UserEntity',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getEmail() {
        return this.getData('email');
    },

    /**
     * @return {string}
     */
    getId() {
        return this.getData('id');
    },

    /**
     * @return {string}
     */
    getUsername() {
        return this.getData('username');
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default UserEntity;
