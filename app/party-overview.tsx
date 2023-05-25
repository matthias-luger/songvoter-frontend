import MainLayout from '../layouts/MainLayout'
import { useEffect, useState } from 'react'
import { CoflnetSongVoterModelsParty } from '../generated'
import { useRouter } from 'expo-router'
import { Button } from 'react-native-paper'
import HeaderText from '../components/HeaderText'
import { showErrorToast } from '../utils/ToastUtils'
import { getPartyController } from '../utils/ApiUtils'

export default function App() {
    const router = useRouter()
    let [party, setParty] = useState<CoflnetSongVoterModelsParty>()

    useEffect(() => {
        loadParty()
    }, [])

    async function loadParty() {
        try {
            let partyController = await getPartyController()
            let party = await partyController.partyGet()
            setParty(party)
        } catch (e) {
            if (e.status === 404) {
                router.push('/')
            }
        }
    }

    async function leaveParty() {
        try {
            let partyController = await getPartyController()
            await partyController.partyLeavePost()
            router.push('/')
        } catch (e) {
            showErrorToast(e)
        }
    }

    return (
        <>
            <MainLayout>
                <HeaderText text={party ? `Party ${party?.name}` : null} />
                <Button onPress={leaveParty}>Leave</Button>
            </MainLayout>
        </>
    )
}
