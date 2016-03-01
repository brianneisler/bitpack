//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Promises,
    Throwables,
    TypeUtil
} from 'bugcore';
import { UsernameToUserIdIndex } from '../indexes';
import { Firebase } from '../util';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const UsernameField = Class.extend(Obj, {
    _name: 'bitpack.UsernameField'
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {RegExp}
 */
UsernameField.USERNAME_REGEX = /^[a-z]+(?:[a-z0-9-][a-z0-9]+)*$/;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {UserEntity} userEntity
 * @param {string} inputUsername
 * @return {Promise}
 */
UsernameField.changeUsersUsername = function(contextChain, userEntity, inputUsername) {
    const username = TypeUtil.isString(inputUsername) ? inputUsername.toLowerCase() : inputUsername;
    return UsernameField.validateUsername(contextChain, userEntity, username)
        .then(() => {
            const updates = {
                ['users/' + userEntity.getId() + '/username']: username,
                ['indexes/usernameToUserId/' + username]: userEntity.getId()
            };
            if (userEntity.getUsername()) {
                updates['indexes/usernameToUserId/' + userEntity.getUsername()] = null;
            }
            return Firebase
                .proof(contextChain, [])
                .update(updates);
        });
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {UserEntity} userEntity
 * @param {string} username
 * @returns {Promise}
 */
UsernameField.validateUsername = function(contextChain, userEntity, username) {
    return Promises.try(() => {
        if (!TypeUtil.isString(username) || !username.match(UsernameField.USERNAME_REGEX)) {
            throw Throwables.exception('BadUsername');
        }
        return UsernameToUserIdIndex.getUserIdForUsername(contextChain, username);
    }).then((snapshot) => {
        if (!snapshot.exists()) {
            return true;
        }
        const userId = snapshot.val();
        if (userId !== userEntity.getId()) {
            throw Throwables.exception('UsernameInUse');
        } else {
            throw Throwables.exception('UsernameUnchanged');
        }
    });
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default UsernameField;
