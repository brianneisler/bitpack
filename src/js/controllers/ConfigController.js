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
import {
    TokenUtil
} from '../util';
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
     * @param {ContextChain} contextChain
     * @return {ConfigChain}
     */
    getConfigChain(contextChain) {
        const contextKey = this.makeContextKey(contextChain);
        return this.contextToConfigChainMap.get(contextKey);
    },

    /**
     * @param {ContextChain} contextChain
     * @param {ConfigChain} configChain
     */
    setConfigChain(contextChain, configChain) {
        const contextKey = this.makeContextKey(contextChain);
        this.contextToConfigChainMap.put(contextKey, configChain);
    },

    /**
     * @param {ContextChain} contextChain
     * @param {string} key
     * @return {*}
     */
    getProperty(contextChain, key) {
        const configChain = this.getConfigChain(contextChain);
        if (!configChain) {
            throw Throwables.exception('ConfigNotLoaded', {}, 'Must first load the config chain before getProperty can be called');
        }
        return configChain.getProperty(key);
    },

    /**
     * @param {ContextChain} contextChain
     * @return {Promise<PackConfigChain>}
     */
    async loadConfigChain(contextChain) {
        let configChain = this.getConfigChain(contextChain);
        if (!configChain) {
            configChain = await this.buildConfigChainForContextChain(contextChain);
            this.setConfigChain(contextChain, configChain);
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
     * @param {ContextChain} contextChain
     * @return {PackConfigChain}
     */
    async buildConfigChainForContextChain(contextChain) {
        const context           = contextChain.getExecContext();
        const execPath          = context.getExecPath();
        const userPath          = context.getUserPath();
        const configFileName    = this.getConfigFileName(contextChain);

        const configs = await Promises.props({
            builtIn: new Config(this.getConfigDefaults(contextChain)),
            global: '',
            project: this.belowTarget(context, 'project') ? null : PackConfig.loadFromFile(path.resolve(execPath, configFileName)),
            user: this.belowTarget(context, 'user') ? null : PackConfig.loadFromFile(path.resolve(userPath, configFileName)),
            override: this.configOverride
        });
        const chain = new PackConfigChain(configs, context.getTarget());
        configs.global = this.belowTarget(context, 'global') ? null : PackConfig.loadFromFile(path.resolve(chain.getProperty('prefix'), configFileName));
        await Promises.props(configs);
        return new PackConfigChain(configs, context.getTarget());
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @return {Object}
     */
    getConfigDefaults(contextChain) {
        return TokenUtil.replace(ConfigController.BUILT_IN_DEFAULTS, {
            home: this.getHomeDir(contextChain),
            type: this.getPackType(contextChain)
        });
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @return {string}
     */
    getConfigFileName(contextChain) {
        const packType = this.getPackType(contextChain);
        return `.${packType}rc`;
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @return {string}
     */
    getHomeDir(contextChain) {
        return contextChain.getExecContext().getUserPath();
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @return {string}
     */
    getPackType(contextChain) {
        return contextChain.getPackTypeContext().getPackType();
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @returns {string}
     */
    makeContextKey(contextChain) {
        return contextChain.getPackTypeContext().toContextKey() + ':' + contextChain.getExecContext().toContextKey();
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
    cache: '{home}/.bitpack',
    debug: false,
    firebaseUrl: 'https://bitpack.firebaseio.com',
    prefix: '/usr/local',
    serverUrl: 'https://gulprecipe.com'
};

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
// Exports
//-------------------------------------------------------------------------------

export default ConfigController;
