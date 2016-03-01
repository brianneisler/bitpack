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
const CurrentUser = Class.extend(Obj, {

    _name: 'bitpack.CurrentUser',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {UserData} userData
     * @param {AuthData} authData
     */
    _constructor(userData, authData) {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AuthData}
         */
        this.authData = authData;

        /**
         * @private
         * @type {UserData}
         */
        this.userData = userData;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {AuthData}
     */
    getAuthData() {
        return this.authData;
    },

    /**
     * @return {UserData}
     */
    getUserData() {
        return this.userData;
    },


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getAuthToken() {
        return this.authData.getToken();
    },

    /**
     * @return {string}
     */
    getUserId() {
        return this.userData.getId();
    },

    /**
     * @return {boolean}
     */
    isAnonymous() {
        return this.userData.isAnonymous();
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
        if (Class.doesExtend(value, CurrentUser)) {
            return (
                Obj.equals(value.getAuthData(), this.authData) &&
                Obj.equals(value.getUserData(), this.userData)
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
            this._hashCode = Obj.hashCode('[CurrentUser]' +
                Obj.hashCode(this.authData) + '_' +
                Obj.hashCode(this.userData));
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
            auth: this.authData.toObject(),
            user: this.userData.toObject()
        };
    },


    //-------------------------------------------------------------------------------
    // IJsonable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toJson() {
        return JSON.stringify(this.toObject());
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(CurrentUser, IJsonable);
Class.implement(CurrentUser, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default CurrentUser;
