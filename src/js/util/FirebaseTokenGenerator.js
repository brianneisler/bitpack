//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Throwables
} from 'bugcore';
import generator from 'firebase-token-generator';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const FirebaseTokenGenerator = Class.extend(Obj, {

    _name: 'bitpack.FirebaseTokenGenerator',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} firebaseSecret
     */
    _constructor(firebaseSecret) {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.firebaseSecret     = firebaseSecret;

        /**
         * @private
         * @type {*}
         */
        this.tokenGenerator     = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getFirebaseSecret() {
        return this.firebaseSecret;
    },

    /**
     * @return {*}
     */
    getTokenGenerator() {
        return this.tokenGenerator;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      expires: number,
     *      uid: string
     * }} authData
     * @return {*}
     */
    generateDebugTokenWithAuthData(authData) {
        this.generateTokenGenerator();
        return this.tokenGenerator.createToken({
            uid: authData.uid
        }, {
            debug: true,
            expires: authData.expires
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    generateTokenGenerator() {
        if (!this.tokenGenerator) {
            if (!this.firebaseSecret) {
                throw Throwables.exception('NoFirebaseSecret', {}, 'Assert your firebaseSecret has been set in config');
            }
            this.tokenGenerator = new generator(this.firebaseSecret);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default FirebaseTokenGenerator;
