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
  CoflnetSongVoterModelsPlayList,
  CoflnetSongVoterModelsPlayListCreate,
  CoflnetSongVoterModelsSongId,
} from '../models';
import {
    CoflnetSongVoterModelsPlayListFromJSON,
    CoflnetSongVoterModelsPlayListToJSON,
    CoflnetSongVoterModelsPlayListCreateFromJSON,
    CoflnetSongVoterModelsPlayListCreateToJSON,
    CoflnetSongVoterModelsSongIdFromJSON,
    CoflnetSongVoterModelsSongIdToJSON,
} from '../models';

export interface ListsListIdGetRequest {
    listId: string;
}

export interface ListsListIdSongsPostRequest {
    listId: string;
    coflnetSongVoterModelsSongId?: CoflnetSongVoterModelsSongId;
}

export interface ListsListIdSongsSongIdDeleteRequest {
    listId: string;
    songId: string;
}

export interface ListsPostRequest {
    coflnetSongVoterModelsPlayListCreate?: CoflnetSongVoterModelsPlayListCreate;
}

/**
 * 
 */
export class ListApiControllerImplApi extends runtime.BaseAPI {

    /**
     * Get playlist for active user
     */
    async listsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<CoflnetSongVoterModelsPlayList>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/lists`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(CoflnetSongVoterModelsPlayListFromJSON));
    }

    /**
     * Get playlist for active user
     */
    async listsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<CoflnetSongVoterModelsPlayList>> {
        const response = await this.listsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Returns a playList
     * Find playlist by ID
     */
    async listsListIdGetRaw(requestParameters: ListsListIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CoflnetSongVoterModelsPlayList>> {
        if (requestParameters.listId === null || requestParameters.listId === undefined) {
            throw new runtime.RequiredError('listId','Required parameter requestParameters.listId was null or undefined when calling listsListIdGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/lists/{listId}`.replace(`{${"listId"}}`, encodeURIComponent(String(requestParameters.listId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CoflnetSongVoterModelsPlayListFromJSON(jsonValue));
    }

    /**
     * Returns a playList
     * Find playlist by ID
     */
    async listsListIdGet(requestParameters: ListsListIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CoflnetSongVoterModelsPlayList> {
        const response = await this.listsListIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Adds a song to a playlist
     */
    async listsListIdSongsPostRaw(requestParameters: ListsListIdSongsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CoflnetSongVoterModelsPlayList>> {
        if (requestParameters.listId === null || requestParameters.listId === undefined) {
            throw new runtime.RequiredError('listId','Required parameter requestParameters.listId was null or undefined when calling listsListIdSongsPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/lists/{listId}/songs`.replace(`{${"listId"}}`, encodeURIComponent(String(requestParameters.listId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CoflnetSongVoterModelsSongIdToJSON(requestParameters.coflnetSongVoterModelsSongId),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CoflnetSongVoterModelsPlayListFromJSON(jsonValue));
    }

    /**
     * Adds a song to a playlist
     */
    async listsListIdSongsPost(requestParameters: ListsListIdSongsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CoflnetSongVoterModelsPlayList> {
        const response = await this.listsListIdSongsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Removes a song from a playlist
     */
    async listsListIdSongsSongIdDeleteRaw(requestParameters: ListsListIdSongsSongIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CoflnetSongVoterModelsPlayList>> {
        if (requestParameters.listId === null || requestParameters.listId === undefined) {
            throw new runtime.RequiredError('listId','Required parameter requestParameters.listId was null or undefined when calling listsListIdSongsSongIdDelete.');
        }

        if (requestParameters.songId === null || requestParameters.songId === undefined) {
            throw new runtime.RequiredError('songId','Required parameter requestParameters.songId was null or undefined when calling listsListIdSongsSongIdDelete.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/lists/{listId}/songs/{songId}`.replace(`{${"listId"}}`, encodeURIComponent(String(requestParameters.listId))).replace(`{${"songId"}}`, encodeURIComponent(String(requestParameters.songId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CoflnetSongVoterModelsPlayListFromJSON(jsonValue));
    }

    /**
     * Removes a song from a playlist
     */
    async listsListIdSongsSongIdDelete(requestParameters: ListsListIdSongsSongIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CoflnetSongVoterModelsPlayList> {
        const response = await this.listsListIdSongsSongIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Create a new playlist
     */
    async listsPostRaw(requestParameters: ListsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CoflnetSongVoterModelsPlayList>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/lists`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CoflnetSongVoterModelsPlayListCreateToJSON(requestParameters.coflnetSongVoterModelsPlayListCreate),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CoflnetSongVoterModelsPlayListFromJSON(jsonValue));
    }

    /**
     * Create a new playlist
     */
    async listsPost(requestParameters: ListsPostRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CoflnetSongVoterModelsPlayList> {
        const response = await this.listsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
