import MainLayout from '../layouts/MainLayout'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { Button, Text } from 'react-native-paper'
import HeaderText from '../components/HeaderText'
import { showErrorToast } from '../utils/ToastUtils'
import { getListController, getPartyController } from '../utils/ApiUtils'
import { playSpotifySong, subscribeToCurrentlyPlayingSongEnd } from '../utils/SpotifyUtils'
import SongListElement from '../components/SongListElement'
import YoutubePlayer from '../components/YoutubePlayer'
import { CoflnetSongVoterModelsParty, CoflnetSongVoterModelsPartyPlaylistEntry, CoflnetSongVoterModelsSong } from '../generated'

export default function App() {
    const router = useRouter()
    let [party, setParty] = useState<CoflnetSongVoterModelsParty>()
    let [playlist, setPlaylist] = useState<CoflnetSongVoterModelsPartyPlaylistEntry[]>()
    let [currentSong, setCurrentSong] = useState<CoflnetSongVoterModelsSong>()
    let currentSongRef = useRef(currentSong)
    currentSongRef.current = currentSong
    let cancelSongSubscriptionRef = useRef<Function>()

    useEffect(() => {
        async function init() {
            await Promise.all([loadParty(), loadSongs()])
            startNextSong()
        }
        init()

        return () => {
            if (cancelSongSubscriptionRef.current) {
                cancelSongSubscriptionRef.current()
            }
        }
    }, [])

    async function loadSongs() {
        try {
            let partyController = await getPartyController()
            let s = await partyController.partyPlaylistGet()
            setPlaylist(s)
        } catch (e) {
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

    async function startNextSong() {
        try {
            let partyController = await getPartyController()
            if (currentSongRef.current) {
                await partyController.partySongSongIdPlayedPost({
                    songId: currentSongRef.current.id
                })
            }
            let song = await partyController.partyNextSongGet()
            setCurrentSong(song)
            if (song.occurences[0].platform === 'spotify') {
                await playSpotifySong(song.occurences[0].externalId)
            }

            // wait a bit, otherwise Spotify serves the old song
            setTimeout(() => {
                cancelSongSubscriptionRef.current = subscribeToCurrentlyPlayingSongEnd(() => {
                    startNextSong()
                })
            }, 500)
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
                {currentSong && currentSong.occurences[0].platform === 'youtube' ? <YoutubePlayer videoId={currentSong.occurences[0].externalId} /> : null}
                {playlist ? playlist.map(p => <SongListElement key={p.song.id} song={p.song} clickElement={null} />) : null}
                <Button onPress={addSongsToParty}>Add your songs to party</Button>
                <Button onPress={showInviteCode}>Show invite Code</Button>
                <Button onPress={leaveParty}>Leave</Button>
            </MainLayout>
        </>
    )
}
