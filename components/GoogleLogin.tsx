import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { AuthController } from '../utils/ApiUtils'
import { ResponseType, makeRedirectUri } from 'expo-auth-session'
import { usePathname } from 'expo-router'
import { GOOGLE_TOKEN, storage } from '../utils/StorageUtils'
import Toast from 'react-native-toast-message'
import { Button, useTheme } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import { showErrorToast } from '../utils/ToastUtils'
WebBrowser.maybeCompleteAuthSession()

interface Props {
    onAfterLogin(token: string)
}

export default function GoogleLogin(props: Props) {
    let theme = useTheme()
    let pathname = usePathname()
    let [apiToken, setApiToken] = useState(storage.getString(GOOGLE_TOKEN))
    const [request, response, promptAsync] = Google.useAuthRequest({
        responseType: ResponseType.Code,
        androidClientId: '108545418952-2uiivcdeu35i44397itsr941s7357bob.apps.googleusercontent.com',
        redirectUri: makeRedirectUri({
            path: pathname
        })
    })

    useEffect(() => {
        if (response?.type === 'success') {
            getApiToken(response.params.code)
        }
    }, [response])

    async function getApiToken(code: string) {
        try {
            let response = await AuthController.authGoogleCodePost({
                coflnetSongVoterControllersAuthApiControllerImplAuthCode: {
                    code: code
                }
            })
            storage.set(GOOGLE_TOKEN, response.token)
            setApiToken(response.token)
            props.onAfterLogin(response.token)
            Toast.show({
                type: 'success',
                text1: 'Successfully logged in!'
            })
        } catch (e) {
            showErrorToast(e)
        }
    }

    return (
        <View>
            {!apiToken ? (
                <Button
                    style={globalStyles.primaryElement}
                    textColor={theme.colors.onPrimary}
                    disabled={!request}
                    onPress={() => {
                        promptAsync()
                    }}
                >
                    Sign in with Google
                </Button>
            ) : (
                <Button
                    style={globalStyles.primaryElement}
                    textColor={theme.colors.onPrimary}
                    onPress={() => {
                        setApiToken(null)
                        storage.delete(GOOGLE_TOKEN)
                        Toast.show({
                            type: 'success',
                            text1: 'Logged out!'
                        })
                    }}
                >
                    Logout
                </Button>
            )}
        </View>
    )
}
