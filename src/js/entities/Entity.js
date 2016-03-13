//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    IObjectable,
    ObjectUtil
} from 'bugcore';
import _ from 'lodash';
import Firebase from '../util/Firebase';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Firebase}
 */
const Entity = Class.extend(Firebase, {

    _name: 'bitpack.Entity',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {ContextChain} contextChain
     * @param {*} pathData
     * @param {Object} rawData
     */
    _constructor(contextChain, pathData, rawData) {

        this._super(contextChain, pathData);


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Object}
         */
        this.rawData = rawData;
    },


    //-------------------------------------------------------------------------------
    // Init Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Entity}
     */
    init: function() {
        const _this = this._super();

        if (_this) {
            _this.on('value', (snapshot) => {
                _this.rawData = snapshot.val();
            });
        }
        return _this;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getRawData() {
        return this.rawData;
    },

    /**
     * @param {string} path
     * @return {*}
     */
    getData(path) {
        return _.get(this.rawData, path);
    },


    //-------------------------------------------------------------------------------
    // Firebase Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} rawData
     * @param {function=} onComplete
     * @return {Firebase}
     */
    push(rawData, onComplete) {
        this.addTime(rawData);
        return this._super(rawData, onComplete);
    },

    /**
     * @method Entity#set
     * @param {*} rawData
     * @param {function=} onComplete
     */
    set(rawData, onComplete) {
        this.addTime(rawData);
        return this._super(rawData, onComplete);
    },

    /**
     * @method Entity#update
     * @param {Object} rawData
     * @param {function=} onComplete
     */
    update(rawData, onComplete) {
        this.addUpdatedAt(rawData);
        return this._super(rawData, onComplete);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    hasData() {
        return this.rawData !== null;
    },

    /**
     * @return {string}
     */
    toPath() {
        return this.toString();
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject() {
        return this.rawData;
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {{
     *  createdAt: number,
     *  id: string,
     *  updatedAt: number
     * }} rawData
     */
    addCreatedAt(rawData) {
        ObjectUtil.assign(rawData, { createdAt: Firebase.timestamp() });
    },

    /**
     * @protected
     * @param {{
     *  createdAt: number,
     *  id: string,
     *  updatedAt: number
     * }} rawData
     */
    addTime(rawData) {
        this.addCreatedAt(rawData);
        this.addUpdatedAt(rawData);
    },

    /**
     * @protected
     * @param {{
     *  createdAt: number,
     *  id: string,
     *  updatedAt: number
     * }} rawData
     */
    addUpdatedAt(rawData) {
        ObjectUtil.assign(rawData, { updatedAt: Firebase.timestamp() });
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Entity, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default Entity;
