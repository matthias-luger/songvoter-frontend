import { Button, Divider, HelperText, Switch, Text, TextInput, useTheme } from 'react-native-paper'
import MainLayout from '../layouts/MainLayout'
import { StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import HeaderText from '../components/HeaderText'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import SpotifyLogin from '../components/SpotifyLogin'
import { getPartyController } from '../utils/ApiUtils'
import { CURRRENT_PARTY, SPOTIFY_TOKEN, storage } from '../utils/StorageUtils'
import { showErrorToast } from '../utils/ToastUtils'
import { router } from 'expo-router'
import { CoflnetSongVoterModelsSongPlatform } from '../generated'

export default function App() {
    let theme = useTheme()
    let [partyTitle, setPartyTitle] = useState(null)
    let [useYoutube, setUseYoutube] = useState(false)
    let [useSpotify, setUseSpotify] = useState(false)
    let [hasSpotifyConnected, setHasSpotifyConnected] = useState(storage.contains(SPOTIFY_TOKEN))

    async function onPartyCreate() {
        if (!useYoutube && !useSpotify) {
            Toast.show({
                type: 'info',
                text1: 'Please select at least 1 platform'
            })
            return
        }
        if (!partyTitle) {
            setPartyTitle('')
            return
        }
        let partyController = await getPartyController()
        try {
            let platforms: CoflnetSongVoterModelsSongPlatform[] = []
            if (useYoutube) {
                platforms.push('youtube')
            }
            if (useSpotify) {
                platforms.push('spotify')
            }
            let newParty = (await partyController.apiPartyPost(partyTitle, platforms)).data

            storage.set(CURRRENT_PARTY, JSON.stringify(newParty))
            router.push('/invite-party')
        } catch (e) {
            if (e?.response?.data === 'You are already in a party, leave it first') {
                let party = (await partyController.apiPartyGet()).data
                storage.set(CURRRENT_PARTY, JSON.stringify(party))
                router.push('/party-overview')
            }

            showErrorToast(e)
        }
        return
    }

    return (
        <>
            <MainLayout>
                <View>
                    <HeaderText text="Create Party" />
                    <View style={{ marginBottom: 20 }}>
                        <TextInput
                            label="Title"
                            error={partyTitle === ''}
                            style={styles.textInput}
                            mode="outlined"
                            onChangeText={text => setPartyTitle(text)}
                        />
                        <HelperText type="error" visible={partyTitle === ''}>
                            Please enter a party title
                        </HelperText>
                    </View>
                    <Text style={{ ...theme.fonts.headlineSmall }}>Music Platforms</Text>
                    <View>
                        <View style={styles.row}>
                            <Text>Use Spotify</Text>
                            <Switch disabled={!hasSpotifyConnected} value={useSpotify} onValueChange={setUseSpotify} />
                            {!hasSpotifyConnected ? (
                                <SpotifyLogin
                                    onAfterLogin={() => {
                                        setHasSpotifyConnected(true)
                                    }}
                                />
                            ) : null}
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text>Use Youtube</Text>
                        <Switch value={useYoutube} onValueChange={setUseYoutube} />
                    </View>
                    <Divider />
                    <Button onPress={onPartyCreate}>Create Party</Button>
                </View>
            </MainLayout>
        </>
    )
}

const styles = StyleSheet.create({
    textInput: {
        marginTop: 3
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16
    }
})
