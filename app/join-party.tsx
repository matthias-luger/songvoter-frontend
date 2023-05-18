import MainLayout from '../layouts/MainLayout'
import { StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import { QRCodeScanner } from '../components/QRCodeScanner'
import { Button, Divider, Text, TextInput, useTheme } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import HeaderText from '../components/HeaderText'

export default function App() {
    let theme = useTheme()
    let [joinPartyId, setJoinPartyId] = useState('')

    function onJoinParty(joinData: any) {
        // TODO: Join Party
    }

    return (
        <>
            <MainLayout>
                <HeaderText text="Join Party" />
                <Text>Scan the QR-Code</Text>
                <View style={{ height: 250 }}>
                    <QRCodeScanner onBarcodeScan={code => onJoinParty(code.content.data)} />
                </View>
                <Divider style={styles.divider} />
                <Text>Or join by entering the Party ID</Text>
                <TextInput label="Party ID" style={styles.textInput} value={joinPartyId} onChangeText={text => setJoinPartyId(text)} />
                <Button style={{ ...globalStyles.primaryElement, ...styles.joinButton }} textColor={theme.colors.onPrimary}>
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
