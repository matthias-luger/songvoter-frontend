/* tslint:disable */
/* eslint-disable */
/**
 * Songvoter
 * Songvoter
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: support@coflnet.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  CoflnetSongVoterModelsSong,
  CoflnetSongVoterModelsSongCreation,
  CoflnetSongVoterModelsSongPlatform,
} from '../models';
import {
    CoflnetSongVoterModelsSongFromJSON,
    CoflnetSongVoterModelsSongToJSON,
    CoflnetSongVoterModelsSongCreationFromJSON,
    CoflnetSongVoterModelsSongCreationToJSON,
    CoflnetSongVoterModelsSongPlatformFromJSON,
    CoflnetSongVoterModelsSongPlatformToJSON,
} from '../models';

export interface ApiSongsPostRequest {
    coflnetSongVoterModelsSongCreation?: CoflnetSongVoterModelsSongCreation;
}

export interface ApiSongsSearchGetRequest {
    term: string;
    platforms?: Array<CoflnetSongVoterModelsSongPlatform>;
}

export interface ApiSongsSongIdGetRequest {
    songId: string;
}

/**
 * 
 */
export class SongApiApi extends runtime.BaseAPI {

    /**
     * Add a new song by url
     */
    async apiSongsPostRaw(requestParameters: ApiSongsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/songs`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CoflnetSongVoterModelsSongCreationToJSON(requestParameters.coflnetSongVoterModelsSongCreation),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Add a new song by url
     */
    async apiSongsPost(requestParameters: ApiSongsPostRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiSongsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Finds Song by search term
     */
    async apiSongsSearchGetRaw(requestParameters: ApiSongsSearchGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<CoflnetSongVoterModelsSong>>> {
        if (requestParameters.term === null || requestParameters.term === undefined) {
            throw new runtime.RequiredError('term','Required parameter requestParameters.term was null or undefined when calling apiSongsSearchGet.');
        }

        const queryParameters: any = {};

        if (requestParameters.term !== undefined) {
            queryParameters['term'] = requestParameters.term;
        }

        if (requestParameters.platforms) {
            queryParameters['platforms'] = requestParameters.platforms;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/songs/search`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(CoflnetSongVoterModelsSongFromJSON));
    }

    /**
     * Finds Song by search term
     */
    async apiSongsSearchGet(requestParameters: ApiSongsSearchGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<CoflnetSongVoterModelsSong>> {
        const response = await this.apiSongsSearchGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a single song
     * Find song by ID
     */
    async apiSongsSongIdGetRaw(requestParameters: ApiSongsSongIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CoflnetSongVoterModelsSong>> {
        if (requestParameters.songId === null || requestParameters.songId === undefined) {
            throw new runtime.RequiredError('songId','Required parameter requestParameters.songId was null or undefined when calling apiSongsSongIdGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/songs/{songId}`.replace(`{${"songId"}}`, encodeURIComponent(String(requestParameters.songId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CoflnetSongVoterModelsSongFromJSON(jsonValue));
    }

    /**
     * Returns a single song
     * Find song by ID
     */
    async apiSongsSongIdGet(requestParameters: ApiSongsSongIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CoflnetSongVoterModelsSong> {
        const response = await this.apiSongsSongIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
