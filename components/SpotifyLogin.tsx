import * as React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { ResponseType, makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { usePathname } from 'expo-router'
import { useEffect, useState } from 'react'
import { SPOTIFY_TOKEN, storage } from '../utils/StorageUtils'
import { Button, Text, useTheme } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { showErrorToast } from '../utils/ToastUtils'
import { getAuthController } from '../utils/ApiUtils'

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
    let pathname = usePathname()
    let theme = useTheme()
    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Code,
            clientId: 'f9d80531a87143cea4775783dd4004b5',
            scopes: ['user-read-email', 'playlist-modify-public', 'user-modify-playback-state', 'user-read-playback-state'],
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
            console.log(JSON.stringify(response))
            serversideAuthentication(response.params.code)
        }
    }, [response])

    async function serversideAuthentication(spotifyCode: string) {
        try {
            let authController = await getAuthController()
            let { token } = await authController.authSpotifyCodePost({
                coflnetSongVoterControllersAuthApiControllerImplAuthCode: {
                    code: spotifyCode,
                    redirectUri:
                        makeRedirectUri({
                            path: pathname.replace('/', '')
                        }) + '/'
                }
            })
            console.log("Spotify Token: " + token)
            storage.set(SPOTIFY_TOKEN, token)
            setSpotifyToken(token)
            props.onAfterLogin(token)
            Toast.show({
                type: 'success',
                text1: 'Successfully connected Spotify!'
            })
        } catch (e) {
            showErrorToast(e)
        }
    }

    return !spotifyToken ? (
        <Button
            style={globalStyles.primaryElement}
            textColor={theme.colors.onPrimary}
            disabled={!request}
            onPress={() => {
                promptAsync()
            }}
        >
            Spotify Login
        </Button>
    ) : (
        <Button
            style={globalStyles.primaryElement}
            textColor={theme.colors.onPrimary}
            disabled={!request}
            onPress={() => {
                setSpotifyToken(null)
                storage.delete(SPOTIFY_TOKEN)
            }}
        >
            Logout
        </Button>
    )
}
