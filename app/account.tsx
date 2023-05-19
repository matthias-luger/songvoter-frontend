import { Text, useTheme } from 'react-native-paper'
import MainLayout from '../layouts/MainLayout'
import { StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import { GOOGLE_TOKEN, SPOTIFY_TOKEN, storage } from '../utils/StorageUtils'
import GoogleLogin from '../components/GoogleLogin'
import SpotifyLogin from '../components/SpotifyLogin'
import HeaderText from '../components/HeaderText'

export default function App() {
    let theme = useTheme()
    let [inviteLink, setInviteLink] = useState('')
    let [googleToken, setGoogleToken] = useState(storage.getString(GOOGLE_TOKEN))
    let [spotifyToken, setSpotifyToken] = useState(storage.getString(SPOTIFY_TOKEN))

    useEffect(() => {}, [])

    return (
        <>
            <MainLayout>
                <View style={styles.container}>
                    <HeaderText text="Account" />
                    <View>
                        <View style={styles.accountBox}>
                            <Text style={{ width: '30%', ...theme.fonts.labelLarge }}>Google</Text>
                            <View style={{ width: '50%' }}>
                                <GoogleLogin onAfterLogin={token => setGoogleToken(token)} />
                            </View>
                        </View>
                        <View style={styles.accountBox}>
                            <Text style={{ width: '30%', ...theme.fonts.labelLarge }}>Spotify</Text>
                            <View style={{ width: '50%' }}>
                                <SpotifyLogin onAfterLogin={token => setSpotifyToken(token)} />
                            </View>
                        </View>
                    </View>
                </View>
            </MainLayout>
        </>
    )
}

const styles = StyleSheet.create({
    accountBox: {
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        marginBottom: 15
    },
    container: {}
})
