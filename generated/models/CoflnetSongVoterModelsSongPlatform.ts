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


/**
 * The platform of this song
 * @export
 */
export const CoflnetSongVoterModelsSongPlatform = {
    Youtube: 'youtube',
    Spotify: 'spotify'
} as const;
export type CoflnetSongVoterModelsSongPlatform = typeof CoflnetSongVoterModelsSongPlatform[keyof typeof CoflnetSongVoterModelsSongPlatform];


export function CoflnetSongVoterModelsSongPlatformFromJSON(json: any): CoflnetSongVoterModelsSongPlatform {
    return CoflnetSongVoterModelsSongPlatformFromJSONTyped(json, false);
}

export function CoflnetSongVoterModelsSongPlatformFromJSONTyped(json: any, ignoreDiscriminator: boolean): CoflnetSongVoterModelsSongPlatform {
    return json as CoflnetSongVoterModelsSongPlatform;
}

export function CoflnetSongVoterModelsSongPlatformToJSON(value?: CoflnetSongVoterModelsSongPlatform | null): any {
    return value as any;
}

