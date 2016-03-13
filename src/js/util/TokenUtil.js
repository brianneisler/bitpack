//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    StringUtil,
    TypeUtil
} from 'bugcore';
import _ from 'lodash';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const TokenUtil = Class.extend(Obj, {
    _name: 'bitpack.TokenUtil'
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {*} value
 * @param {Object} valueMap
 * @return {string}
 */
TokenUtil.replace = function(value, valueMap) {
    if (TypeUtil.isString(value)) {
        return TokenUtil.replaceString(value, valueMap);
    } else if (TypeUtil.isObject(value)) {
        return _.reduce(value, (result, val, key) => {
            return _.assign(result, {
                [key]: TokenUtil.replaceString(val, valueMap)
            });
        }, {});
    } else if (TypeUtil.isArray(value)) {
        _.map(value, (val) => {
            TokenUtil.replaceString(val, valueMap)
        });
    }
    return value;
};

/**
 * @param {*} string
 * @param {Object} valueMap
 * @return {string}
 */
TokenUtil.replaceString = function(string, valueMap) {
    if (TypeUtil.isString(string)) {
        const matches = string.match(/\{([a-zA-Z0-9_-]+)\}/g);
        return _.reduce(matches, (result, match) => {
            const key = match.substr(1, match.length - 2);
            const value = !TypeUtil.isUndefined(valueMap[key]) ? valueMap[key] : '';
            return StringUtil.replaceAll(result, match, value);
        }, string);
    }
    return string;
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default TokenUtil;
