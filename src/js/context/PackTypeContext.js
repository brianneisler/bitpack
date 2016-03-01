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
const PackTypeContext = Class.extend(Obj, {

    _name: 'pack.PackTypeContext',


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
        this.packType       = '';
    },


    //-------------------------------------------------------------------------------
    // Init Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      packType: string
     * }} options
     * @return {UserContext}
     */
    init(options) {
        const _this = this._super();
        if (_this) {
            if (TypeUtil.isObject(options) && TypeUtil.isString(options.packType)) {
                _this.packType = options.packType;
            } else {
                throw Throwables.exception('ContextError', {}, 'packType is required');
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
    getPackType() {
        return this.packType;
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
        if (Class.doesExtend(value, PackTypeContext)) {
            return (
                Obj.equals(value.getPackType(), this.packType)
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
            this._hashCode = Obj.hashCode('[PackTypeContext]' +
                Obj.hashCode(this.packType));
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
        return this.packType;
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(PackTypeContext, IContext);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackTypeContext;
