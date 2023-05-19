import MainLayout from '../layouts/MainLayout'
import { useEffect, useState } from 'react'
import { CoflnetSongVoterModelsParty } from '../generated'
import { PartyController } from '../utils/ApiUtils'
import { useRouter } from 'expo-router'
import { Button } from 'react-native-paper'
import HeaderText from '../components/HeaderText'
import { showErrorToast } from '../utils/ToastUtils'

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
        try {
            await PartyController.partyLeavePost()
            router.push('/')
        } catch (e) {
            showErrorToast(e)
        }
    }

    return (
        <>
            <MainLayout>
                <HeaderText text={`Party ${party?.name}`} />
                <Button onPress={leaveParty}>Leave</Button>
            </MainLayout>
        </>
    )
}
