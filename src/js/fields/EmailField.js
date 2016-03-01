//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Throwables,
    TypeUtil
} from 'bugcore';
import EmailValidator from 'email-validator';
import { EmailToUserIdIndex } from '../indexes';
import { Firebase } from '../util';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const EmailField = Class.extend(Obj, {
    _name: 'bitpack.EmailField'
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {UserEntity} userEntity
 * @param {string} inputEmail
 */
EmailField.changeUsersEmail = async function(contextChain, userEntity, inputEmail) {
    const email = TypeUtil.isString(inputEmail) ? inputEmail.toLowerCase() : inputEmail;
    await this.validateEmail(contextChain, userEntity, email);
    const updates = {
        ['users/' + userEntity.getId() + '/email']: inputEmail,
        ['indexes/emailToUserId/' + Firebase.escapePathPart(inputEmail)]: userEntity.getId()
    };
    if (userEntity.getEmail()) {
        updates['indexes/emailToUserId/' + Firebase.escapePathPart(userEntity.getEmail())] = null;
    }
    return await Firebase
        .proof(contextChain, [])
        .update(updates);
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {UserEntity} userEntity
 * @param {string} email
 */
EmailField.validateEmail = async function(contextChain, userEntity, email) {
    if (!TypeUtil.isString(email) || !EmailValidator.validate(email)) {
        throw Throwables.exception('BadEmail');
    }
    try {
        const snapshot = await EmailToUserIdIndex.getUserIdForEmail(contextChain, email);

        if (!snapshot.exists()) {
            return;
        }
        const userId = snapshot.val();
        if (userId === userEntity.getId()) {
            throw Throwables.exception('EmailUnchanged');
        }
    } catch(error) {
        if (error.message.indexOf('access_denied' > -1)) {
            throw Throwables.exception('EmailInUse');
        }
        throw error;
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default EmailField;
