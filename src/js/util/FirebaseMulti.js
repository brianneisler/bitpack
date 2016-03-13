//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj
} from 'bugcore';
import Firebase from './Firebase';
import _ from 'lodash';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const FirebaseMulti = Class.extend(Obj, {

    _name: 'bitpack.FirebaseMulti',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor() {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Object}
         */
        this.updates = {};
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getUpdates() {
        return this.updates;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    build() {
        return this.updates;
    },

    /**
     * @param {Array.<string>} partParts
     * @return {FirebaseMulti}
     */
    remove(partParts) {
        _.assign(this.updates, {[this.generatePartialPath(partParts)]: null});
        return this;
    },

    /**
     * @param {Array<string>} partParts
     * @param {*} data
     * @return {FirebaseMulti}
     */
    set(partParts, data) {
        _.assign(this.updates, {[this.generatePartialPath(partParts)]: data});
        return this;
    },

    /**
     * @param {Array.<string>} partParts
     * @param {*} data
     * @return {FirebaseMulti}
     */
    update(partParts, data) {
        if (_.isObjectLike(data)) {
            _.each(data, (value, key) => {
                this.set(partParts.concat(key), value);
            });
        } else {
            this.set(partParts, data);
        }
        return this;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Array.<string>} pathParts
     * @return {string}
     */
    generatePartialPath(pathParts) {
        return _.map(pathParts, (part) => {
            return Firebase.escapePathPart(part);
        }).join('/');
    }
});



//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {Array.<string>} pathParts
 * @return {FirebaseMulti}
 */
FirebaseMulti.remove = function(pathParts) {
    return (new FirebaseMulti()).remove(pathParts);
};

/**
 * @static
 * @param {Array.<string>} pathParts
 * @param {*} data
 * @return {FirebaseMulti}
 */
FirebaseMulti.set = function(pathParts, data) {
    return (new FirebaseMulti()).set(pathParts, data);
};

/**
 * @static
 * @param {Array.<string>} pathParts
 * @param {*} data
 * @return {FirebaseMulti}
 */
FirebaseMulti.update = function(pathParts, data) {
    return (new FirebaseMulti()).update(pathParts, data);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default FirebaseMulti;
