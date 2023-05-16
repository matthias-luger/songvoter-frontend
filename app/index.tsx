import { Button, Heading } from 'native-base'
import { StyleSheet } from 'react-native'
import MainLayout from '../layouts/MainLayout'
import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { API_TOKEN, storage } from '../utils/StorageUtils'
import { PartyController } from '../utils/ApiHelper'
import { CoflnetSongVoterModelsParty } from '../generated'

export default function App() {
    const router = useRouter()

    useEffect(() => {
        if (storage.getString(API_TOKEN)) {
            PartyController.partyGet()
                .then(party => {
                    router.push('/party-overview')
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
                <Heading size="3xl" style={styles.heading}>
                    SongVoter
                </Heading>
                <Link asChild href="/invite-party">
                    <Button style={styles.button} variant={'subtle'}>
                        Create Party
                    </Button>
                </Link>

                <Link asChild href="/join-party">
                    <Button style={styles.button} variant={'subtle'}>
                        Join Party
                    </Button>
                </Link>
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
