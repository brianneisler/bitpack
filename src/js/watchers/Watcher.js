//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    ObjectUtil
} from 'bugcore';
import Firebase from '../util/Firebase';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Firebase}
 */
const Watcher = Class.extend(Firebase, {

    _name: 'bitpack.Watcher',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor(firebaseQuery) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Firebase}
         */
        this.firebaseQuery = firebaseQuery;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    start() {
        this.firebaseQuery
            .on('value', )
    },

    /**
     * @method Watcher#set
     * @param {*} value
     * @param {function=} onComplete
     */
    set(value, onComplete) {
        this.addTime(value);
        this._super(value, onComplete);
    },

    /**
     * @method Watcher#update
     * @param {Object} value
     * @param {function=} onComplete
     */
    update(value, onComplete) {
        this.addUpdatedAt(value);
        this._super(value, onComplete);
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
     * }} entity
     */
    addCreatedAt(entity) {
        ObjectUtil.assign(entity, { createdAt: Firebase.timestamp() });
    },

    /**
     * @protected
     * @param {{
     *  createdAt: number,
     *  id: string,
     *  updatedAt: number
     * }} entity
     */
    addTime(entity) {
        this.addCreatedAt(entity);
        this.addUpdatedAt(entity);
    },

    /**
     * @protected
     * @param {{
     *  createdAt: number,
     *  id: string,
     *  updatedAt: number
     * }} entity
     */
    addUpdatedAt(entity) {
        ObjectUtil.assign(entity, { updatedAt: Firebase.timestamp() });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default Watcher;
