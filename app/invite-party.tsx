import { ActivityIndicator, Button, IconButton, Text, useTheme } from 'react-native-paper'
import MainLayout from '../layouts/MainLayout'
import { StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import QRCode from 'react-native-qrcode-svg'
import { globalStyles } from '../styles/globalStyles'
import { showErrorToast } from '../utils/ToastUtils'
import HeaderText from '../components/HeaderText'
import { getPartyController } from '../utils/ApiUtils'
import { useRouter } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import { CURRRENT_PARTY, storage } from '../utils/StorageUtils'

export default function App() {
    let router = useRouter()
    let [inviteLink, setInviteLink] = useState('https://songvoter.party')
    let [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadPartyLink()
    }, [])

    async function loadPartyLink() {
        let partyController = await getPartyController()
        setIsLoading(true)
        try {
            // see if there is a party
            let party = await partyController.partyGet()
            let link = await partyController.partyInviteLinkGet()
            setInviteLink(link.link)
        } catch (e) {
            if (e.response?.status === 404) {
                try {
                    let newParty = await partyController.partyPost()
                    let link = await partyController.partyInviteLinkGet()
                    storage.set(CURRRENT_PARTY, JSON.stringify(newParty))
                    setInviteLink(link.link)
                } catch (e) {
                    showErrorToast(e)
                }
                return
            }
            showErrorToast(e)
        } finally {
            setIsLoading(false)
        }
    }

    function navigateToOverview() {
        router.push('/party-overview')
    }

    async function onCopyPress() {
        await Clipboard.setStringAsync(inviteLink)
    }

    return (
        <>
            <MainLayout>
                <View style={{ ...globalStyles.fullCenterContainer }}>
                    <HeaderText text="Invite people to your party" />
                    {isLoading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <>
                            <QRCode value={inviteLink} size={200} quietZone={10} />
                            <View>
                                <View style={styles.joinCodeContainer}>
                                    <Text style={styles.joinCode}>
                                        <Text style={{ fontWeight: '800' }}>Invite: </Text>
                                        {inviteLink}
                                    </Text>
                                    <IconButton icon="content-copy" style={{ marginTop: 15 }} onPress={onCopyPress} />
                                </View>
                                <Button onPress={navigateToOverview}>To Overview</Button>
                            </View>
                        </>
                    )}
                </View>
            </MainLayout>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        width: '50%'
    },
    joinCode: {
        marginTop: 15,
        color: 'white'
    },
    joinCodeContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
})
