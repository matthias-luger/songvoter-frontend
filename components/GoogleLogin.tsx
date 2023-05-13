import { GoogleSignin, GoogleSigninButton, User, statusCodes } from '@react-native-google-signin/google-signin'
import { Box, Button, Text } from 'native-base'
import { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { getCurrentUserInfo, setCurrentUserInfo } from '../utils/GoogleUtils'
import { GoogleData } from '../types/global'
import { AuthController } from '../utils/ApiHelper'
import { AuthApiControllerImplApi, Configuration } from '../generated'

interface Props {
    onLogin(user: GoogleData)
}

export function GoogleLogin(props: Props) {
    let [isSignedIn, setIsSignedIn] = useState(false)

    useEffect(() => {
        let userInfo = getCurrentUserInfo()
        if (userInfo) {
            setIsSignedIn(true)
            if (props.onLogin) {
                props.onLogin(userInfo)
            }
            return
        }
        GoogleSignin.configure({ webClientId: '108545418952-7sq5bfbe3467koksr3nsfml7b4saep0n.apps.googleusercontent.com' })
        loginSilently()
    }, [])

    async function loginSilently() {
        try {
            let userInfo: GoogleData = await GoogleSignin.signInSilently()
            setGoogleData(userInfo)
        } catch (error) {
            setIsSignedIn(false)
            Toast.show({
                type: 'error',
                text1: error.message
            })
        }
    }

    async function onLogin() {
        try {
            await GoogleSignin.hasPlayServices()
            let userInfo: GoogleData = await GoogleSignin.signIn()
            setGoogleData(userInfo)
            Toast.show({
                type: 'success',
                text1: 'Login successful'
            })
        } catch (error) {
            setIsSignedIn(false)
            Toast.show({
                type: 'error',
                text1: error.message
            })
        }
    }

    async function setGoogleData(userInfo: User) {
        try {
            let googleData: GoogleData = { ...userInfo }
            let response = await AuthController.v1AuthGooglePost({
                coflnetSongVoterModelsAuthToken: {
                    token: userInfo.idToken
                }
            })
            googleData.serverToken = response.token
            setCurrentUserInfo(googleData)
            if (props.onLogin) {
                props.onLogin(googleData)
            }
            setIsSignedIn(true)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Box>
            {!isSignedIn ? (
                <GoogleSigninButton
                    style={{ width: 192, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={onLogin}
                />
            ) : null}
        </Box>
    )
}
