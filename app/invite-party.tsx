import { Button, Center, Heading, Text } from 'native-base'
import MainLayout from '../layouts/MainLayout'
import { StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import QRCode from 'react-native-qrcode-svg'
import { PartyController } from '../utils/ApiHelper'
import { CoflnetSongVoterDBModelsParty } from '../generated'

export default function App() {
    let [party, setParty] = useState<CoflnetSongVoterDBModelsParty>()
    let [inviteLink, setInviteLink] = useState('https://songvoter.party')

    useEffect(() => {
        PartyController.partyPost().then(party => {
            setParty(party)
            PartyController.partyInviteLinkGet({
                partyId: party.id.toString()
            }).then(partyLink => {
                setInviteLink(partyLink)
            }).catch(e => {
                setInviteLink("No invite link :(")
            })
        })
    }, [])

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
