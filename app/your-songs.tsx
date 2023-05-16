import { Heading } from 'native-base'
import MainLayout from '../layouts/MainLayout'
import { useState } from 'react'
import { StyleSheet } from 'react-native'
import GoogleLogin from '../components/GoogleLogin'
import { GoogleData } from '../types/global'

export default function Spotify() {
    let [userInfo, setUserInfo] = useState<GoogleData>()

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
