import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin'
import { Box, Button, Text } from 'native-base'
import { useEffect, useState } from 'react'

export function GoogleLogin() {
    let [userInfo, setUserInfo] = useState(null)
    let [isSigninInProgress, setIsSigninInProgress] = useState(false)

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '1092901711600-cans570mhv8cgok7724gsm54d38c2e4v.apps.googleusercontent.com'
        })
        getCurrentUserInfo()
    }, [])

    async function getCurrentUserInfo() {
        try {
            const userInfo = await GoogleSignin.signInSilently()
            setUserInfo(userInfo)
        } catch (error) {
            setUserInfo(JSON.stringify(error))
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                // user has not signed in yet
            } else {
                // some other error
            }
        }
    }

    async function onLogin() {
        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            setUserInfo(userInfo)
        } catch (error) {
            setUserInfo(JSON.stringify(error))
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    }

    return (
        <Box>
            <Text>{JSON.stringify(userInfo)}</Text>
            <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={onLogin}
                disabled={isSigninInProgress}
            />
            ;
        </Box>
    )
}
