import { TokenResponse, TokenResponseConfig } from 'expo-auth-session'
import { AuthApiControllerImplApi, CoflnetSongVoterModelsUserInfo, Configuration, ListApiControllerImplApi, PartyApi, SongApiApi, UserApi } from '../generated'
import { GOOGLE_AUTH_OBJECT, USER_INFO, storage } from './StorageUtils'

export const googleClientId = '366589988548-reag2f35a49fa2cavc4lnl5k1p8n1brd.apps.googleusercontent.com'

export async function getUserInfo(): Promise<CoflnetSongVoterModelsUserInfo> {
    let info = storage.getString(USER_INFO)
    if (info) {
        let parsed = JSON.parse(info) as CoflnetSongVoterModelsUserInfo

        let expiredDate
        if (parsed.spotifyTokenExpiration) {
            expiredDate = new Date(parsed.spotifyTokenExpiration)
        }
        if (expiredDate && expiredDate.getTime() - new Date().getTime() > 10000) {
            return parsed
        }
    }

    let userController = await getUserController()
    let result = (await userController.apiUserInfoGet()).data
    storage.set(USER_INFO, JSON.stringify(result))
    return result
}

async function getConfiguration(): Promise<Configuration> {
    let config = new Configuration({
        basePath: 'https://songvoter.party',
        baseOptions: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    })
    if (storage.contains(GOOGLE_AUTH_OBJECT)) {
        let googleAuthObject: TokenResponseConfig = JSON.parse(storage.getString(GOOGLE_AUTH_OBJECT))
        let tokenResponse = new TokenResponse(googleAuthObject)

        if (tokenResponse.shouldRefresh()) {
            console.log('refreshing token...')
            storage.delete(GOOGLE_AUTH_OBJECT)
            tokenResponse = await tokenResponse.refreshAsync(
                {
                    clientId: googleClientId
                },
                {
                    tokenEndpoint: 'https://oauth2.googleapis.com/token'
                }
            )
            let authController = await getAuthController()
            let accessTokenResponse = await authController.apiAuthGooglePost({
                token: tokenResponse.idToken,
                accessToken: tokenResponse.accessToken,
                refreshToken: tokenResponse.refreshToken
            })
            tokenResponse.accessToken = accessTokenResponse.data.token
            storage.set(GOOGLE_AUTH_OBJECT, JSON.stringify(tokenResponse.getRequestConfig()))
            googleAuthObject = tokenResponse.getRequestConfig()
        }

        config.baseOptions.headers.Authorization = `Bearer ${googleAuthObject.accessToken}`
    }
    return config
}

export let getAuthController = async () => new AuthApiControllerImplApi(await getConfiguration())
export let getPartyController = async () => new PartyApi(await getConfiguration())
export let getSongController = async () => new SongApiApi(await getConfiguration())
export let getListController = async () => new ListApiControllerImplApi(await getConfiguration())
export let getUserController = async () => new UserApi(await getConfiguration())
