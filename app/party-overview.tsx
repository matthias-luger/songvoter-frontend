import MainLayout from '../layouts/MainLayout'
import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'expo-router'
import { ActivityIndicator, Button, Divider, Modal, Portal, Text } from 'react-native-paper'
import HeaderText from '../components/HeaderText'
import { showErrorToast } from '../utils/ToastUtils'
import { getPartyController, getUserInfo } from '../utils/ApiUtils'
import {
    getCurrentlyPlayingSongDataFromSpotify,
    getSpotifyPlaybackState,
    pauseSpotifySongPlayback,
    playSpotifySong,
    resumeSpotifySongPlayback,
    subscribeToCurrentlyPlayingSongEnd
} from '../utils/SpotifyUtils'
import YoutubePlayer from '../components/YoutubePlayer'
import { CoflnetSongVoterModelsParty, CoflnetSongVoterModelsPartyPlaylistEntry, CoflnetSongVoterModelsSong, CoflnetSongVoterModelsUserInfo } from '../generated'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AppState, ScrollView, View, StyleSheet } from 'react-native'
import BackgroundService from 'react-native-background-actions'
import { makeRedirectUri } from 'expo-auth-session'
import SongList from '../components/SongList'
import { CURRRENT_PARTY, IS_CURRENTLY_PARTY_OWNER, SPOTIFY_TOKEN, storage } from '../utils/StorageUtils'
import AddSong from '../components/AddSong'
import { globalStyles } from '../styles/globalStyles'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

