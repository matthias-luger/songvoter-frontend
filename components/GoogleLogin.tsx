import { useEffect, useState } from 'react'
import { View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { AuthSessionResult, ResponseType, TokenResponse, TokenResponseConfig, makeRedirectUri } from 'expo-auth-session'
import { usePathname } from 'expo-router'
import { GOOGLE_AUTH_OBJECT, storage } from '../utils/StorageUtils'
import Toast from 'react-native-toast-message'
import { Button, useTheme } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import { showErrorToast } from '../utils/ToastUtils'
import { getAuthController, googleClientId } from '../utils/ApiUtils'
WebBrowser.maybeCompleteAuthSession()

interface Props {
    onAfterLogin?(token: TokenResponseConfig)
}

export default function GoogleLogin(props: Props) {
    let theme = useTheme()
    let pathname = usePathname()
    let [authObject, setAuthObject] = useState<TokenResponseConfig>(
        storage.contains(GOOGLE_AUTH_OBJECT) ? JSON.parse(storage.getString(GOOGLE_AUTH_OBJECT)) : null
    )
    let [isLoggingIn, setIsLoggingIn] = useState(false)
    const [request, response, promptAsync] = Google.useAuthRequest({
        responseType: ResponseType.Code,
        androidClientId: googleClientId,
        redirectUri: makeRedirectUri({
            path: pathname
        })
    })

    useEffect(() => {
        if (response?.type === 'success') {
            handleGoogleSuccessResponse(response)
        } else if (response?.type === 'error') {
            setIsLoggingIn(false)
            showErrorToast(response.error)
        }
    }, [response])

    async function handleGoogleSuccessResponse(response: Extract<AuthSessionResult, { type: 'error' | 'success' }>) {
        try {
            let tokenResponse = new TokenResponse(response.authentication)

            let authController = await getAuthController()
            let accessTokenResponse = await authController.apiAuthGooglePost({
                token: tokenResponse.idToken,
                accessToken: tokenResponse.accessToken,
                refreshToken: tokenResponse.refreshToken
            })
            tokenResponse.accessToken = accessTokenResponse.data.token

            setAuthObject(tokenResponse)
            storage.set(GOOGLE_AUTH_OBJECT, JSON.stringify(tokenResponse.getRequestConfig()))
            Toast.show({
                type: 'success',
                text1: 'Successfully logged in!'
            })
            setIsLoggingIn(false)
            if (props.onAfterLogin) {
                props.onAfterLogin(tokenResponse)
            }
        } catch (e) {
            setIsLoggingIn(false)
            showErrorToast(e)
        }
    }

    return (
        <View>
            {!authObject ? (
                <Button
                    mode="contained"
                    loading={isLoggingIn}
                    disabled={!request || isLoggingIn}
                    onPress={() => {
                        setIsLoggingIn(true)
                        promptAsync()
                    }}
                >
                    Sign in with Google
                </Button>
            ) : (
                <Button
                    mode="contained"
                    onPress={() => {
                        setAuthObject(null)
                        storage.delete(GOOGLE_AUTH_OBJECT)
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
