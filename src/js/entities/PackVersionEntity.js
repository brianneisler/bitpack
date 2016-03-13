//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Class
} from 'bugcore';
import Entity from './Entity';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Entity}
 */
const PackVersionEntity = Class.extend(Entity, {

    _name: 'bitpack.PackVersionEntity',


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getCreatedAt() {
        return this.getData('createdAt');
    },

    /**
     * @return {boolean}
     */
    getPublished() {
        return this.getData('published');
    },

    /**
     * @return {string}
     */
    getPackUrl() {
        return this.getData('packUrl');
    },

    /**
     * @return {{
     *      build: Array<string>,
     *      major: number,
     *      minor: number,
     *      patch: number,
     *      prerelease: Array<string>,
     *      raw: string,
     *      version: string
     * }}
     */
    getSemanticVersion() {
        return this.getData('semanticVersion');
    },

    /**
     * @return {number}
     */
    getUpdatedAt() {
        return this.getData('updatedAt');
    },

    /**
     * @return {string}
     */
    getVersionNumber() {
        return this.getData('versionNumber');
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackVersionEntity;
