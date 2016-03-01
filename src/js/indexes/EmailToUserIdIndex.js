//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class
} from 'bugcore';
import { Firebase } from '../util';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Firebase}
 */
const EmailToUserIdIndex = Class.extend(Firebase, {
    _name: 'bitpack.EmailToUserIdIndex'
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {string} email
 * @return {Fireproof}
 */
EmailToUserIdIndex.getUserIdForEmail = function(contextChain, email) {
    return (new EmailToUserIdIndex(contextChain, ['indexes', 'emailToUserId', email]))
        .proof();
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {string} email
 * @return {Promise}
 */
EmailToUserIdIndex.removeUserIdForEmail = function(contextChain, email) {
    return (new EmailToUserIdIndex(contextChain, ['indexes', 'emailToUserId', email]))
        .proof()
        .remove();
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {string} email
 * @param {string} userId
 * @return {Promise}
 */
EmailToUserIdIndex.setUserIdForEmail = function(contextChain, email, userId) {
    return (new EmailToUserIdIndex(contextChain, ['indexes', 'emailToUserId', email]))
        .proof()
        .set(userId);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default EmailToUserIdIndex;
