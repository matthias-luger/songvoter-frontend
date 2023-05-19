import * as React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { ResponseType, makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { usePathname } from 'expo-router'
import { useEffect, useState } from 'react'
import { SPOTIFY_AUTH_OBJECT, SPOTIFY_TOKEN, storage } from '../utils/StorageUtils'
import { SpotifyAuthentication } from '../types/global'
import { Button, Text, useTheme } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'

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
            responseType: ResponseType.Token,
            clientId: 'e085a97fb6f94dbe9ac11b70f05d00cf',
            scopes: ['user-read-email', 'playlist-modify-public', 'user-modify-playback-state'],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            redirectUri: makeRedirectUri({
                path: pathname.replace('/', '')
            })
        },
        discovery
    )

    useEffect(() => {
        let authObjectString = storage.getString(SPOTIFY_AUTH_OBJECT)
        if (authObjectString) {
            let authObect: SpotifyAuthentication = JSON.parse(authObjectString)
            if (authObect.issuedAt + authObect.expiresIn * 1000 > Date.now()) {
                setSpotifyToken(null)
                storage.delete(SPOTIFY_AUTH_OBJECT)
                storage.delete(SPOTIFY_TOKEN)
            }
        }
    }, [])

    useEffect(() => {
        if (response?.type === 'success') {
            storage.set(SPOTIFY_TOKEN, response.authentication.accessToken)
            storage.set(SPOTIFY_AUTH_OBJECT, JSON.stringify(response.authentication))
            setSpotifyToken(response.authentication.accessToken)
            props.onAfterLogin(response.authentication.accessToken)
        }
    }, [response])

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
                storage.delete(SPOTIFY_AUTH_OBJECT)
                storage.delete(SPOTIFY_TOKEN)
            }}
        >
            Logout
        </Button>
    )
}
