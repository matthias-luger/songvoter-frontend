import { Button, Center, Heading, Text } from 'native-base'
import MainLayout from '../layouts/MainLayout'
import { StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { PartyController } from '../utils/ApiHelper'
import QRCode from 'react-native-qrcode-svg'

export default function App() {
    let [inviteLink, setInviteLink] = useState('https://songvoter.party')

    useEffect(() => {}, [])

    return (
        <>
            <MainLayout>
                <Heading size="xl" style={styles.heading}>
                    Invite People to your party
                </Heading>
                <QRCode value={inviteLink} />
                <Center>
                    <Text style={styles.joinCode} size={24}>
                        <Text style={{ fontWeight: '800' }}>Code: </Text>
                        {inviteLink}
                    </Text>
                </Center>
            </MainLayout>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        width: '50%'
    },
    heading: {
        color: '#555',
        marginBottom: 20
    },
    joinCode: {
        marginTop: 15,
        width: '50%',
        color: 'white'
    }
})
