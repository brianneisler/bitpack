//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    ConfigChain
} from 'bugcore';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {ConfigChain}
 */
const PackConfigChain = Class.extend(ConfigChain, {

    _name: 'bitpack.PackConfigChain',


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {{
     *  builtIn: PackConfig,
     *  global: PackConfig,
     *  override: Config,
     *  project: PackConfig,
     *  user: PackConfig
     * }} configs
     * @param {string} target
     */
    _constructor(configs, target) {
        const configArray = [];
        if (configs.override) {
            configArray.push(configs.override);
        }
        if (configs.project) {
            configArray.push(configs.project);
        }
        if (configs.user) {
            configArray.push(configs.user);
        }
        if (configs.global) {
            configArray.push(configs.global);
        }
        if (configs.builtIn) {
            configArray.push(configs.builtIn);
        }

        this._super(configArray);

        /**
         * @private
         * @type {PackConfig}
         */
        this.builtInConfig      = configs.builtIn;

        /**
         * @private
         * @type {PackConfig}
         */
        this.globalConfig       = configs.global;

        /**
         * @private
         * @type {Config}
         */
        this.overrideConfig     = configs.override;

        /**
         * @private
         * @type {PackConfig}
         */
        this.projectConfig      = configs.project;

        /**
         * @private
         * @type {PackConfig}
         */
        this.targetConfig       = configs[target];

        /**
         * @private
         * @type {PackConfig}
         */
        this.userConfig         = configs.user;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {PackConfig}
     */
    getBuiltInConfig() {
        return this.builtInConfig;
    },

    /**
     * @return {PackConfig}
     */
    getGlobalConfig() {
        return this.globalConfig;
    },

    /**
     * @return {Config}
     */
    getOverrideConfig() {
        return this.overrideConfig;
    },

    /**
     * @return {PackConfig}
     */
    getProjectConfig() {
        return this.projectConfig;
    },

    /**
     * @return {PackConfig}
     */
    getTargetConfig() {
        return this.targetConfig;
    },

    /**
     * @return {PackConfig}
     */
    getUserConfig() {
        return this.userConfig;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackConfigChain;
