//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Throwables,
    TypeUtil
} from 'bugcore';
import IContext from './IContext';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const FirebaseContext = Class.extend(Obj, {

    _name: 'pack.FirebaseContext',


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
         * @type {string}
         */
        this.firebaseUrl    = '';
    },


    //-------------------------------------------------------------------------------
    // Init Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      firebaseUrl: string=
     * }=} options
     * @return {FirebaseContext}
     */
    init(options) {
        const _this = this._super();
        if (_this) {
            if (TypeUtil.isObject(options) && TypeUtil.isString(options.firebaseUrl)) {
                _this.firebaseUrl = options.firebaseUrl;
            } else {
                throw Throwables.illegalArgumentBug('options.firebaseUrl', options.firebaseUrl, 'firebaseUrl must be a valid firebase url');
            }
        }
        return _this;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getFirebaseUrl() {
        return this.firebaseUrl;
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
        if (Class.doesExtend(value, FirebaseContext)) {
            return (
                Obj.equals(value.getFirebaseUrl(), this.firebaseUrl)
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
            this._hashCode = Obj.hashCode('[FirebaseContext]' +
                Obj.hashCode(this.firebaseUrl));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // IContext Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toContextKey() {
        return this.firebaseUrl;
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(FirebaseContext, IContext);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default FirebaseContext;
