//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Obj,
    ObjectBuilder,
    Throwables,
    TypeUtil
} from 'bugcore';
import path from 'path';
import * as controllers from './controllers';


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

const {
    AuthController,
    ConfigController,
    ContextController,
    PackController,
    QueryController
} = controllers;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const BitPack = Class.extend(Obj, {

    _name: 'bitpack.BitPack',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} packType
     */
    _constructor(packType) {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AuthController}
         */
        this.authController     = new AuthController();

        /**
         * @private
         * @type {ConfigController}
         */
        this.configController   = ConfigController.getInstance();

        /**
         * @private
         * @type {ContextController}
         */
        this.contextController  = new ContextController();

        /**
         * @private
         * @type {PackController}
         */
        this.packController     = new PackController();

        /**
         * @private
         * @type {string}
         */
        this.packType           = packType;

        /**
         * @private
         * @type {QueryController}
         */
        this.queryController    = new QueryController();
    },


    //-------------------------------------------------------------------------------
    // Init Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {BitPack}
     */
    init() {
        const _this = this._super();
        if (_this) {
            _this.authController
                .setContextController(this.contextController);

            _this.queryController
                .setAuthController(this.authController);

            _this.packController
                .setAuthController(this.authController)
                .setQueryController(this.queryController);

        }
        return _this;
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
     * @return {ConfigController}
     */
    getConfigController() {
        return this.configController;
    },

    /**
     * @return {ContextController}
     */
    getContextController() {
        return this.contextController;
    },

    /**
     * @return {PackController}
     */
    getPackController() {
        return this.packController;
    },

    /**
     * @return {string}
     */
    getPackType() {
        return this.packType;
    },

    /**
     * @return {QueryController}
     */
    getQueryController() {
        return this.queryController;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{
     *      auth: {
     *          uid: string,
     *          token: string
     *      },
     *      prefix: string
     * }} configObject
     */
    configure(configObject) {
        if (TypeUtil.isObject(configObject)) {
            return ConfigController.updateConfigOverrides(configObject);
        }
        throw Throwables.illegalArgumentBug('configObject', configObject, 'must be an object');
    },

    /**
     * @param {string} key
     * @param {{
     *      target: string=
     * }=} options
     * @return {{deleted: boolean, exists: boolean, key: *, value: *}}
     */
    async configDelete(key, options) {
        options = this.defineOptions(options, {
            target: 'project'
        });
        const contextChain = await this.context(options);
        return await ConfigController.deleteConfigProperty(contextChain, key);
    },

    /**
     * @param {string} key
     * @param {{
     *      target: string=
     * }=} options
     * @return {*}
     */
    async configGet(key, options) {
        options = this.defineOptions(options, {
            target: 'project'
        });
        const contextChain = await this.context(options);
        return await ConfigController.getConfigProperty(contextChain, key);
    },

    /**
     * @param {string} key
     * @param {*} value
     * @param {{
     *      target: string=
     * }=} options
     */
    async configSet(key, value, options) {
        options = this.defineOptions(options, {
            target: 'project'
        });
        const contextChain = await this.context(options);
        return await ConfigController.setConfigProperty(contextChain, key, value);
    },

    /**
     * @param {{
     *      execPath: string=,
     *      target: string=
     * }=} options
     * @return {ContextChain}
     */
    async context(options) {
        const contextChain = this.contextController.generateContextChain();
        this.contextController.establishPackTypeContext(contextChain, {
            packType: this.packType
        });
        this.contextController.establishExecContext(contextChain, options);
        await ConfigController.loadConfigChain(contextChain);
        await this.authController.auth(contextChain);
        return contextChain;
    },

    /**
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packQuery
     * @param {{
     *      target: string=
     * }=} options
     * @return {Pack}
     */
    async get(packType, packClass, packScope, packQuery, options) {
        options = this.defineOptions(options, {
            target: 'project'
        });
        const contextChain = await this.context(options);
        return await this.packController.getPack(contextChain, packType, packClass, packScope, packQuery);
    },

    /**
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packQuery
     * @param {{
     *      target: string=
     * }=} options
     * @return {Pack}
     */
    async install(packType, packClass, packScope, packQuery, options) {
        options = this.defineOptions(options, {
            target: 'project'
        });
        const contextChain = await this.context(options);
        return await this.packController.installPack(contextChain, packType, packClass, packScope,  packQuery);
    },

    /**
     * @param {string} email
     * @param {string} password
     * @param {{
     *      target: string=
     * }=} options
     * @return {CurrentUser}
     */
    async login(email, password, options) {
        options = this.defineOptions(options, {
            target: 'user'
        });
        const contextChain = await this.context(options);
        return await this.authController.login(contextChain, email, password);
    },

    /**
     * @param {{
     *      target: string=
     * }=} options
     * @return {CurrentUser}
     */
    async logout(options) {
        options = this.defineOptions(options, {
            target: 'user'
        });
        const contextChain = await this.context(options);
        return await this.authController.logout(contextChain);
    },

    /**
     * @param {string} packType
     * @param {string} packClass
     * @param {string} packScope
     * @param {string} packPath
     * @param {{
     *      target: string=
     * }=} options
     * @return {PublishKeyEntity}
     */
    async publish(packType, packClass, packScope, packPath, options) {
        options = this.defineOptions(options, {
            target: 'project'
        });
        if (!packPath) {
            packPath = options.execPath;
        }
        packPath = path.resolve(packPath);
        const contextChain = await this.context(options);
        return await this.packController.publishPack(contextChain, packType, packClass, packScope, packPath);
    },

    /**
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @param {{
     *      target: string=
     * }=} options
     * @return {CurrentUser}
     */
    async signUp(username, email, password, options) {
        options = this.defineOptions(options, {
            target: 'user'
        });
        const contextChain = await this.context(options);
        return await this.authController.signUp(contextChain, username, email, password);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {{
     *      execPath: string=,
     *      target: string=
     * }=} options
     * @param {{
     *      execPath: string=,
     *      target: string=
     * }=} suppliedDefaults
     * @return {{
     *      execPath: string,
     *      target: string
     * }}
     */
    defineOptions(options, suppliedDefaults) {
        options             = options || {};
        suppliedDefaults    = suppliedDefaults || {};
        const defaults      = {
            execPath: process.cwd()
        };
        return ObjectBuilder
            .assign(defaults, suppliedDefaults, options)
            .build();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default BitPack;
