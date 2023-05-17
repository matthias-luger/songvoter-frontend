import * as React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { ResponseType, makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { Button } from 'react-native'
import { usePathname } from 'expo-router'
import { useEffect, useState } from 'react'
import { SPOTIFY_TOKEN, storage } from '../utils/StorageUtils'
import { SpotifyAuthentication } from '../types/global'

WebBrowser.maybeCompleteAuthSession()

// Endpoint
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token'
}

interface Props {
    onAfterSpotifyLogin?(spotifyAuth: SpotifyAuthentication)
}

export default function SpotifyLogin(props: Props) {
    let [spotifyAuth, setSpotifyAuth] = useState<SpotifyAuthentication>()
    let pathname = usePathname()
    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Token,
            clientId: 'e085a97fb6f94dbe9ac11b70f05d00cf',
            scopes: ['user-read-email', 'playlist-modify-public'],
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
        let auth = storage.getString(SPOTIFY_TOKEN)
        if (auth) {
            setSpotifyAuth(JSON.parse(auth))
        }
    }, [])

    useEffect(() => {
        if (response?.type === 'success') {
            storage.set(SPOTIFY_TOKEN, JSON.stringify(response.authentication))
            props.onAfterSpotifyLogin(response.authentication)
        }
    }, [response])

    return !spotifyAuth ? (
        <Button
            disabled={!request}
            title="Spotify Login"
            onPress={() => {
                promptAsync()
            }}
        />
    ) : null
}
