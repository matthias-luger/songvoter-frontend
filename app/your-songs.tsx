import { Heading } from 'native-base'
import MainLayout from '../layouts/MainLayout'
import { GoogleLogin } from '../components/GoogleLogin'
import { useState } from 'react'
import { User } from '@react-native-google-signin/google-signin'
import { StyleSheet } from 'react-native'

export default function Spotify() {
    let [userInfo, setUserInfo] = useState<User>()

    return (
        <MainLayout>
            <Heading style={styles.heading} size="3xl">
                {userInfo?.user.name} Songs
            </Heading>
            <GoogleLogin onLogin={userInfo => setUserInfo(userInfo)} />
        </MainLayout>
    )
}

const styles = StyleSheet.create({
    heading: {
        color: '#555'
    }
})
