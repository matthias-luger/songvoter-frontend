import { Button, Heading } from 'native-base'
import MainLayout from '../layouts/MainLayout'
import { StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { QRCodeScanner } from '../components/QRCodeScanner'
import { CoflnetSongVoterModelsParty } from '../generated'
import { PartyController } from '../utils/ApiHelper'
import { useRouter } from 'expo-router'

export default function App() {
    const router = useRouter()
    let [party, setParty] = useState<CoflnetSongVoterModelsParty>()

    useEffect(() => {
        PartyController.partyGet()
            .then(party => {
                setParty(party)
            })
            .catch(e => {
                if (e.status === 404) {
                    router.push('/')
                }
            })
    }, [])

    async function leaveParty() {
        await PartyController.partyLeavePost()
        router.push('/')
    }

    return (
        <>
            <MainLayout>
                <Heading size="xl" style={styles.heading}>
                    Party {party?.name}
                </Heading>
                <Button onTouchEnd={leaveParty}>Leave</Button>
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
