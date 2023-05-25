import { TokenResponse, TokenResponseConfig } from 'expo-auth-session'
import { AuthApiControllerImplApi, Configuration, SongApiControllerImplApi } from '../generated'
import { PartyApiControllerImplApi } from '../generated/apis/PartyApiControllerImplApi'
import { GOOGLE_AUTH_OBJECT, storage } from './StorageUtils'
import { clientId } from '../components/GoogleLogin'

async function getConfiguration(): Promise<Configuration> {
    let config = new Configuration({
        basePath: 'https://songvoter.party',
        headers: {
            'Content-Type': 'application/json'
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
                    clientId: clientId
                },
                {
                    tokenEndpoint: 'https://oauth2.googleapis.com/token'
                }
            )
            let authController = await getAuthController()
            let accessTokenResponse = await authController.authGooglePost({
                coflnetSongVoterModelsAuthRefreshToken: {
                    token: tokenResponse.idToken,
                    accessToken: tokenResponse.accessToken,
                    refreshToken: tokenResponse.refreshToken
                }
            })
            tokenResponse.accessToken = accessTokenResponse.token
            storage.set(GOOGLE_AUTH_OBJECT, JSON.stringify(tokenResponse.getRequestConfig()))
            googleAuthObject = tokenResponse.getRequestConfig()
        }

        config.headers.Authorization = `Bearer ${googleAuthObject.accessToken}`
    }
    return config
}

export let getAuthController = async () => new AuthApiControllerImplApi(await getConfiguration())
export let getPartyController = async () => new PartyApiControllerImplApi(await getConfiguration())
export let SongController = async () => new SongApiControllerImplApi(await getConfiguration())
