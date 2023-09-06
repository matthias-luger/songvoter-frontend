import MainLayout from '../layouts/MainLayout'
import { Linking, StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import { QRCodeScanner } from '../components/QRCodeScanner'
import { Button, Divider, Text, TextInput, useTheme } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import HeaderText from '../components/HeaderText'
import { showErrorToast } from '../utils/ToastUtils'
import { getPartyController } from '../utils/ApiUtils'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

export default function App() {
    let theme = useTheme()
    let [joinPartyUrl, setJoinPartyUrl] = useState('')

    async function onJoinParty(joinUrl: string) {
        if (!joinUrl || !joinUrl.toLocaleLowerCase().includes('songvoter.party')) {
            Toast.show({
                text1: 'Invalid QR-Code',
                text2: "This QR-Code doesn't seem to be from a SongVoter party"
            })
            return
        }
        let id = joinUrl.split('/invite/')[1]
        try {
            let partyController = await getPartyController()
            await partyController.partyPartyIdJoinPost({
                partyId: id
            })
        } catch (e) {
            showErrorToast(e)
        }
    }

    return (
        <>
            <MainLayout>
                <HeaderText text="Join Party" />
                <Text>Scan the QR-Code</Text>
                <View style={{ height: 250 }}>
                    <QRCodeScanner onBarcodeScan={code => onJoinParty(code as string)} />
                </View>
                <Divider style={styles.divider} />
                <Text>Or join by entering the Party ID</Text>
                <TextInput label="Party ID" style={styles.textInput} value={joinPartyUrl} onChangeText={text => setJoinPartyUrl(text)} />
                <Button
                    style={{ ...globalStyles.primaryElement, ...styles.joinButton }}
                    textColor={theme.colors.onPrimary}
                    onPress={() => {
                        onJoinParty(joinPartyUrl)
                    }}
                >
                    Join
                </Button>
            </MainLayout>
        </>
    )
}

const styles = StyleSheet.create({
    joinButton: {
        marginTop: 20
    },
    divider: {
        marginTop: 10,
        marginBottom: 10
    },
    textInput: {
        marginTop: 3
    }
})
