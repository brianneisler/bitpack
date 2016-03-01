//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    IJsonable,
    IObjectable,
    Obj
} from 'bugcore';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const AuthData = Class.extend(Obj, {

    _name: 'bitpack.AuthData',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {{}} data
     */
    _constructor(data) {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.token  = data.token;

        /**
         * @private
         * @type {string}
         */
        this.uid    = data.uid;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getToken() {
        return this.token;
    },

    /**
     * @return {string}
     */
    getUid() {
        return this.uid;
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
        if (Class.doesExtend(value, AuthData)) {
            return (
                Obj.equals(value.getToken(), this.token) &&
                Obj.equals(value.getUid(), this.uid)
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
            this._hashCode = Obj.hashCode('[AuthData]' +
                Obj.hashCode(this.token) + '_' +
                Obj.hashCode(this.uid));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // IJsonable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toJson() {
        return JSON.stringify(this.toObject());
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject() {
        return {
            token: this.token,
            uid: this.uid
        };
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(AuthData, IJsonable);
Class.implement(AuthData, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default AuthData;
