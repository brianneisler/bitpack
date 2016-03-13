//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class,
    Map,
    Obj,
    Promises,
    Throwables
} from 'bugcore';
import {
    AuthData,
    CurrentUser,
    UserData
} from '../data';
import {
    EmailField,
    UsernameField
} from '../fields';
import {
    UserManager
} from '../managers';
import {
    Firebase,
    FirebaseTokenGenerator
} from '../util';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
const AuthController = Class.extend(Obj, {

    _name: 'bitpack.AuthController',


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
         * @type {ConfigController}
         */
        this.configController                           = null;

        /**
         * @private
         * @type {ContextController}
         */
        this.contextController                          = null;

        /**
         * @private
         * @type {Map<ExecContext, CurrentUser>}
         */
        this.execContextToCurrentUserMap                = new Map();

        /**
         * @private
         * @type {Map<FirebaseContext, FirebaseTokenGenerator>}
         */
        this.firebaseContextToFirebaseTokenGeneratorMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {ConfigController}
     */
    getConfigController() {
        return this.configController;
    },

    /**
     * @param {ConfigController} configController
     * @return {AuthController}
     */
    setConfigController(configController) {
        this.configController = configController;
        return this;
    },

    /**
     * @return {ContextController}
     */
    getContextController() {
        return this.contextController;
    },

    /**
     * @param {ContextController} contextController
     * @return {AuthController}
     */
    setContextController(contextController) {
        this.contextController = contextController;
        return this;
    },

    /**
     * @return {Map<ExecContext, CurrentUser>}
     */
    getExecContextToCurrentUserMap() {
        return this.execContextToCurrentUserMap;
    },

    /**
     * @return {Map<FirebaseContext, FirebaseTokenGenerator>}
     */
    getFirebaseContextToFirebaseTokenGeneratorMap() {
        return this.firebaseContextToFirebaseTokenGeneratorMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ContextChain} contextChain
     * @return {CurrentUser}
     */
    async auth(contextChain) {
        //TODO BRN: Add AuthMonitor to handle cases where user becomes unauthenticated
        let currentUser = this.getCurrentUser(contextChain);
        if (!currentUser) {
            //NOTE BRN: Must establish anonymous user first so that we can load the current user from db
            currentUser = this.establishAnonymousCurrentUser(contextChain);
            const loadedCurrentUser = await this.tryLoadCurrentUser(contextChain);
            if (loadedCurrentUser) {
                currentUser = loadedCurrentUser;
            }
        }
        return this.establishCurrentUser(contextChain, currentUser);
    },

    /**
     * @param {ContextChain} contextChain
     * @return {CurrentUser}
     */
    getCurrentUser(contextChain) {
        return this.execContextToCurrentUserMap.get(contextChain.getExecContext());
    },

    /**
     * @param {ContextChain} contextChain
     * @param {string} email
     * @param {string} password
     * @return {CurrentUser}
     */
    async login(contextChain, email, password) {
        const authData              = await this.authWithPassword(contextChain, email, password);
        const currentUser           = await this.buildCurrentUserWithAuthData(contextChain, authData);
        await this.saveAuthData(contextChain, currentUser.getAuthData());
        const loadedCurrentUser     = this.loadCurrentUser(contextChain);
        return this.establishCurrentUser(contextChain, loadedCurrentUser);
    },

    /**
     * @param {ContextChain} contextChain
     * @return {CurrentUser}
     */
    async logout(contextChain) {
        //NOTE BRN: Auth first so that we can establish connection with firebase and radio in the unauth
        await this.auth(contextChain);
        this.unauth(contextChain);
        await this.deleteCurrentUser(contextChain);
        return await this.auth(contextChain);
    },

    /**
     * @param {ContextChain} contextChain
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @return {CurrentUser}
     */
    async signUp(contextChain, username, email, password) {
        // TODO BRN: Validate username, password
        email       = email.toLowerCase();
        username    = username.toLowerCase();
        await EmailField.validateEmail(contextChain, {
            id: null
        }, email);
        const firebaseUser = await Firebase.createUser(contextChain, {
            email: email,
            password: password
        });
        const authData = await this.authWithPassword(contextChain, email, password);
        const userData = {
            email: '',
            id: firebaseUser.uid,
            signedUp: false,
            username: ''
        };
        const userEntity = await UserManager.set(contextChain, { userId: firebaseUser.uid },  userData);
        await this.completeSignupWithUsernameAndEmail(contextChain, userEntity, username, email);
        const currentUser = await this.buildCurrentUserWithAuthDataAndUserEntity(authData, userEntity);
        await this.saveAuthData(contextChain, currentUser.getAuthData());
        const loadedCurrentUser = await this.loadCurrentUser(contextChain);
        return this.establishCurrentUser(contextChain, loadedCurrentUser);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {string} email
     * @param {string} password
     * @return {AuthData}
     */
    async authWithPassword(contextChain, email, password) {
        const data = await Firebase.authWithPassword(contextChain, {
            email: email,
            password: password
        });
        return new AuthData(data);
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {{
     *      expires: number,
     *      uid: string
     * }} data
     */
    async authDebugWithAuthData(contextChain, data) {
        const firebaseTokenGenerator = await this.generateFirebaseTokenGenerator(contextChain);
        const debugToken = firebaseTokenGenerator.generateDebugTokenWithAuthData(data);
        return await Firebase.authWithCustomToken(contextChain, debugToken);
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {string} token
     * @return {AuthData}
     */
    async authWithToken(contextChain, token) {
        const data = await Firebase.authWithCustomToken(contextChain, token);
        if (this.configController.getProperty(contextChain, 'debug')) {
            await this.authDebugWithAuthData(contextChain, data);
        }
        return new AuthData(data);
    },

    /**
     * @private
     * @return {CurrentUser}
     */
    buildAnonymousCurrentUser() {
        const userData = new UserData({
            anonymous: true,
            id: 'anonymous'
        });
        const authData = new AuthData({});
        return new CurrentUser(userData, authData);
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {AuthData} authData
     * @return {CurrentUser}
     */
    async buildCurrentUserWithAuthData(contextChain, authData) {
        const userEntity = await UserManager.get(contextChain, { userId: authData.getUid() });
        if (!userEntity) {
            throw Throwables.exception('UserDoesNotExist', {}, 'User with uid "' + authData.getUid() + '" does not exist');
        }
        return this.buildCurrentUserWithAuthDataAndUserEntity(authData, userEntity);
    },

    /**
     * @private
     * @param {AuthData} authData
     * @param {UserEntity} userEntity
     * @return {CurrentUser}
     */
    buildCurrentUserWithAuthDataAndUserEntity(authData, userEntity) {
        //NOTE: Change to static UserData to prevent data from being lost if we need to reauth during a context switch.
        const userData = new UserData(userEntity.getRawData());
        return new CurrentUser(userData, authData);
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {UserEntity} userEntity
     * @param {string} username
     * @param {string} email
     */
    async completeSignupWithUsernameAndEmail(contextChain, userEntity, username, email) {
        await Promises.all([
            EmailField.changeUsersEmail(contextChain, userEntity, email),
            UsernameField.changeUsersUsername(contextChain, userEntity, username)
        ]);
        return await UserManager.update(contextChain, { userId: userEntity.getId() }, {
            signedUp: true
        });
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @returns {{deleted: boolean, exists: boolean, key: *, value: *}}
     */
    async deleteAuthData(contextChain) {
        return await this.configController.deleteConfigProperty(contextChain, 'auth');
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     */
    async deleteCurrentUser(contextChain) {
        await this.deleteAuthData(contextChain);
        this.execContextToCurrentUserMap.remove(contextChain.getExecContext());
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @return {CurrentUser}
     */
    establishAnonymousCurrentUser(contextChain) {
        const currentUser = this.buildAnonymousCurrentUser();
        return this.establishCurrentUser(contextChain, currentUser);
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {CurrentUser} currentUser
     * @return {CurrentUser}
     */
    establishCurrentUser(contextChain, currentUser) {
        this.establishUserContext(contextChain, currentUser);
        return this.setCurrentUser(contextChain, currentUser);
    },

    /**
     * @param {ContextChain} contextChain
     * @param {CurrentUser} currentUser
     * @return {UserContext}
     */
    establishUserContext(contextChain, currentUser) {
        return this.contextController.establishUserContext(contextChain, { userId: currentUser.getUserId() });
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @return {FirebaseTokenGenerator}
     */
    async generateFirebaseTokenGenerator(contextChain) {
        const firebaseContext = contextChain.getFirebaseContext();
        let firebaseTokenGenerator      = this.firebaseContextToFirebaseTokenGeneratorMap.get(firebaseContext);
        if (!firebaseTokenGenerator) {
            const firebaseSecret            = await this.configController.getConfigProperty(contextChain, 'firebaseSecret');
            firebaseTokenGenerator          = new FirebaseTokenGenerator(firebaseSecret);
            this.firebaseContextToFirebaseTokenGeneratorMap.put(firebaseContext, firebaseTokenGenerator);
        }
        return firebaseTokenGenerator;
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @return {AuthData}
     */
    async loadAuthData(contextChain) {
        const data = await this.configController.getConfigProperty(contextChain, 'auth');
        if (!data) {
            throw Throwables.exception('NoAuthFound');
        }
        return new AuthData(data);
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @return {CurrentUser}
     */
    async loadCurrentUser(contextChain) {
        const authData = await this.loadAuthData(contextChain);
        return this.buildCurrentUserWithAuthData(contextChain, authData);
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {AuthData} authData
     */
    async saveAuthData(contextChain, authData) {
        await this.configController.setConfigProperty(contextChain, 'auth', authData.toObject());
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @param {CurrentUser} currentUser
     * @return {CurrentUser}
     */
    setCurrentUser(contextChain, currentUser) {
        this.execContextToCurrentUserMap.put(contextChain.getExecContext(), currentUser);
        return currentUser;
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     * @return {CurrentUser}
     */
    async tryLoadCurrentUser(contextChain) {
        try {
            const loadedCurrentUser     = await this.loadCurrentUser(contextChain);
            const authData              = await this.authWithToken(contextChain, loadedCurrentUser.getAuthToken());
            return this.buildCurrentUserWithAuthData(contextChain, authData);
        } catch(throwable) {
            if (throwable.type === 'NoAuthFound') {
                return null;
            } else if (throwable.type === 'UserDoesNotExist') {
                await this.deleteAuthData(contextChain);
                return null;
            }
            throw throwable;
        }
    },

    /**
     * @private
     * @param {ContextChain} contextChain
     */
    unauth(contextChain) {
        Firebase.unauth(contextChain);
        // TODO BRN: Move to custom auth strategy. Store auth tokens in firebase. When user logs out, mark token as
        // invalid to prevent reuse of auth token.
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default AuthController;
