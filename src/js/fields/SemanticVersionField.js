//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    ObjectUtil,
    Throwables,
    TypeUtil
} from 'bugcore';
import semver from 'semver';
import { RegexUtil } from '../util';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const SemanticVersionField = Class.extend(Obj, {
    _name: 'bitpack.SemanticVersionField'
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {RegExp}
 */
SemanticVersionField.VERSION_NUMBER_REGEX = new RegExp('^' +
    '(' + RegexUtil.NO_LEADING_ZERO + ')' +
    '\\.(' + RegexUtil.NO_LEADING_ZERO + ')' +
    '\\.(' + RegexUtil.NO_LEADING_ZERO + ')' +
    '(?:-((?:' + RegexUtil.NO_LEADING_ZERO_IDENTIFIER + ')(?:\\.(?:' + RegexUtil.NO_LEADING_ZERO_IDENTIFIER + '))*))?' +
    '(?:\\+((?:' + RegexUtil.NO_LEADING_ZERO_IDENTIFIER + ')(?:\\.(?:' + RegexUtil.NO_LEADING_ZERO_IDENTIFIER + '))*))?' +
    '$');


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} version
 * @return {{
 *      build: Array.<string>
 *      major: number,
 *      minor: number,
 *      patch: number,
 *      prerelease: Array.<string>,
 *      raw: string,
 *      version: string
 * }}
 */
SemanticVersionField.parse = function(version) {
    return ObjectUtil.pick(semver.parse(version), ['build', 'major', 'minor', 'patch', 'prerelease', 'raw', 'version']);
};

/**
 * @static
 * @param {string} version
 */
SemanticVersionField.validate = function(version) {
    if (!TypeUtil.isString(version)) {
        throw Throwables.exception('PackInvalid', {}, 'Pack version must be a string');
    }
    if (!(SemanticVersionField.VERSION_NUMBER_REGEX).test(version)) {
        throw Throwables.exception('PackInvalid', {}, 'Pack version must of of the format [number].[number].[number]');
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default SemanticVersionField;
