import { Box, Button, Heading } from 'native-base'
import { StyleSheet } from 'react-native'
import MainLayout from '../layouts/MainLayout'
import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { GOOGLE_TOKEN, storage } from '../utils/StorageUtils'
import { PartyController } from '../utils/ApiHelper'
import { CoflnetSongVoterModelsParty } from '../generated'
import SpotifyLogin from '../components/SpotifyLogin'

export default function App() {
    const router = useRouter()

    useEffect(() => {
        if (storage.getString(GOOGLE_TOKEN)) {
            PartyController.partyGet()
                .then(party => {
                    router.push('/partyOverview')
                })
                .catch(e => {
                    if (e.status === 404) {
                        // User is not in a party
                        console.log('User is not in a party')
                    }
                })
        }
    }, [])

    return (
        <>
            <MainLayout>
                <Box style={styles.container}>
                    <Heading size="3xl" style={styles.heading}>
                        SongVoter
                    </Heading>
                    <Link asChild href="/invite-party">
                        <Button style={styles.button}>
                            Create Party
                        </Button>
                    </Link>

                    <Link asChild href="/join-party">
                        <Button style={styles.button} variant={'subtle'}>
                            Join Party
                        </Button>
                    </Link>
                </Box>
            </MainLayout>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        width: '50%',
        backgroundColor: '#375a7f',
        color: 'white'
    },
    heading: {
        color: 'white'
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    }
})
