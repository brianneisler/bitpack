//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj
} from 'bugcore';
import crypto from 'crypto';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const KeyUtil = Class.extend(Obj, {
    _name: 'bitpack.KeyUtil'
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {string}
 */
KeyUtil.generate = function() {
    const currentDate   = (new Date()).valueOf().toString();
    const random1       = Math.random().toString();
    const random2       = Math.random().toString();
    const pid           = process.pid;
    return crypto.createHash('sha1').update(currentDate + random1 + pid).digest('hex')
        + crypto.createHash('sha1').update(currentDate + random2 + pid).digest('hex');
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default KeyUtil;
