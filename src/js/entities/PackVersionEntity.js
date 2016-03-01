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
        return this.getRawData().createdAt;
    },

    /**
     * @return {boolean}
     */
    getPublished() {
        return this.getRawData().published;
    },

    /**
     * @return {string}
     */
    getPackUrl() {
        return this.getRawData().packUrl;
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
        return this.getRawData().semanticVersion;
    },

    /**
     * @return {number}
     */
    getUpdatedAt() {
        return this.getRawData().updatedAt;
    },

    /**
     * @return {string}
     */
    getVersionNumber() {
        return this.getRawData().versionNumber;
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

export default PackVersionEntity;
