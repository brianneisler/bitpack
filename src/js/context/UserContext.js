//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
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
const UserContext = Class.extend(Obj, {

    _name: 'pack.UserContext',


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
        this.userId       = '';
    },


    //-------------------------------------------------------------------------------
    // Init Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      userId: string=
     * }=} options
     * @return {UserContext}
     */
    init(options) {
        const _this = this._super();
        if (_this) {
            if (TypeUtil.isObject(options) && TypeUtil.isString(options.userId)) {
                _this.userId = options.userId;
            } else {
                _this.userId = 'anonymous';
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
    getUserId() {
        return this.userId;
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
        if (Class.doesExtend(value, UserContext)) {
            return (
                Obj.equals(value.getUserId(), this.userId)
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
            this._hashCode = Obj.hashCode('[UserContext]' +
                Obj.hashCode(this.userId));
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
        return this.userId;
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(UserContext, IContext);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default UserContext;
