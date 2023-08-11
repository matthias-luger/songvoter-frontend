import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper'
import MainLayout from '../layouts/MainLayout'
import { Keyboard, StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import QRCode from 'react-native-qrcode-svg'
import { CoflnetSongVoterDBModelsParty, CoflnetSongVoterModelsParty } from '../generated'
import { globalStyles } from '../styles/globalStyles'
import { showErrorToast } from '../utils/ToastUtils'
import HeaderText from '../components/HeaderText'
import { getPartyController } from '../utils/ApiUtils'
import { useRouter } from 'expo-router'

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

    return (
        <>
            <MainLayout>
                <View style={{ ...globalStyles.fullCenterContainer }}>
                    <HeaderText text="Invite people to your party" />
                    {isLoading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <>
                            <QRCode value={inviteLink} />
                            <View>
                                <Text style={styles.joinCode}>
                                    <Text style={{ fontWeight: '800' }}>Invite: </Text>
                                    {inviteLink}
                                </Text>
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
        width: '50%',
        color: 'white'
    }
})
