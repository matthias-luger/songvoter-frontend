import { Button, Heading } from 'native-base'
import MainLayout from '../layouts/MainLayout'
import { StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { PartyController } from '../utils/ApiHelper'
import QRCode from 'react-native-qrcode-svg'
import { QRCodeScanner } from '../components/QRCodeScanner'

export default function App() {
    let [inviteLink, setInviteLink] = useState('')

    useEffect(() => {}, [])

    return (
        <>
            <MainLayout>
                <Heading size="xl" style={styles.heading}>
                    Join party
                </Heading>
                <QRCodeScanner />
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
        color: '#555'
    }
})
