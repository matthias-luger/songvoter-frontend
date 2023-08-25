import MainLayout from '../layouts/MainLayout'
import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'expo-router'
import { ActivityIndicator, Button, Divider, Text } from 'react-native-paper'
import HeaderText from '../components/HeaderText'
import { showErrorToast } from '../utils/ToastUtils'
import { getListController, getPartyController, getUserInfo } from '../utils/ApiUtils'
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
import { IS_CURRENTLY_PARTY_OWNER, storage } from '../utils/StorageUtils'

export default function App() {
    const router = useRouter()
    let pathname = usePathname()
    let [initialLoading, setInitialLoading] = useState(true)
    let [userInfo, setUserInfo] = useState<CoflnetSongVoterModelsUserInfo | null>()
    let [party, setParty] = useState<CoflnetSongVoterModelsParty>()
    let [playlist, setPlaylist] = useState<CoflnetSongVoterModelsPartyPlaylistEntry[]>()
    let [currentSong, setCurrentSong] = useState<CoflnetSongVoterModelsSong>()
    let [isYoutubePlayerPlaying, setIsYoutubePlayerPlaying] = useState(true)
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
            await Promise.all([loadParty(), loadSongs(), loadUserInfo()])
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
            if (userInfo.userId === party.ownerId) {
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
            let s = await partyController.partyPlaylistGet()
            setPlaylist(s)
            return s
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
                return
            }
            showErrorToast(e)
        }
    }

    async function findCurrentlyPlayingSongOrStartNext() {
        let songData = await getCurrentlyPlayingSongDataFromSpotify()
        if (!songData || !songData.is_playing) {
            startNextSong()
        } else {
            if (!playlistRef.current) {
                let songs = await loadSongs()
                setPlaylist(songs)
                playlistRef.current = songs
            }
            let song = playlistRef.current.find(playlistEntry => playlistEntry.song.occurences[0].externalId === songData.item.id)
            if (song) {
                setCurrentSong(song.song)
            }
        }
    }

    async function startNextSong() {
        if (userInfo.userId !== party.ownerId) {
            return
        }
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
            await partyController.partyLeavePost()
            if (cancelSongSubscriptionRef.current) {
                cancelSongSubscriptionRef.current()
            }
            if (BackgroundService.isRunning()) {
                BackgroundService.stop()
            }
            storage.set(IS_CURRENTLY_PARTY_OWNER, false)
            if (currentSong.occurences[0].platform === 'spotify') {
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

    async function addSongsToParty() {
        return
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

    async function togglePlayback() {
        if (currentSong.occurences[0].platform === 'spotify') {
            let playbackState = await getSpotifyPlaybackState()
            if (playbackState.is_playing) {
                await pauseSpotifySongPlayback()
            } else {
                await resumeSpotifySongPlayback()
            }
        }
        if (currentSong.occurences[0].platform === 'youtube') {
            setIsYoutubePlayerPlaying(!isYoutubePlayerPlaying)
        }
    }

    async function onLikeButtonPress(playlistEntry: CoflnetSongVoterModelsPartyPlaylistEntry) {
        if (playlistEntry.selfVote === 'up') {
            removeVote(playlistEntry)
            return
        }
        let controller = await getPartyController()
        await controller.partyUpvoteSongIdPost({
            songId: playlistEntry.song.id
        })
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
        await controller.partyDownvoteSongIdPost({
            songId: playlistEntry.song.id
        })
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
        await controller.partyRemoveVoteSongIdPost({
            songId: playlistEntry.song.id
        })
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
                <ScrollView>
                    <HeaderText text={party ? `Party ${party?.name}` : null} />
                    <Button onPress={togglePlayback}>Pause/Resume</Button>
                    {initialLoading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <>
                            {currentSong && currentSong.occurences[0].platform === 'youtube' && userInfo?.userId === party.ownerId ? (
                                <YoutubePlayer
                                    videoId={currentSong.occurences[0].externalId}
                                    playing={isYoutubePlayerPlaying}
                                    onVideoHasEnded={startNextSong}
                                />
                            ) : null}
                            <SongList
                                songs={playlist.map(p => p.song)}
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
                                <Button textColor="white" onPress={addSongsToParty} style={styles.addSongsButton}>
                                    Add your songs
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
    addSongsButton: {
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