export default function App() {
    const router = useRouter()
    let pathname = usePathname()
    let [initialLoading, setInitialLoading] = useState(true)
    let [showLoadingIndicator, setShowLoadingIndicator] = useState(false)
    let [userInfo, setUserInfo] = useState<CoflnetSongVoterModelsUserInfo | null>()
    let [party, setParty] = useState<CoflnetSongVoterModelsParty>()
    let [playlist, setPlaylist] = useState<CoflnetSongVoterModelsPartyPlaylistEntry[]>()
    let [currentSong, setCurrentSong] = useState<CoflnetSongVoterModelsSong>()
    let [isYoutubePlayerPlaying, setIsYoutubePlayerPlaying] = useState(true)
    let [showAddSongModal, setShowAddSongModal] = useState(false)
    let currentSongRef = useRef(currentSong)
    currentSongRef.current = currentSong
    let playlistRef = useRef(playlist)
    playlistRef.current = playlist
    let cancelSongSubscriptionRef = useRef<Function>()

    useEffect(() => {
        let subscription = AppState.addEventListener('change', async state => {
            if (state === 'active') {
                findCurrentlyPlayingSongOrStartNext()
            }
        })
        async function init() {
            if (!storage.contains(CURRRENT_PARTY)) {
                router.push('/')
            } else {
                setParty(JSON.parse(storage.getString(CURRRENT_PARTY)))
                await Promise.all([loadSongs(), loadUserInfo()])
            }
            setInitialLoading(false)
        }
        init()
        return () => {
            subscription.remove()
        }
    }, [])

    useEffect(() => {
        if (!initialLoading) {
            findCurrentlyPlayingSongOrStartNext()
            if (userInfo?.userId === party?.ownerId) {
                storage.set(IS_CURRENTLY_PARTY_OWNER, true)
            }
        }
    }, [initialLoading])

    async function loadUserInfo() {
        try {
            let info = await getUserInfo()
            setUserInfo(info)
        } catch (e) {
            showErrorToast(e)
        }
    }

    async function loadSongs() {
        try {
            let partyController = await getPartyController()
            let s = (await partyController.apiPartyPlaylistGet()).data
            setPlaylist(s)
            return s
        } catch (e) {
            showErrorToast(e)
        }
    }

    async function findCurrentlyPlayingSongOrStartNext() {
        let partyController = await getPartyController()
        let currentPartySong = (await partyController.apiPartyNextSongGet()).data

        if (currentPartySong.occurences[0].platform === 'spotify') {
            let id = currentPartySong.id
            if (userInfo?.userId === party?.ownerId) {
                if (!storage.contains(SPOTIFY_TOKEN)) {
                    Toast.show({
                        type: 'error',
                        text1: 'Next Song is a Spotify song, but no Spotify account is connected.',
                        text2: 'Trying to start next song...'
                    })
                    startNextSong()
                    return
                }
                let songData = await getCurrentlyPlayingSongDataFromSpotify()
                if (songData?.item) {
                    id = songData.item.id
                }
                if (!songData || !songData.is_playing) {
                    startNextSong()
                    return
                }
            }
            if (!playlistRef.current) {
                let songs = await loadSongs()
                setPlaylist(songs)
                playlistRef.current = songs
            }
            let song = playlistRef.current.find(playlistEntry => playlistEntry.song.occurences[0].externalId === id)
            if (song) {
                setCurrentSong(song.song)
            }
        } else {
            setCurrentSong(currentPartySong)
        }
    }

    let skipSpotifySongBecauseNoConnectedAccountCounter = 0
    async function startNextSong() {
        if (userInfo?.userId !== party?.ownerId) {
            return
        }
        try {
            let partyController = await getPartyController()
            if (currentSongRef.current) {
                await partyController.apiPartySongSongIdPlayedPost(currentSongRef.current.id)
            }
            let song = (await partyController.apiPartyNextSongGet()).data
            setCurrentSong(song)
            if (song.occurences[0].platform === 'spotify') {
                if (!storage.contains(SPOTIFY_TOKEN)) {
                    if (skipSpotifySongBecauseNoConnectedAccountCounter > 3) {
                        setCurrentSong(null)
                        return
                    }
                    Toast.show({
                        type: 'error',
                        text1: 'Next Song is a Spotify song, but no Spotify account is connected.',
                        text2: 'Trying to start next song...'
                    })
                    skipSpotifySongBecauseNoConnectedAccountCounter++
                    startNextSong()
                    return
                }
                await BackgroundService.start(
                    async taskData => {
                        playSpotifySong(song.occurences[0].externalId)
                        if (cancelSongSubscriptionRef.current) {
                            cancelSongSubscriptionRef.current()
                        }
                        await new Promise((resolve, reject) => {
                            setTimeout(() => {
                                cancelSongSubscriptionRef.current = subscribeToCurrentlyPlayingSongEnd(() => {
                                    startNextSong()
                                    resolve(null)
                                }, song.occurences[0].duration)
                            }, 2000)
                        })
                    },
                    {
                        taskName: 'Playing Song',
                        taskTitle: 'Party playing ' + song.occurences[0].title,
                        taskDesc: '',
                        linkingURI:
                            makeRedirectUri({
                                path: pathname.replace('/', '')
                            }) + '/',
                        taskIcon: {
                            name: 'ic_launcher',
                            type: 'mipmap'
                        }
                    }
                )
            }
        } catch (e) {
            showErrorToast(e)
        }
    }

    async function leaveParty() {
        try {
            let partyController = await getPartyController()
            await partyController.apiPartyLeavePost()
            if (cancelSongSubscriptionRef.current) {
                cancelSongSubscriptionRef.current()
            }
            if (BackgroundService.isRunning()) {
                BackgroundService.stop()
            }
            storage.set(IS_CURRENTLY_PARTY_OWNER, false)
            storage.delete(CURRRENT_PARTY)
            if (storage.contains(SPOTIFY_TOKEN) && currentSong?.occurences[0].platform === 'spotify') {
                pauseSpotifySongPlayback()
            }
            router.push('/')
        } catch (e) {
            showErrorToast(e)
        }
    }

    async function showInviteCode() {
        router.push('/invite-party')
    }

    async function togglePlayback() {
        if (currentSong?.occurences[0].platform === 'spotify') {
            let playbackState = await getSpotifyPlaybackState()
            if (playbackState.is_playing) {
                await pauseSpotifySongPlayback()
            } else {
                await resumeSpotifySongPlayback()
            }
        }
        if (currentSong?.occurences[0].platform === 'youtube') {
            setIsYoutubePlayerPlaying(!isYoutubePlayerPlaying)
        }
    }

    async function addSongToParty(song: CoflnetSongVoterModelsSong) {
        let controller = await getPartyController()
        await controller.apiPartyUpvoteSongIdPost(song.id)
        setPlaylist([])
        setShowLoadingIndicator(true)
        await loadSongs()
        setShowLoadingIndicator(false)
    }

    async function onLikeButtonPress(playlistEntry: CoflnetSongVoterModelsPartyPlaylistEntry) {
        if (playlistEntry.selfVote === 'up') {
            removeVote(playlistEntry)
            return
        }
        let controller = await getPartyController()
        await controller.apiPartyUpvoteSongIdPost(playlistEntry.song.id)
        let newPlaylist = [...playlist]
        let entry = newPlaylist.find(e => e.song.id === playlistEntry.song.id)
        if (entry.selfVote === 'down') {
            entry.downVotes -= 1
        }
        entry.upVotes += 1
        entry.selfVote = 'up'
        setPlaylist(newPlaylist)
    }

    async function onDislikeButtonPress(playlistEntry: CoflnetSongVoterModelsPartyPlaylistEntry) {
        if (playlistEntry.selfVote === 'down') {
            removeVote(playlistEntry)
            return
        }
        let controller = await getPartyController()
        await controller.apiPartyDownvoteSongIdPost(playlistEntry.song.id)
        let newPlaylist = [...playlist]
        let entry = newPlaylist.find(e => e.song.id === playlistEntry.song.id)
        if (entry.selfVote === 'up') {
            entry.upVotes -= 1
        }
        entry.selfVote = 'down'
        entry.downVotes += 1
        setPlaylist(newPlaylist)
    }

    async function removeVote(playlistEntry: CoflnetSongVoterModelsPartyPlaylistEntry) {
        let controller = await getPartyController()
        await controller.apiPartyRemoveVoteSongIdPost(playlistEntry.song.id)
        let newPlaylist = [...playlist]
        let entry = newPlaylist.find(e => e.song.id === playlistEntry.song.id)
        if (entry.selfVote === 'down') {
            entry.downVotes -= 1
        }
        if (entry.selfVote === 'up') {
            entry.upVotes -= 1
        }
        entry.selfVote = 'none'
        setPlaylist(newPlaylist)
    }

    return (
        <>
            <MainLayout>
                <HeaderText text={party ? party.name || `Party` : null} />
                {userInfo?.userId === party?.ownerId ? <Button onPress={togglePlayback}>Pause/Resume</Button> : null}
                {currentSong && currentSong.occurences[0].platform === 'youtube' && userInfo?.userId === party?.ownerId ? (
                    <YoutubePlayer videoId={currentSong.occurences[0].externalId} playing={isYoutubePlayerPlaying} onVideoHasEnded={startNextSong} />
                ) : null}
                <ScrollView>
                    {initialLoading || showLoadingIndicator ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <>
                            <SongList
                                songs={playlist ? playlist.map(p => p.song) : []}
                                playingSong={currentSong}
                                showPlaySongButton={false}
                                getListElementClickElement={song => {
                                    let playlistElement = playlist.find(p => p.song.id === song.id)
                                    return (
                                        <>
                                            <View style={{ display: 'flex', marginRight: 15 }}>
                                                <MaterialCommunityIcons
                                                    onPress={() => {
                                                        onLikeButtonPress(playlistElement)
                                                    }}
                                                    name={playlistElement.selfVote === 'up' ? 'thumb-up' : 'thumb-up-outline'}
                                                    color={'lime'}
                                                    size={20}
                                                />
                                                <Text>{playlistElement.upVotes || 0}</Text>
                                            </View>
                                            <View style={{ display: 'flex' }}>
                                                <MaterialCommunityIcons
                                                    onPress={() => {
                                                        onDislikeButtonPress(playlistElement)
                                                    }}
                                                    name={playlistElement.selfVote === 'down' ? 'thumb-down' : 'thumb-down-outline'}
                                                    color={'red'}
                                                    size={20}
                                                />
                                                <Text>{playlistElement.downVotes || 0}</Text>
                                            </View>
                                        </>
                                    )
                                }}
                            />
                            <Divider />
                            <View style={styles.buttonContainer}>
                                <Button
                                    textColor="white"
                                    onPress={() => {
                                        setShowAddSongModal(true)
                                    }}
                                    style={styles.addSongButton}
                                >
                                    Add Song
                                </Button>
                                <Button textColor="white" onPress={showInviteCode} style={styles.inviteButton}>
                                    Show invite Code
                                </Button>
                            </View>
                            <Button textColor="white" onPress={leaveParty} style={styles.leaveButton}>
                                Leave Party
                            </Button>
                        </>
                    )}
                </ScrollView>
                {showAddSongModal ? (
                    <Portal>
                        <Modal
                            visible={showAddSongModal}
                            onDismiss={() => {
                                setShowAddSongModal(false)
                            }}
                            contentContainerStyle={{ ...globalStyles.fullModalContainer }}
                        >
                            <AddSong onAfterSongAdded={addSongToParty} platforms={party.platforms} />
                        </Modal>
                    </Portal>
                ) : null}
            </MainLayout>
        </>
    )
}

const styles = StyleSheet.create({
    leaveButton: {
        width: '100%',
        display: 'flex',
        backgroundColor: 'red'
    },
    addSongButton: {
        width: '45%',
        backgroundColor: 'blue'
    },
    inviteButton: {
        width: '45%',
        backgroundColor: 'blue'
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 10
    }
})
