import MainLayout from '../layouts/MainLayout'
import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'expo-router'
import { ActivityIndicator, Button, Text } from 'react-native-paper'
import HeaderText from '../components/HeaderText'
import { showErrorToast } from '../utils/ToastUtils'
import { getListController, getPartyController, getUserInfo } from '../utils/ApiUtils'
import { playSpotifySong, subscribeToCurrentlyPlayingSongEnd } from '../utils/SpotifyUtils'
import SongListElement from '../components/SongListElement'
import YoutubePlayer from '../components/YoutubePlayer'
import { CoflnetSongVoterModelsParty, CoflnetSongVoterModelsPartyPlaylistEntry, CoflnetSongVoterModelsSong, CoflnetSongVoterModelsUserInfo } from '../generated'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ScrollView, View } from 'react-native'
import BackgroundService from 'react-native-background-actions'
import { makeRedirectUri } from 'expo-auth-session'

export default function App() {
    const router = useRouter()
    let pathname = usePathname()
    let [initialLoading, setInitialLoading] = useState(true)
    let [userInfo, setUserInfo] = useState<CoflnetSongVoterModelsUserInfo | null>()
    let [party, setParty] = useState<CoflnetSongVoterModelsParty>()
    let [playlist, setPlaylist] = useState<CoflnetSongVoterModelsPartyPlaylistEntry[]>()
    let [currentSong, setCurrentSong] = useState<CoflnetSongVoterModelsSong>()
    let currentSongRef = useRef(currentSong)
    currentSongRef.current = currentSong
    let cancelSongSubscriptionRef = useRef<Function>()

    useEffect(() => {
        async function init() {
            await Promise.all([loadParty(), loadSongs(), loadUserInfo()])
            setInitialLoading(false)
        }
        init()

        return () => {
            if (cancelSongSubscriptionRef.current) {
                cancelSongSubscriptionRef.current()
            }
        }
    }, [])

    useEffect(() => {
        if (!initialLoading) {
            startNextSong()
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
                        // wait a bit, otherwise Spotify serves the old song
                        if (cancelSongSubscriptionRef.current) {
                            cancelSongSubscriptionRef.current()
                        }
                        let i = 0
                        let interval = setInterval(() => {
                            i++
                            BackgroundService.updateNotification({ taskDesc: 'Playing ' + song.occurences[0].title, taskTitle: (i * 10).toString() })
                        }, 10000)
                        await new Promise((resolve, reject) => {
                            /**
                             * cancelSongSubscriptionRef.current = subscribeToCurrentlyPlayingSongEnd(() => {
                                    startNextSong()
                                    i = 0
                                    clearInterval(interval)
                                    resolve(null)
                                })
                             */
                            setTimeout(() => {
                                startNextSong()
                                i = 0
                                clearInterval(interval)
                                resolve(null)
                            }, song.occurences[0].duration)
                        })
                    },
                    {
                        taskName: 'Playing Song',
                        taskTitle: 'Playing Song Title',
                        taskDesc: 'Playing song desc',
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

    async function onLikeButtonPress(playlistEntry: CoflnetSongVoterModelsPartyPlaylistEntry) {
        if (playlistEntry.selfVote === 'up') {
            return
        }
        let controller = await getPartyController()
        await controller.partyUpvoteSongIdPost({
            songId: playlistEntry.song.id
        })
        setPlaylist(null)
        loadSongs()
    }

    async function onDislikeButtonPress(playlistEntry: CoflnetSongVoterModelsPartyPlaylistEntry) {
        if (playlistEntry.selfVote === 'down') {
            return
        }
        let controller = await getPartyController()
        await controller.partyDownvoteSongIdPost({
            songId: playlistEntry.song.id
        })
        setPlaylist(null)
        loadSongs()
    }

    return (
        <>
            <MainLayout>
                <ScrollView>
                    <HeaderText text={party ? `Party ${party?.name}` : null} />
                    {initialLoading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <>
                            <Text>Current Song: {currentSong ? currentSong.title : '-'}</Text>
                            {currentSong && currentSong.occurences[0].platform === 'youtube' && userInfo?.userId === party.ownerId ? (
                                <YoutubePlayer autoplay videoId={currentSong.occurences[0].externalId} onVideoHasEnded={startNextSong} />
                            ) : null}
                            {playlist
                                ? playlist.map(p => (
                                      <SongListElement
                                          key={p.song.id}
                                          song={p.song}
                                          clickElement={
                                              <>
                                                  <View style={{ display: 'flex', marginRight: 15 }}>
                                                      <MaterialCommunityIcons
                                                          onPress={() => {
                                                              onLikeButtonPress(p)
                                                          }}
                                                          name={p.selfVote === 'up' ? 'thumb-up' : 'thumb-up-outline'}
                                                          color={'lime'}
                                                          size={20}
                                                      />
                                                      <Text>{p.upVotes || 0}</Text>
                                                  </View>
                                                  <View style={{ display: 'flex' }}>
                                                      <MaterialCommunityIcons
                                                          onPress={() => {
                                                              onDislikeButtonPress(p)
                                                          }}
                                                          name={p.selfVote === 'down' ? 'thumb-down' : 'thumb-down-outline'}
                                                          color={'red'}
                                                          size={20}
                                                      />
                                                      <Text>{p.downVotes || 0}</Text>
                                                  </View>
                                              </>
                                          }
                                      />
                                  ))
                                : null}
                            <Button onPress={addSongsToParty}>Add your songs to party</Button>
                            <Button onPress={showInviteCode}>Show invite Code</Button>
                            <Button onPress={startNextSong}>Next song</Button>
                            <Button onPress={leaveParty}>Leave</Button>
                        </>
                    )}
                </ScrollView>
            </MainLayout>
        </>
    )
}
