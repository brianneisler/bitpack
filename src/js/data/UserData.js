//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    IObjectable,
    Obj,
    TypeUtil
} from 'bugcore';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const UserData = Class.extend(Obj, {

    _name: 'bitpack.UserData',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {{
     *      anonymous: boolean,
     *      id: string
     * }} data
     */
    _constructor(data) {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.anonymous      = TypeUtil.isBoolean(data.anonymous) ? data.anonymous : false;

        /**
         * @private
         * @type {string}
         */
        this.id             = data.id;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getAnonymous() {
        return this.anonymous;
    },

    /**
     * @return {string}
     */
    getId() {
        return this.id;
    },


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isAnonymous() {
        return this.getAnonymous();
    },


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {*} value
     * @return {boolean}
     */
    equals(value) {
        if (Class.doesExtend(value, UserData)) {
            return (
                Obj.equals(value.getId(), this.id)
            );
        }
        return false;
    },

    /**
     * @override
     * @return {number}
     */
    hashCode() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode('[UserData]' +
                Obj.hashCode(this.id));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject() {
        return {
            id: this.id
        };
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(UserData, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default UserData;
