import { useEffect, useState } from 'react'
import { StyleSheet, Text, Button } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { GoogleData } from '../types/global'
import { AuthController } from '../utils/ApiHelper'
import { Box } from 'native-base'
import { makeRedirectUri, revokeAsync } from 'expo-auth-session'
import { usePathname } from 'expo-router'
import { GOOGLE_TOKEN, storage } from '../utils/StorageUtils'
import Toast from 'react-native-toast-message'
WebBrowser.maybeCompleteAuthSession()

interface Props {
    onLogin()
}

export default function GoogleLogin(props: Props) {
    let pathname = usePathname()
    let [apiToken, setApiToken] = useState(storage.getString(GOOGLE_TOKEN))
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '108545418952-2uiivcdeu35i44397itsr941s7357bob.apps.googleusercontent.com',
        redirectUri: makeRedirectUri({
            path: pathname
        })
    })

    useEffect(() => {
        if (response?.type === 'success') {
            getApiToken(response.authentication.idToken)
        }
    }, [response])

    async function getApiToken(idToken: string) {
        try {
            Toast.show({
                type: 'success',
                text1: 'Successfully logged in!'
            })
            let response = await AuthController.authGooglePost({
                coflnetSongVoterModelsAuthToken: {
                    token: idToken
                }
            })
            storage.set(GOOGLE_TOKEN, response.token)
            setApiToken(response.token)
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: e?.message || e
            })
        }
    }

    return (
        <Box>
            {!apiToken ? (
                <Button
                    title="Sign in with Google"
                    disabled={!request}
                    onPress={() => {
                        promptAsync()
                    }}
                />
            ) : (
                <Button
                    title="Logout"
                    onPress={() => {
                        setApiToken(null)
                        storage.delete(GOOGLE_TOKEN)
                        Toast.show({
                            type: 'success',
                            text1: 'Logged out!'
                        })
                    }}
                />
            )}
        </Box>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold'
    }
})
