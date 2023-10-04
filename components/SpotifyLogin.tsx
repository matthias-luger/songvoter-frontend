import * as React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { ResponseType, makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { usePathname } from 'expo-router'
import { useEffect, useState } from 'react'
import { SPOTIFY_TOKEN, storage } from '../utils/StorageUtils'
import { ActivityIndicator, Button, useTheme } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { showErrorToast } from '../utils/ToastUtils'
import { getAuthController, getUserController } from '../utils/ApiUtils'

WebBrowser.maybeCompleteAuthSession()

// Endpoint
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token'
}

interface Props {
    onAfterLogin?(accessToken: string)
}

export default function SpotifyLogin(props: Props) {
    let [spotifyToken, setSpotifyToken] = useState<string>(storage.getString(SPOTIFY_TOKEN))
    let [isLoggingIn, setIsLoggingIn] = useState(false)
    let pathname = usePathname()
    let theme = useTheme()
    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Code,
            clientId: 'f9d80531a87143cea4775783dd4004b5',
            scopes: [
                'user-read-email',
                'playlist-modify-public',
                'user-modify-playback-state',
                'user-read-playback-state',
                'playlist-read-private',
                'playlist-read-collaborative'
            ],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            redirectUri:
                makeRedirectUri({
                    path: pathname.replace('/', '')
                }) + '/'
        },
        discovery
    )

    useEffect(() => {
        if (response?.type === 'success') {
            serversideAuthentication(response.params.code)
        } else if (response?.type === 'error') {
            setIsLoggingIn(false)
            showErrorToast(response.error)
        }
    }, [response])

    async function serversideAuthentication(spotifyCode: string) {
        try {
            let authController = await getAuthController()
            let { token } = (
                await authController.apiAuthSpotifyCodePost({
                    code: spotifyCode,
                    redirectUri:
                        makeRedirectUri({
                            path: pathname.replace('/', '')
                        }) + '/'
                })
            ).data
            storage.set(SPOTIFY_TOKEN, token)
            setSpotifyToken(token)
            if (props.onAfterLogin) {
                props.onAfterLogin(token)
            }
            Toast.show({
                type: 'success',
                text1: 'Successfully connected Spotify!'
            })
            setIsLoggingIn(false)
        } catch (e) {
            setIsLoggingIn(false)
            showErrorToast(e)
        }
    }

    return !spotifyToken ? (
        <Button
            mode="contained"
            disabled={!request || isLoggingIn}
            loading={isLoggingIn}
            onPress={() => {
                setIsLoggingIn(true)
                promptAsync()
            }}
        >
            Connect Spotify
        </Button>
    ) : (
        <Button
            mode="contained"
            disabled={!request}
            onPress={async () => {
                setSpotifyToken(null)
                storage.delete(SPOTIFY_TOKEN)
                let userController = await getUserController()
                userController.apiUserSpotifyDelete()
            }}
        >
            Logout
        </Button>
    )
}
