//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Throwables
} from 'bugcore';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const ContextChain = Class.extend(Obj, {

    _name: 'bitpack.ContextChain',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ExecContext}
         */
        this.execContext        = null;

        /**
         * @private
         * @type {FirebaseContext}
         */
        this.firebaseContext    = null;

        /**
         * @private
         * @type {PackTypeContext}
         */
        this.packTypeContext    = null;

        /**
         * @private
         * @type {UserContext}
         */
        this.userContext        = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {ExecContext}
     */
    getExecContext() {
        if (!this.execContext) {
            throw Throwables.exception('NoCurrentContext', {}, 'Must first establishExecContext before getting current context');
        }
        return this.execContext;
    },

    /**
     * @param {ExecContext} execContext
     */
    setExecContext(execContext) {
        this.execContext = execContext;
    },

    /**
     * @return {FirebaseContext}
     */
    getFirebaseContext() {
        if (!this.firebaseContext) {
            throw Throwables.exception('NoCurrentContext', {}, 'Must first establishFirebaseContext before getting current context');
        }
        return this.firebaseContext;
    },

    /**
     * @param {FirebaseContext} firebaseContext
     */
    setFirebaseContext(firebaseContext) {
        this.firebaseContext = firebaseContext;
    },

    /**
     * @return {PackTypeContext}
     */
    getPackTypeContext() {
        if (!this.packTypeContext) {
            throw Throwables.exception('NoCurrentContext', {}, 'Must first establishPackTypeContext before getting current context');
        }
        return this.packTypeContext;
    },

    /**
     * @param {PackTypeContext} packTypeContext
     */
    setPackTypeContext(packTypeContext) {
        this.packTypeContext = packTypeContext;
    },

    /**
     * @return {UserContext}
     */
    getUserContext() {
        if (!this.userContext) {
            throw Throwables.exception('NoCurrentContext', {}, 'Must first establishUserContext before getting current context');
        }
        return this.userContext;
    },

    /**
     * @param {UserContext} userContext
     */
    setUserContext(userContext) {
        this.userContext = userContext;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default ContextChain;
