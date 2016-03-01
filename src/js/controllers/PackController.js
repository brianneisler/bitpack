//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Map,
    Obj,
    Promises,
    Throwables,
    TypeUtil
} from 'bugcore';
import npm from 'npm';
import request from 'request';
import {
    PackPackage
} from '../core';
import {
    SemanticVersionField
} from '../fields';
import {
    PublishKeyManager,
    PackCollaboratorManager,
    PackManager,
    PackVersionManager
} from '../managers';
import {
    PackDownloadStore,
    PackFileStore,
    PackStore
} from '../stores';
import {
    PathUtil
} from '../util';
import _ from 'lodash';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const PackController = Class.extend(Obj, {

    _name: 'bitpack.PackController',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor() {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AuthController}
         */
        this.authController                 = null;

        /**
         * @private
         * @type {Map.<string, PackDownloadStore>}
         */
        this.cacheDirToPackDownloadStore    = new Map();

        /**
         * @private
         * @type {ConfigController}
         */
        this.configController               = null;

        /**
         * @private
         * @type {Map.<string, PackStore>}
         */
        this.execDirToPackStoreMap          = new Map();

        /**
         * @private
         * @type {Promise}
         */
        this.prefixToNpmLoadingPromise      = new Map();

        /**
         * @private
         * @type {PackFileStore}
         */
        this.packFileStore                  = new PackFileStore();

        /**
         * @private
         * @type {QueryController}
         */
        this.queryController                = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {AuthController}
     */
    getAuthController() {
        return this.authController;
    },

    /**
     * @param {AuthController} authController
     * @return {PackController}
     */
    setAuthController(authController) {
        this.authController = authController;
        return this;
    },

    /**
     * @return {Map.<string, PackDownloadStore>}
     */
    getCacheDirToPackDownloadStoreMap() {
        return this.cacheDirToPackDownloadStore;
    },

    /**
     * @return {ConfigController}
     */
    getConfigController() {
        return this.configController;
    },

    /**
     * @return {Map.<string, PackStore>}
     */
    getExecDirToPackStoreMap() {
        return this.execDirToPackStoreMap;
    },

    /**
     * @param {ConfigController} configController
     * @return {PackController}
     */
    setConfigController(configController) {
        this.configController = configController;
        return this;
    },

    /**
     * @return {Promise}
     */
    getPrefixToNpmLoadingPromise() {
        return this.prefixToNpmLoadingPromise;
    },

    /**
     * @return {PackFileStore}
     */
    getPackFileStore() {
        return this.packFileStore;
    },

    /**
     * @return {QueryController}
     */
    getQueryController() {
        return this.queryController;
    },

    /**
     * @param {QueryController} queryController
     * @return {PackController}
     */
    setQueryController(queryController) {
        this.queryController = queryController;
        return this;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packQuery
     * @return {Pack}
     */
    async getPack(contextChain, packType, packClass, packScope, packQuery) {
        return await this.installPack(contextChain, packType, packClass, packScope, packQuery);
    },

    /**
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packQuery
     * @return {Pack}
     */
    async installPack(contextChain, packType, packClass, packScope, packQuery) {
        const packQueryResult = await this.queryController.query(contextChain, packType, packClass, packScope, packQuery);
        return await this.ensurePackInstalled(
            contextChain,
            packQueryResult.getPackType(),
            packQueryResult.getPackClass(),
            packQueryResult.getPackScope(),
            packQueryResult.getPackName(),
            packQueryResult.getPackVersionNumber()
        );
    },

    /**
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @param {string} packVersionNumber
     * @returns {Pack}
     */
    async loadPack(contextChain, packType, packClass, packScope, packName, packVersionNumber) {
        const packStore       = this.generatePackStore(contextChain);
        try {
            return await packStore.loadPack(packType, packClass, packScope, packName, packVersionNumber);
        } catch(throwable) {
            if (throwable.type !== 'PackDoesNotExist') {
                throw throwable;
            }
        }
    },

    /**
     * @param {string} packPath
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @return {PackFile}
     */
    async loadPackFile(packPath, packType, packClass, packScope) {
        const packFilePath = PathUtil.resolvePackFileFromPackPath(packPath, packType);
        return await this.packFileStore.loadPackFile(packFilePath, {
            class: packClass,
            scope: packScope,
            type: packType
        });
    },

    /**
     * @param {string} packPath
     * @return {PackPackage}
     */
    packagePack(packPath) {
        return PackPackage.fromPath(packPath);
    },

    /**
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packPath
     * @return {PublishKeyEntity}
     */
    async publishPack(contextChain, packType, packClass, packScope, packPath) {
        const packFile = await this.loadPackFile(packPath, packType, packClass, packScope);
        await this.validateNewPack(contextChain, packFile);
        const packPackage = await this.packagePack(packPath);
        await this.verifyCurrentUserAccessToPack(contextChain, packFile.getType(), packFile.getPackClass(), packFile.getScope(), packFile.getName());
        await this.ensurePackEntityCreated(contextChain, packFile.getType(), packFile.getPackClass(), packFile.getScope(), packFile.getName());
        const packVersionEntity = await this.ensurePackVersionEntityCreated(contextChain, packFile);
        const publishKeyEntity = await this.createPublishKey(contextChain, packFile, packPackage, packVersionEntity);
        console.log('publishing ' + publishKeyEntity.getPackName() + '@' + publishKeyEntity.getPackVersionNumber());
        await this.uploadPackPackage(contextChain, packPackage, publishKeyEntity);
        return publishKeyEntity;
    },

    /**
     * @param {ContextChain} contextChain
     * @param {PackFile} packFile
     * @return {PackFile}
     */
    async validateNewPack(contextChain, packFile) {
        this.validatePack(packFile);
        const entity = await this.loadPackVersionEntity(
            contextChain,
            packFile.getType(),
            packFile.getPackClass(),
            packFile.getScope(),
            packFile.getName(),
            packFile.getVersion()
        );
        if (entity) {
            if (entity.getPublished()) {
                throw Throwables.exception('PackVersionExists', {}, packFile.getType() + '-' + packFile.getPackClass() + ' ' + packFile.getName() + '@' + packFile.getVersion() + ' has already been published');
            }
        }
        return packFile;
    },

    /**
     * @param {PackFile} packFile
     */
    validatePack(packFile) {
        this.validatePackName(packFile.getName());
        this.validatePackVersion(packFile.getVersion());
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {PackFile} packFile
     * @param {PackPackage} packPackage
     * @param {PackVersionEntity} packVersionEntity
     * @return {PublishKeyEntity}
     */
    async createPublishKey(contextChain, packFile, packPackage, packVersionEntity) {
        return await PublishKeyManager.create(contextChain, {
            packClass: packFile.getPackClass(),
            packHash: packPackage.getPackHash(),
            packName: packFile.getName(),
            packScope: packFile.getScope(),
            packType: packFile.getType(),
            packVersionNumber: packVersionEntity.getVersionNumber()
        });
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {{
     *      class: string,
     *      name: string,
     *      scope: string,
     *      type: string
     * }} rawData
     * @return {PackEntity}
     */
    async createPackEntity(contextChain, rawData) {
        const currentUser = await this.authController.getCurrentUser(contextChain);
        if (currentUser.isAnonymous()) {
            throw Throwables.exception('UserIsAnonymous');
        }
        return await PackManager.create(contextChain, rawData, currentUser.getUserData());
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @param {string} packVersion
     * @return {PackVersionEntity}
     */
    async createPackVersionEntity(contextChain, packType, packClass, packScope, packName, packVersion) {
        return await PackVersionManager.create(contextChain, {
            packClass,
            packName,
            packScope,
            packType
        }, packVersion);
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @param {string} packVersionNumber
     * @return {Pack}
     */
    async doPackInstall(contextChain, packType, packClass, packScope, packName, packVersionNumber) {
        const config = await Promises.props({
            cache: this.configController.getConfigProperty(contextChain, 'cache'),
            firebaseUrl: this.configController.getConfigProperty(contextChain, 'firebaseUrl')
        });
        const packVersionEntity = await this.loadPackVersionEntity(contextChain, packType, packClass, packScope, packName, packVersionNumber);
        if (!packVersionEntity) {
            throw new Throwables.exception('PackVersionDoesNotExist', {}, 'Cannot find ' + packScope + ' version "' + packVersionNumber + '" for ' + packClass + '-' + packType + ' "' + packName + '".');
        }
        const packDownloadStore     = this.generateDownloadStore(config.cache);
        const packDownload          = await packDownloadStore.download(packVersionEntity.getPackUrl());
        const execDir               = PathUtil.resolveExecDirFromContextChain(contextChain);
        const packPath              = PathUtil.resolvePackPath(execDir, packType, packClass, packScope, packName, packVersionNumber);
        await packDownload.getPackPackage().extractToPath(packPath);
        const pack = await this.loadPack(contextChain, packType, packClass, packScope, packName, packVersionNumber);
        await this.ensurePackDependenciesInstalled(pack);
        return pack;
    },

    /**
     * @private
     * @param {string} prefix
     */
    async ensureNpmLoaded(prefix) {
        return await this.loadNpm(prefix);
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @return {PackEntity}
     */
    async ensurePackEntityCreated(contextChain, packType, packClass, packScope, packName) {
        let packEntity = await this.loadPackEntity(contextChain, packType, packClass, packScope, packName);
        if (!packEntity) {
            packEntity = await this.createPackEntity({
                name: packName,
                scope: packScope,
                type: packType
            });
        }
        return packEntity;
    },

    /**
     * @private
     * @param {Pack} pack
     * @return {Pack}
     */
    async ensurePackDependenciesInstalled(pack) {
        await this.ensureNpmLoaded(pack.getPackPath());
        const dependenciesToInstall = _.map(pack.getNpmDependencies(), (version, packageName) => {
            return packageName + '@' + version;
        });
        await this.installDependencies(dependenciesToInstall);
        return pack;
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @param {string} packVersionNumber
     * @return {Pack}
     */
    async ensurePackInstalled(contextChain, packType, packClass, packScope, packName, packVersionNumber) {
        let pack = await this.loadPack(contextChain, packType, packClass, packScope, packName, packVersionNumber);
        if (!pack) {
            pack = await this.doPackInstall(contextChain, packType, packClass, packScope, packName, packVersionNumber);
        }
        return pack;
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {PackFile} packFile
     * @return {PackVersionEntity}
     */
    async ensurePackVersionEntityCreated(contextChain, packFile) {
        let entity = await this.loadPackVersionEntity(contextChain, packFile.getType(), packFile.getPackClass(), packFile.getScope(), packFile.getName(), packFile.getVersion());
        if (!entity) {
            entity = await this.createPackVersionEntity(contextChain, packFile.getType(), packFile.getPackClass(), packFile.getScope(), packFile.getName(), packFile.getVersion());
        }
        return entity;
    },

    /**
     * @private
     * @param {string} cacheDir
     * @return {PackDownloadStore}
     */
    generateDownloadStore(cacheDir) {
        let packDownloadStore     = this.cacheDirToPackDownloadStore.get(cacheDir);
        if (!packDownloadStore) {
            packDownloadStore         = new PackDownloadStore(cacheDir);
            this.cacheDirToPackDownloadStore.put(cacheDir, packDownloadStore);
        }
        return packDownloadStore;
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @return {PackStore}
     */
    generatePackStore(contextChain) {
        const execDir   = PathUtil.resolveExecDirFromContextChain(contextChain);
        let packStore   = this.execDirToPackStoreMap.get(execDir);
        if (!packStore) {
            packStore       = new PackStore(execDir, this.packFileStore);
            this.execDirToPackStoreMap.put(execDir, packStore);
        }
        return packStore;
    },

    /**
     * @private
     * @param {Array.<string>} dependencies
     * @return {Promise}
     */
    installDependencies(dependencies) {
        return Promises.promise((resolve, reject) => {
            if (dependencies.length > 0) {
                npm.commands.install(dependencies, (error) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            } else {
                resolve();
            }
        });
    },

    /**
     * @private
     * @return {Promise}
     */
    loadNpm(prefix) {
        let npmLoadingPromise = this.prefixToNpmLoadingPromise.get(prefix);
        if (!npmLoadingPromise) {
            npmLoadingPromise = Promises.promise((resolve, reject) => {
                npm.on('log', (message) => {
                    console.log(message); //eslint-disable-line  no-console
                });
                npm.load({
                    prefix: prefix
                }, (error) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            });
            this.prefixToNpmLoadingPromise.put(prefix, npmLoadingPromise);
        }
        return npmLoadingPromise;
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @return {PackEntity}
     */
    async loadPackEntity(contextChain, packType, packClass, packScope, packName) {
        return await PackManager.get(contextChain, {
            packClass,
            packName,
            packScope,
            packType
        });
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     * @param {string} versionNumber
     * @return {PackVersionEntity}
     */
    async loadPackVersionEntity(contextChain, packType, packClass, packScope, packName, versionNumber) {
        return await PackVersionManager.get(contextChain, {
            packClass,
            packName,
            packScope,
            packType,
            versionNumber
        });
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {PackPackage} packPackage
     * @param {PublishKeyEntity} publishKeyEntity
     * @return {Promise}
     */
    uploadPackPackage(contextChain, packPackage, publishKeyEntity) {
        return Promises.props({
            debug: this.configController.getConfigProperty(contextChain, 'debug'),
            serverUrl: this.configController.getConfigProperty(contextChain, 'serverUrl')
        }).then((config) => {
            return Promises.promise((resolve, reject) => {
                console.log('uploading to ', config.serverUrl + '/api/v1/publish');
                const req = request.post(config.serverUrl + '/api/v1/publish', {
                    auth: {
                        bearer: publishKeyEntity.getKey()
                    }
                });
                req.on('error', (error) => {
                    reject(error);
                }).on('response', (response) => {
                    if (response.statusCode === 200) {
                        return resolve();
                    }
                    return reject(new Throwables.exception('UPLOAD_ERROR', {}, 'Package upload error'));
                });
                packPackage.pipe(req);
            });
        });
    },

    /**
     * @private
     * @param {string} packName
     */
    validatePackName(packName) {
        if (!TypeUtil.isString(packName)) {
            throw Throwables.exception('PackInvalid', {}, 'Pack name must be a string');
        }
        if (!(/^[a-z]+(?:[a-z0-9-][a-z0-9]+)*$/).test(packName)) {
            throw Throwables.exception('PackInvalid', {}, 'Pack name must be lower case letters, numbers or dashes and must start with a letter');
        }
    },

    /**
     * @private
     * @param {string} packVersion
     */
    validatePackVersion(packVersion) {
        SemanticVersionField.validate(packVersion);
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packName
     */
    async verifyCurrentUserAccessToPack(contextChain, packType, packClass, packScope, packName) {
        const packEntity = await this.loadPackEntity(contextChain, packType, packClass, packScope, packName);
        if (packEntity) {
            const currentUser = await this.authController.getCurrentUser(contextChain);
            if (currentUser.isAnonymous()) {
                return null;
            }
            const entity = await PackCollaboratorManager.get(contextChain, {
                packClass,
                packName,
                packScope,
                packType,
                userId: currentUser.getUserId()
            });
            if (!entity) {
                throw Throwables.exception('AccessDenied', {}, 'User does not have access to publish to pack "' + packName + '"');
            }
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackController;
