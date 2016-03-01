//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Throwables,
    TypeUtil
} from 'bugcore';
import path from 'path';
import IContext from './IContext';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const ExecContext = Class.extend(Obj, {

    _name: 'bitpack.ExecContext',


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
        this.execPath       = '';

        /**
         * @private
         * @type {string}
         */
        this.modulePath     = '';

        /**
         * @private
         * @type {string}
         */
        this.target         = '';

        /**
         * @private
         * @type {string}
         */
        this.userPath       = '';
    },


    //-------------------------------------------------------------------------------
    // Init Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      execPath: string=,
     *      target: string=
     * }=} options
     * @return {ExecContext}
     */
    init(options) {
        const _this = this._super();
        if (_this) {
            if (TypeUtil.isObject(options) && TypeUtil.isString(options.execPath)) {
                _this.execPath = path.resolve(options.execPath);
            } else {
                _this.execPath = path.resolve(process.cwd());
            }
            if (TypeUtil.isObject(options) && TypeUtil.isString(options.target)) {
                if (!ExecContext.TARGETS[options.target]) {
                    throw Throwables.illegalArgumentBug('options.target', options.target, 'target must be a valid target value ["global", "user", "project"]');
                }
                _this.target = options.target;
            } else {
                _this.target = 'project';
            }

            _this.modulePath = path.resolve(__dirname, '../../..');
            _this.userPath = path.resolve(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']);
        }
        return _this;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getExecPath() {
        return this.execPath;
    },

    /**
     * @return {string}
     */
    getModulePath() {
        return this.modulePath;
    },

    /**
     * @return {string}
     */
    getTarget() {
        return this.target;
    },

    /**
     * @return {string}
     */
    getUserPath() {
        return this.userPath;
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
        if (Class.doesExtend(value, ExecContext)) {
            return (
                Obj.equals(value.getModulePath(), this.modulePath) &&
                Obj.equals(value.getExecPath(), this.execPath) &&
                Obj.equals(value.getTarget(), this.target) &&
                Obj.equals(value.getUserPath(), this.userPath)
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
            this._hashCode = Obj.hashCode('[ExecContext]' +
                Obj.hashCode(this.modulePath) + '_' +
                Obj.hashCode(this.execPath) + '_' +
                Obj.hashCode(this.target) + '_' +
                Obj.hashCode(this.userPath));
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
        return this.execPath + '-' + this.modulePath + '-' + this.target + '-' + this.userPath;
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(ExecContext, IContext);


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
ExecContext.TARGETS = {
    global: 'global',
    project: 'project',
    user: 'user'
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default ExecContext;
