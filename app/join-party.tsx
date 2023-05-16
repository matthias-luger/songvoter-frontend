import { Heading } from 'native-base'
import MainLayout from '../layouts/MainLayout'
import { StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
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
