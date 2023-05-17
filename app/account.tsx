import { Box, Column, Heading, Text } from 'native-base'
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
                <Heading size="2xl" style={styles.heading}>
                    Account
                </Heading>
                <Column>
                    <Text fontSize="xl">Google</Text>
                    <Box size="xl" style={styles.accountBox}>
                        <Text>Spotify</Text>
                    </Box>
                </Column>
            </MainLayout>
        </>
    )
}

const styles = StyleSheet.create({
    accountBox: {
        backgroundColor: 'red',
        height: 60,
        width: 200,
        margin: 20,
        alignSelf: 'stretch'
    },
    heading: {
        color: '#555',
        alignSelf: 'center'
    }
})
