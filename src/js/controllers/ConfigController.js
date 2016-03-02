//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Config,
    Map,
    Obj,
    Promises,
    StringUtil,
    Throwables,
    TypeUtil
} from 'bugcore';
import path from 'path';
import {
    PackConfig,
    PackConfigChain
} from '../config';
import _ from 'lodash';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const ConfigController = Class.extend(Obj, {

    _name: 'bitpack.ConfigController',


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
         * @type {Config}
         */
        this.configOverride             = new Config();

        /**
         * @private
         * @type {Map.<ExecContext, ConfigChain>}
         */
        this.contextToConfigChainMap    = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Map.<ExecContext, ConfigChain>}
     */
    getContextToConfigChainMap() {
        return this.contextToConfigChainMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ExecContext} context
     * @return {ConfigChain}
     */
    getConfigChain(context) {
        return this.contextToConfigChainMap.get(context);
    },

    /**
     * @param {ContextChain} contextChain
     * @param {string} key
     * @return {*}
     */
    getProperty(contextChain, key) {
        const context = contextChain.getExecContext();
        const configChain = this.getConfigChain(context);
        if (!configChain) {
            throw Throwables.exception('ConfigNotLoaded', {}, 'Must first load the config before getProperty can be called');
        }
        return configChain.getProperty(key);
    },

    /**
     * @param {ContextChain} contextChain
     * @return {Promise<PackConfigChain>}
     */
    async loadConfigChain(contextChain) {
        const context = contextChain.getExecContext();
        let configChain = this.getConfigChain(context);
        if (!configChain) {
            configChain = this.buildConfigChainForContext(context);
            this.contextToConfigChainMap.put(context, configChain);
        }
        return configChain;
    },

    /**
     * @param {ContextChain} contextChain
     * @param {string} key
     * @return {{deleted: boolean, exists: boolean, key: *, value: *}}
     */
    async deleteConfigProperty(contextChain, key) {
        const configChain = await this.loadConfigChain(contextChain);
        const result = {
            deleted: false,
            exists: false,
            key: key,
            value: undefined
        };
        const config = configChain.getTargetConfig();
        result.exists = config.getExists();
        if (config.hasProperty(key)) {
            result.value = config.getProperty(key);
            result.deleted = config.deleteProperty(key);
            if (result.deleted) {
                await config.saveToFile();
            }
        }
        return result;
    },

    /**
     * @param {ContextChain} contextChain
     * @param {string} key
     * @return {*}
     */
    async getConfigProperty(contextChain, key) {
        const configChain = await this.loadConfigChain(contextChain);
        return configChain.getProperty(key);
    },

    /**
     * @param {ContextChain} contextChain
     * @param {string} key
     * @param {*} value
     */
    async setConfigProperty(contextChain, key, value) {
        const configChain   = await this.loadConfigChain(contextChain);
        const config        = configChain.getTargetConfig();
        config.setProperty(key, value);
        await config.saveToFile();
    },

    /**
     * @param {string} key
     * @return {*}
     */
    getConfigOverride(key) {
        return this.configOverride.getProperty(key);
    },

    /**
     * @param {string} key
     * @param {*} value
     */
    setConfigOverride(key, value) {
        return this.configOverride.setProperty(key, value);
    },

    /**
     * @param {Object} propertiesObject
     */
    updateConfigOverrides(propertiesObject) {
        return this.configOverride.updateProperties(propertiesObject);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ExecContext} context
     * @param {string} target
     * @return {boolean}
     */
    belowTarget(context, target) {
        return ConfigController.TARGET_WEIGHT[context.getTarget()] < ConfigController.TARGET_WEIGHT[target];
    },

    /**
     * @private
     * @param {ExecContext} context
     * @return {PackConfigChain}
     */
    async buildConfigChainForContext(context) {
        const execPath      = context.getExecPath();
        const modulePath    = context.getModulePath();
        const userPath      = context.getUserPath();

        const configs = await Promises.props({
            builtIn: PackConfig.loadFromFile(path.resolve(modulePath, 'resources', ConfigController.CONFIG_FILE_NAME), this.getConfigDefaults()),
            global: '',
            project: this.belowTarget(context, 'project') ? null : PackConfig.loadFromFile(path.resolve(execPath, ConfigController.CONFIG_FILE_NAME)),
            user: this.belowTarget(context, 'user') ? null : PackConfig.loadFromFile(path.resolve(userPath, ConfigController.CONFIG_FILE_NAME)),
            override: this.configOverride
        });
        const chain = new PackConfigChain(configs, context.getTarget());
        configs.global = this.belowTarget(context, 'global') ? null : PackConfig.loadFromFile(path.resolve(chain.getProperty('prefix'), ConfigController.CONFIG_FILE_NAME));
        await Promises.props(configs);
        return new PackConfigChain(configs, context.getTarget());
    },

    /**
     * @private
     * @return {Object}
     */
    getConfigDefaults() {
        return _.reduce(ConfigController.BUILT_IN_DEFAULTS, (result, value, key) => {
            return _.assign(result, {
                [key]: TypeUtil.isString(value) ? this.replaceTokens(value, { home: this.getHomeDir() }) : value
            });
        }, {});
    },

    /**
     * @private
     * @return {string}
     */
    getHomeDir() {
        return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    },

    /**
     * @private
     * @param {string} string
     * @param {Object} valueMap
     * @return {string}
     */
    replaceTokens(string, valueMap) {
        const matches = string.match(/\{([a-zA-Z0-9_-]+)\}/g);
        return _.reduce(matches, (result, match) => {
            const key = match.substr(1, match.length - 2);
            const value = !TypeUtil.isUndefined(valueMap[key]) ? valueMap[key] : '';
            return StringUtil.replaceAll(result, match, value);
        }, string);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @type {{debug: boolean, firebaseUrl: string, prefix: string, serverUrl: string}}
 */
ConfigController.BUILT_IN_DEFAULTS  = {
    cache: '{home}/.pack',
    debug: false,
    firebaseUrl: 'https://gulp-pack.firebaseio.com',
    prefix: '/usr/local',
    serverUrl: 'https://gulppack.com'
};

/**
 * @static
 * @const {string}
 */
ConfigController.CONFIG_FILE_NAME   = '.packrc';

/**
 * @static
 * @type {{global: number, user: number, project: number}}
 */
ConfigController.TARGET_WEIGHT = {
    'global': 0,
    'user': 1,
    'project': 2
};


//-------------------------------------------------------------------------------
// Private Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @type {ConfigController}
 */
ConfigController.instance        = null;


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @return {ConfigController}
 */
ConfigController.getInstance = function() {
    if (ConfigController.instance === null) {
        ConfigController.instance = new ConfigController();
    }
    return ConfigController.instance;
};


//-------------------------------------------------------------------------------
// Static Proxy
//-------------------------------------------------------------------------------

Proxy.proxy(ConfigController, Proxy.method(ConfigController.getInstance), [
    'deleteConfigProperty',
    'getConfigProperty',
    'loadConfigChain',
    'setConfigProperty',
    'updateConfigOverrides'
]);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default ConfigController;
