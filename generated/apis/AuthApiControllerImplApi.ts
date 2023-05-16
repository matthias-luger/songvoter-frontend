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
  CoflnetSongVoterModelsAuthToken,
} from '../models';
import {
    CoflnetSongVoterModelsAuthTokenFromJSON,
    CoflnetSongVoterModelsAuthTokenToJSON,
} from '../models';

export interface AuthGooglePostRequest {
    coflnetSongVoterModelsAuthToken?: CoflnetSongVoterModelsAuthToken;
}

export interface AuthTestPostRequest {
    coflnetSongVoterModelsAuthToken?: CoflnetSongVoterModelsAuthToken;
}

export interface DbDeleteRequest {
    coflnetSongVoterModelsAuthToken?: CoflnetSongVoterModelsAuthToken;
}

export interface DbPostRequest {
    coflnetSongVoterModelsAuthToken?: CoflnetSongVoterModelsAuthToken;
}

/**
 * 
 */
export class AuthApiControllerImplApi extends runtime.BaseAPI {

    /**
     * Exchange a google identity token for a songvoter token
     * Authenticate with google
     */
    async authGooglePostRaw(requestParameters: AuthGooglePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CoflnetSongVoterModelsAuthToken>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/google`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CoflnetSongVoterModelsAuthTokenToJSON(requestParameters.coflnetSongVoterModelsAuthToken),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CoflnetSongVoterModelsAuthTokenFromJSON(jsonValue));
    }

    /**
     * Exchange a google identity token for a songvoter token
     * Authenticate with google
     */
    async authGooglePost(requestParameters: AuthGooglePostRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CoflnetSongVoterModelsAuthToken> {
        const response = await this.authGooglePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async authTestPostRaw(requestParameters: AuthTestPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/test`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CoflnetSongVoterModelsAuthTokenToJSON(requestParameters.coflnetSongVoterModelsAuthToken),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async authTestPost(requestParameters: AuthTestPostRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.authTestPostRaw(requestParameters, initOverrides);
    }

    /**
     */
    async dbDeleteRaw(requestParameters: DbDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/db`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: CoflnetSongVoterModelsAuthTokenToJSON(requestParameters.coflnetSongVoterModelsAuthToken),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async dbDelete(requestParameters: DbDeleteRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.dbDeleteRaw(requestParameters, initOverrides);
    }

    /**
     */
    async dbPostRaw(requestParameters: DbPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/db`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CoflnetSongVoterModelsAuthTokenToJSON(requestParameters.coflnetSongVoterModelsAuthToken),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async dbPost(requestParameters: DbPostRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.dbPostRaw(requestParameters, initOverrides);
    }

}
