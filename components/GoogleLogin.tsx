import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { AuthSessionResult, ResponseType, TokenResponse, TokenResponseConfig, makeRedirectUri } from 'expo-auth-session'
import { usePathname } from 'expo-router'
import { GOOGLE_AUTH_OBJECT, storage } from '../utils/StorageUtils'
import Toast from 'react-native-toast-message'
import { Button, useTheme } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import { showErrorToast } from '../utils/ToastUtils'
import { getAuthController } from '../utils/ApiUtils'
WebBrowser.maybeCompleteAuthSession()

interface Props {
    onAfterLogin?(token: TokenResponseConfig)
}

export const clientId = '366589988548-reag2f35a49fa2cavc4lnl5k1p8n1brd.apps.googleusercontent.com'

export default function GoogleLogin(props: Props) {
    let theme = useTheme()
    let pathname = usePathname()
    let [authObject, setAuthObject] = useState<TokenResponseConfig>(
        storage.contains(GOOGLE_AUTH_OBJECT) ? JSON.parse(storage.getString(GOOGLE_AUTH_OBJECT)) : null
    )
    const [request, response, promptAsync] = Google.useAuthRequest({
        responseType: ResponseType.Code,
        androidClientId: clientId,
        redirectUri: makeRedirectUri({
            path: pathname
        })
    })

    useEffect(() => {
        if (response?.type === 'success') {
            handleGoogleSuccessResponse(response)
        } else if (response?.type === 'error') {
            showErrorToast(response.error)
        }
    }, [response])

    async function handleGoogleSuccessResponse(response: Extract<AuthSessionResult, { type: 'error' | 'success' }>) {
        try {
            let tokenResponse = new TokenResponse(response.authentication)
            console.log(tokenResponse.accessToken)

            let authController = await getAuthController()
            let accessTokenResponse = await authController.authGooglePost({
                coflnetSongVoterModelsAuthRefreshToken: {
                    token: tokenResponse.idToken,
                    accessToken: tokenResponse.accessToken,
                    refreshToken: tokenResponse.refreshToken
                }
            })
            console.log(accessTokenResponse)
            tokenResponse.accessToken = accessTokenResponse.token

            setAuthObject(tokenResponse)
            storage.set(GOOGLE_AUTH_OBJECT, JSON.stringify(tokenResponse.getRequestConfig()))
            Toast.show({
                type: 'success',
                text1: 'Successfully logged in!'
            })
            if (props.onAfterLogin) {
                props.onAfterLogin(tokenResponse)
            }
        } catch (e) {
            showErrorToast(e)
        }
    }

    return (
        <View>
            {!authObject ? (
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
