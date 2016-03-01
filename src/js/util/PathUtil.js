//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj
} from 'bugcore';
import path from 'path';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const PathUtil = Class.extend(Obj, {
    _name: 'bitpack.PathUtil'
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {ContextChain} contextChain
 * @return {string}
 */
PathUtil.resolveExecDirFromContextChain = function(contextChain) {
    return path.resolve(contextChain.getExecContext().getExecPath());
};

/**
 * @static
 * @param {string} packPath
 * @param {string} packType
 * @return {string}
 */
PathUtil.resolvePackFileFromPackPath = function(packPath, packType) {
    return path.resolve(packPath, packType + '.json');
};

/**
 * @param {string} execDir
 * @param {string} packType
 * @param {string} packClass
 * @param {string} packScope
 * @param {string} packName
 * @param {string} packVersionNumber
 * @return {string}
 */
PathUtil.resolvePackPath = function(execDir, packType, packClass, packScope, packName, packVersionNumber) {
    return path.resolve(execDir, '.' + packType, packClass, packScope, packName, packVersionNumber);
};

/**
 * @param {string} execDir
 * @param {string} packType
 * @param {string} packClass
 * @param {string} packScope
 * @param {string} packName
 * @param {string} packVersionNumber
 * @return {string}
 */
PathUtil.resolvePackFilePath = function(execDir, packType, packClass, packScope, packName, packVersionNumber) {
    return PathUtil.resolvePackFileFromPackPath(
        PathUtil.resolvePackPath(execDir, packType, packClass, packScope, packName, packVersionNumber),
        packType
    );
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PathUtil;
