//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    Promises
} from 'bugcore';
import { TokenUtil } from '../util';
import _ from 'lodash';
import crypto from 'crypto';
import fs from 'fs-promise';
import fse from 'fs-extra';
import ignore from 'ignore';
import path from 'path';
import request from 'request';
import stream from 'stream';
import tar from 'tar-fs';
import zlib from 'zlib';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const PackPackage = Class.extend(Obj, {

    _name: 'bitpack.PackPackage',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Buffer} packStream
     * @param {string} packHash
     */
    _constructor(packStream, packHash) {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.packHash     = packHash;

        /**
         * @private
         * @type {Buffer}
         */
        this.packStream   = packStream;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getPackHash() {
        return this.packHash;
    },

    /**
     * @return {Buffer}
     */
    getPackStream() {
        return this.packStream;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} packPath
     */
    async extractToPath(packPath) {
        await fs.ensureDir(packPath);
        await this.pipeToDir(packPath);
    },

    /**
     * @param {Stream} nextStream
     */
    pipe(nextStream) {
        const pass = new stream.PassThrough();
        this.packStream.pipe(nextStream);
        this.packStream.pipe(pass);
        this.packStream = pass;
    },

    /**
     * @param {string} outputPath
     */
    async saveToFile(outputPath) {
        await fs.ensureFile(outputPath);
        await this.pipeToFile(outputPath);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------
    /**
     * @private
     * @param {string} outputPath
     * @return {Promise}
     */
    pipeToDir(outputPath) {
        return Promises.promise((resolve, reject) => {
            let caughtError = null;
            const ws        = tar.extract(outputPath);
            const gunzip    = zlib.createGunzip();
            const pass      = new stream.PassThrough();
            this.packStream
                .pipe(gunzip)
                .pipe(ws)
                .on('error', (error) => {
                    caughtError = error;
                })
                .on('finish', () => {
                    if (caughtError) {
                        return reject(caughtError);
                    }
                    this.packStream = pass;
                    return resolve();
                });
            this.packStream.pipe(pass);
        });
    },

    /**
     * @private
     * @param {string} outputPath
     * @return {Promise}
     */
    pipeToFile(outputPath) {
        return Promises.promise((resolve, reject) => {
            let caughtError = null;
            const ws = fs.createWriteStream(outputPath);
            const pass = new stream.PassThrough();
            this.packStream.pipe(ws)
                .on('error', (error) => {
                    caughtError = error;
                })
                .on('finish', () => {
                    if (caughtError) {
                        return reject(caughtError);
                    }
                    this.packStream = pass;
                    return resolve();
                });
            this.packStream.pipe(pass);
        });
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @type {Array.<string>}
 */
PackPackage.DEFAULT_IGNORES = [
    '.*.swp',
    '._*',
    '.DS_Store',
    '.git',
    '.hg',
    '.lock-wscript',
    '.npmrc',
    '.{packType}',
    '.{packType}rc',
    '.svn',
    '.wafpickle-*',
    'config.gypi',
    'CVS',
    'node_modules',
    'npm-debug.log'
];

/**
 * @static
 * @enum {string}
 */
PackPackage.IGNORE_FILE_NAME = '.{packType}ignore';


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} packType
 * @param {string} packPath
 * @return {PackPackage}
 */
PackPackage.fromPath = async function(packType, packPath) {
    const packagePaths = await PackPackage.findPackagePaths(packType, packPath);
    const relativePackagePaths = _.map(packagePaths, (packagePath) => {
        return path.relative(packPath, packagePath);
    });
    const gzip = zlib.createGzip();
    const packageStream = tar.pack(packPath, {
        entries: relativePackagePaths
    });
    const packStream = packageStream.pipe(gzip);
    return await PackPackage.fromStream(packStream);
};

/**
 * @static
 * @param {Stream} packStream
 * @return {PackPackage}
 */
PackPackage.fromStream = async function(packStream) {
    const [newPackStream, packHash] = await PackPackage.hashPackStream(packStream);
    return new PackPackage(newPackStream, packHash);
};

/**
 * @static
 * @param {string} tarballPath
 * @return {PackPackage}
 */
PackPackage.fromTarball = async function(tarballPath) {
    const packStream = fs.createReadStream(tarballPath);
    return await PackPackage.fromStream(packStream);
};


/**
 * @static
 * @param {string} packUrl
 * @return {PackPackage}
 */
PackPackage.fromUrl = async function(packUrl) {
    const packStream = request(packUrl);
    return await PackPackage.fromStream(packStream);
};


//-------------------------------------------------------------------------------
// Private Static Methods
//-------------------------------------------------------------------------------

/**
 * @private
 * @static
 * @param {string} packType
 * @param {string} packPath
 * @return {Array<string>}
 */
PackPackage.findPackagePaths = async function(packType, packPath) {
    const packPaths = await PackPackage.walkPackPath(packPath);
    const ignoreFilePath = path.resolve(packPath, PackPackage.getIgnoreFileName(packType));
    const ignoreFile = ignore.select([ignoreFilePath]);
    return ignore()
        .addIgnoreFile(ignoreFile)
        .addPattern(PackPackage.getDefaultIgnores(packType))
        .filter(packPaths);
};

/**
 * @static
 * @return {string}
 */
PackPackage.getDefaultIgnores = function(packType) {
    return TokenUtil.replace(PackPackage.DEFAULT_IGNORES, { packType });
};

/**
 * @static
 * @return {string}
 */
PackPackage.getIgnoreFileName = function(packType) {
    return TokenUtil.replaceString(PackPackage.IGNORE_FILE_NAME, { packType });
};

/**
 * @private
 * @static
 * @param {Stream} packStream
 * @return {Promise.<Stream, string>}
 */
PackPackage.hashPackStream = function(packStream) {
    return Promises.promise((resolve, reject) => {
        const hash = crypto.createHash('sha1');
        hash.setEncoding('hex');
        const duplicateStream = new stream.PassThrough();
        let caughtError = null;
        packStream
            .on('error', (error) => {
                console.log('error:', error);
                caughtError = error;
            })
            .on('end', () => {
                if (caughtError) {
                    return reject(caughtError);
                }
                hash.end();
                return resolve([duplicateStream, hash.read()]);
            });
        packStream.pipe(hash);
        packStream.pipe(duplicateStream);
    });
};

/**
 * @private
 * @static
 * @param {string} packPath
 * @return {Promise<Array<string>>}
 */
PackPackage.walkPackPath = function(packPath) {
    return Promises.promise((resolve) => {
        const items = [];
        fse.walk(packPath)
            .on('data', (item) => {
                if (item.path !== packPath) {
                    items.push(item.path);
                }
            })
            .on('error', function (err, item) {
                console.log(err.message);
                console.log('error reading ', item.path);
            })
            .on('end', () => {
                resolve(items);
            });
    });
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackPackage;
