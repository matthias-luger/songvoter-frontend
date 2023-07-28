import MainLayout from '../layouts/MainLayout'
import { useEffect, useState } from 'react'
import { CoflnetSongVoterDBModelsSong, CoflnetSongVoterModelsParty, CoflnetSongVoterModelsPartyPlaylistEntry } from '../generated'
import { useRouter } from 'expo-router'
import { Button, Text } from 'react-native-paper'
import HeaderText from '../components/HeaderText'
import { showErrorToast } from '../utils/ToastUtils'
import { getListController, getPartyController } from '../utils/ApiUtils'
import { playSpotifySong } from '../utils/SpotifyUtils'
import SongListElement from '../components/SongListElement'
import YoutubePlayer from '../components/YoutubePlayer'

export default function App() {
    const router = useRouter()
    let [party, setParty] = useState<CoflnetSongVoterModelsParty>()
    let [playlist, setPlaylist] = useState<CoflnetSongVoterModelsPartyPlaylistEntry[]>()
    let [currentSong, setCurrentSong] = useState<CoflnetSongVoterDBModelsSong>()

    useEffect(() => {
        loadParty()
        getNextSong()
        loadSongs()
    }, [])

    async function loadSongs() {
        try {
            let partyController = await getPartyController()
            let s = await partyController.partyPlaylistGet()
            setPlaylist(s)
        } catch (e) {
            console.log(JSON.stringify(e))
            showErrorToast(e)
        }
    }

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

    async function getNextSong() {
        try {
            let partyController = await getPartyController()
            let song = await partyController.partyNextSongGet()
            setCurrentSong(song)
            if (song.externalSongs[0].platform === 'spotify') {
                playSpotifySong(song.externalSongs[0].externalId)
            }
        } catch (e) {
            showErrorToast(e)
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

    async function showInviteCode() {
        router.push('/invite-party')
    }

    async function addSongsToParty() {
        try {
            let listController = await getListController()
            let lists = await listController.listsGet()
            await listController.listsListIdSongsPost({
                listId: lists[0].id
            })
        } catch (e) {
            showErrorToast(e)
        }
    }

    return (
        <>
            <MainLayout>
                <HeaderText text={party ? `Party ${party?.name}` : null} />
                <Text>{JSON.stringify(party)}</Text>
                <Text>Current Song: {currentSong ? currentSong.title : '-'}</Text>
                {currentSong && currentSong.externalSongs[0].platform === 'youtube' ? (
                    <YoutubePlayer videoId={currentSong.externalSongs[0].externalId} />
                ) : null}
                <Button onPress={addSongsToParty}>Add your songs to party</Button>
                <Button onPress={showInviteCode}>Show invite Code</Button>
                <Button onPress={leaveParty}>Leave</Button>
                {playlist ? playlist.map(p => <SongListElement song={p.song} clickElement={null} />) : null}
            </MainLayout>
        </>
    )
}
