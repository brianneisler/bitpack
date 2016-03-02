//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Collections,
    Obj
} from 'bugcore';
import {
    ContextChain,
    ExecContext,
    PackTypeContext,
    UserContext
} from '../context';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const ContextController = Class.extend(Obj, {

    _name: 'bitpack.ContextController',


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
         * @type {Map<string, ExecContext>}
         */
        this.contextKeyToExecContextMap         = Collections.map();

        /**
         * @private
         * @type {Map<string, PackTypeContext>}
         */
        this.contextKeyToPackTypeContextMap     = Collections.map();

        /**
         * @private
         * @type {Map<string, UserContext>}
         */
        this.contextKeyToUserContextMap         = Collections.map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Map<string, ExecContext>}
     */
    getContextKeyToExecContextMap() {
        return this.contextKeyToExecContextMap;
    },

    /**
     * @return {Map<string, PackTypeContext>}
     */
    getContextKeyToPackTypeContextMap() {
        return this.contextKeyToPackTypeContextMap;
    },

    /**
     * @return {Map<string, UserContext>}
     */
    getContextKeyToUserContextMap() {
        return this.contextKeyToUserContextMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ContextChain} contextChain
     * @param {{
     *      execPath: string=,
     *      target: string=
     * }=} options
     * @return {ContextChain}
     */
    establishExecContext(contextChain, options) {
        let context = new ExecContext(options);
        const contextKey = context.toContextKey();
        if (!this.contextKeyToExecContextMap.containsKey(contextKey)) {
            this.contextKeyToExecContextMap.put(contextKey, context);
        } else {
            context = this.contextKeyToExecContextMap.get(contextKey);
        }
        contextChain.setExecContext(context);
        return contextChain;
    },

    /**
     * @param {ContextChain} contextChain
     * @param {{
     *      packType: string
     * }=} options
     * @return {ContextChain}
     */
    establishPackTypeContext(contextChain, options) {
        let context = new PackTypeContext(options);
        const contextKey = context.toContextKey();
        if (!this.contextKeyToPackTypeContextMap.containsKey(contextKey)) {
            this.contextKeyToPackTypeContextMap.put(contextKey, context);
        } else {
            context = this.contextKeyToPackTypeContextMap.get(contextKey);
        }
        contextChain.setPackTypeContext(context);
        return contextChain;
    },

    /**
     * @param {ContextChain} contextChain
     * @param {{
     *      userId: string=
     * }=} options
     * @return {ContextChain}
     */
    establishUserContext(contextChain, options) {
        let context = new UserContext(options);
        const contextKey = context.toContextKey();
        if (!this.contextKeyToUserContextMap.containsKey(contextKey)) {
            this.contextKeyToUserContextMap.put(contextKey, context);
        } else {
            context = this.contextKeyToUserContextMap.get(contextKey);
        }
        contextChain.setUserContext(context);
        return contextChain;
    },

    /**
     * @return {ContextChain}
     */
    generateContextChain() {
        return new ContextChain();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default ContextController;
