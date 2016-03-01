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
const UsernameToUserIdIndex = Class.extend(Firebase, {
    _name: 'bitpack.UsernameToUserIdIndex'
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {string} username
 * @return {Fireproof}
 */
UsernameToUserIdIndex.getUserIdForUsername = function(contextChain, username) {
    return (new UsernameToUserIdIndex(contextChain, ['indexes', 'usernameToUserId', username]))
        .proof();
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {string} username
 * @return {Promise}
 */
UsernameToUserIdIndex.removeUserIdForUsername = function(contextChain, username) {
    return (new UsernameToUserIdIndex(contextChain, ['indexes', 'usernameToUserId', username]))
        .proof()
        .remove();
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {string} username
 * @param {string} userId
 * @returns {Promise}
 */
UsernameToUserIdIndex.setUserIdForUsername = function(contextChain, username, userId) {
    return (new UsernameToUserIdIndex(contextChain, ['indexes', 'usernameToUserId', username]))
        .proof()
        .set(userId);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default UsernameToUserIdIndex;
