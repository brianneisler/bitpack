//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Proxy,
    Throwables
} from 'bugcore';
import generator from 'firebase-token-generator';
import { ConfigController } from '../controllers';


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
     */
    _constructor() {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.tokenGenerator = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

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
        const firebaseSecret = ConfigController.getProperty('firebaseSecret');
        if (!firebaseSecret) {
            throw Throwables.exception('NoFirebaseSecret', {}, 'Assert your firebaseSecret has been set in config');
        }
        this.tokenGenerator = new generator(firebaseSecret);
    }
});



//-------------------------------------------------------------------------------
// Private Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {FirebaseTokenGenerator}
 */
FirebaseTokenGenerator.instance        = null;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {FirebaseTokenGenerator}
 */
FirebaseTokenGenerator.getInstance = function() {
    if (FirebaseTokenGenerator.instance === null) {
        FirebaseTokenGenerator.instance = new FirebaseTokenGenerator();
    }
    return FirebaseTokenGenerator.instance;
};


//-------------------------------------------------------------------------------
// Static Proxy
//-------------------------------------------------------------------------------

Proxy.proxy(FirebaseTokenGenerator, Proxy.method(FirebaseTokenGenerator.getInstance), [
    'generateDebugTokenWithAuthData'
]);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default FirebaseTokenGenerator;
