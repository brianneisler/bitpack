//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    DataUtil,
    Obj,
    StringBuilder,
    StringUtil,
    Throwables,
    TypeUtil
} from 'bugcore';
import firebase from 'Firebase';
import {
    ConfigController
} from '../controllers';
import Fireproof from './Fireproof';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const Firebase = Class.extend(Obj, {

    _name: 'bitpack.Firebase',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {ContextChain} contextChain
     * @param {*} ref
     */
    _constructor(contextChain, ref) {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {firebase}
         */
        this._ref = null;

        if (ref instanceof firebase) {
            this._ref = ref;
        } else {
            this._ref = new firebase(Firebase.path(contextChain, ref), Firebase.userContext(contextChain));
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @method Firebase#getRef
     * @return {firebase}
     */
    getRef() {
        return this._ref;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} authToken
     * @param {function=} onComplete
     * @param {{}} options
     */
    authWithCustomToken(authToken, onComplete, options) {
        return this._ref.authWithCustomToken(authToken, onComplete, options);
    },

    /**
     * @param {{
     *      email: string,
     *      password: string
     * }} credentials
     * @param {function=} onComplete
     */
    authWithPassword(credentials, onComplete) {
        return this._ref.authWithPassword(credentials, onComplete);
    },

    /**
     * @param {{
     *      email: string,
     *      password: string
     * }} credentials
     * @param {function=} onComplete
     */
    createUser(credentials, onComplete) {
        return this._ref.createUser(credentials, onComplete);
    },

    /**
     * @return {*}
     */
    key() {
        return this._ref.key();
    },

    /**
     * @param {string=} eventType
     * @param {function()=} callback
     * @param {Object=} context
     */
    off(eventType, callback, context) {
        return this._ref.off(eventType, callback, context);
    },

    /**
     * @param {string} eventType
     * @param {function()} callback
     * @param {function()=} cancelCallback
     * @param {Object=} context
     * @return {function()}
     */
    on(eventType, callback, cancelCallback, context) {
        return this._ref.on(eventType, callback, cancelCallback, context);
    },

    /**
     * @param eventType
     * @param successCallback
     * @param failureCallback
     * @param context
     */
    once(eventType, successCallback, failureCallback, context) {
        return this._ref.once(eventType, successCallback, failureCallback, context);
    },

    /**
     * @method Firebase#proof
     * @return {Promise}
     */
    proof() {
        return new Fireproof(this);
    },

    /**
     * @method Firebase#push
     * @param {*} value
     * @param {function=} onComplete
     * @return {Firebase}
     */
    push(value, onComplete) {
        const ref = this._ref.push(value, onComplete);
        return new Firebase(ref);
    },

    /**
     * @method Firebase#ref
     * @return {firebase}
     */
    ref() {
        return this._ref;
    },

    /**
     * @method Firebase#remove
     * @param {function=} onComplete
     */
    remove(onComplete) {
        return this._ref.remove(onComplete);
    },

    /**
     * @method Firebase#set
     * @param {*} value
     * @param {function=} onComplete
     */
    set(value, onComplete) {
        return this._ref.set(value, onComplete);
    },

    /**
     * @return {string}
     */
    toString() {
        return this._ref.toString();
    },

    /**
     * @method Firebase#transaction
     * @param {function} updateFunction
     * @param {function=} onComplete
     * @param {boolean=} applyLocally
     */
    transaction(updateFunction, onComplete, applyLocally) {
        return this._ref.transaction(updateFunction, onComplete, applyLocally);
    },

    /**
     * @return {*}
     */
    unauth() {
        return this._ref.unauth();
    },

    /**
     * @method Firebase#update
     * @param {Object} value
     * @param {function=} onComplete
     */
    update(value, onComplete) {
        return this._ref.update(value, onComplete);
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {string} token
 * @param {function=} onComplete
 * @return {Promise}
 */
Firebase.authWithCustomToken = function(contextChain, token, onComplete) {
    return (new Firebase(contextChain, []))
        .proof()
        .authWithCustomToken(token, onComplete);
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {{
 *      email: string,
 *      password: string
 * }} credentials
 * @param {function=} onComplete
 * @return {Promise}
 */
Firebase.authWithPassword = function(contextChain, credentials, onComplete) {
    return (new Firebase(contextChain, []))
        .proof()
        .authWithPassword(credentials, onComplete);
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {{
 *      email: string,
 *      password: string
 * }} credentials
 * @param {function=} onComplete
 * @return {Promise}
 */
Firebase.createUser = function(contextChain, credentials, onComplete) {
    return (new Firebase(contextChain, []))
        .proof()
        .createUser(credentials, onComplete);
};

/**
 * @static
 * @param {string} pathPart
 * @return {string}
 */
Firebase.escapePathPart = function(pathPart) {
    return new StringBuilder(pathPart)
        .replaceAll('.', '(P)')
        .replaceAll('@', '(A)')
        .replaceAll('!', '(B)')
        .replaceAll('#', '(H)')
        .replaceAll('$', '(D)')
        .replaceAll('%', '(PR)')
        .replaceAll('&', '(AN)')
        .replaceAll('\'', '(SQ)')
        .replaceAll('*', '(ST)')
        .replaceAll('+', '(PL)')
        .replaceAll('/', '(FS)')
        .replaceAll('=', '(E)')
        .replaceAll('?', '(Q)')
        .replaceAll('^', '(C)')
        .replaceAll('`', '(G)') //grave accent
        .replaceAll('{', '(OC)')
        .replaceAll('|', '(PI)')
        .replaceAll('}', '(CC)')
        .build();
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {*} ref
 * @return {Firebase}
 */
Firebase.fire = function(contextChain, ref) {
    return new Firebase(contextChain, ref);
};

/**
 * @static
 * @param {*} value
 * @return {boolean}
 */
Firebase.isMultiUpdate = function(value) {
    return (TypeUtil.isObject(value) && DataUtil.anyIn(value, (key) => StringUtil.contains(key, '/')));
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {string | Array.<string>} value
 * @return {string}
 */
Firebase.path = function(contextChain, value) {
    const firebaseUrl = ConfigController.getProperty(contextChain, 'firebaseUrl').replace(/\/$/, '');
    let pathParts = [];
    if (TypeUtil.isString(value)) {
        pathParts = value
            .replace(firebaseUrl, '')
            .replace(/\/$/, '')
            .replace(/^\//, '')
            .split('/');
    } else if (TypeUtil.isArray(value)) {
        pathParts = value;
    } else {
        throw new Throwables.illegalArgumentBug('value', value, 'must be a string or an array of strings');
    }
    return ([firebaseUrl])
        .concat(
            pathParts.map((pathPart) => {
                return Firebase.escapePathPart(pathPart);
            })
        )
        .join('/');
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {*} ref
 * @return {Fireproof}
 */
Firebase.proof = function(contextChain, ref) {
    return (new Firebase(contextChain, ref)).proof();
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @param {*} ref
 * @return {Firebase}
 */
Firebase.ref = function(contextChain, ref) {
    return (new Firebase(contextChain, ref)).ref();
};

/**
 * @static
 * @returns {number}
 */
Firebase.timestamp = function() {
    return firebase.ServerValue.TIMESTAMP;
};

/**
 * @static
 * @param {ContextChain} contextChain
 */
Firebase.unauth = function(contextChain) {
    return (new Firebase(contextChain, []))
        .unauth();
};

/**
 * @static
 * @param {string} pathPart
 * @return {string}
 */
Firebase.unescapePathPart = function(pathPart) {
    return new StringBuilder(pathPart)
        .replaceAll('(P)', '.')
        .replaceAll('(A)', '@')
        .replaceAll('(B)', '!')
        .replaceAll('(H)', '#')
        .replaceAll('(D)', '$')
        .replaceAll('(PR)', '%')
        .replaceAll('(AN)', '&')
        .replaceAll('(SQ)', '\'')
        .replaceAll('(ST)', '*')
        .replaceAll('(PL)', '+')
        .replaceAll('(FS)' ,'/')
        .replaceAll('(E)', '=')
        .replaceAll('(Q)', '?')
        .replaceAll('(C)', '^')
        .replaceAll('(G)', '`') //grave accent
        .replaceAll('(OC)', '{')
        .replaceAll('(PI)', '|')
        .replaceAll('(CC)', '}')
        .build();
};

/**
 * @static
 * @param {ContextChain} contextChain
 * @return {string}
 */
Firebase.userContext = function(contextChain) {
    return contextChain.getUserContext().getUserId();
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default Firebase;
