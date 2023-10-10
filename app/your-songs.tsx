import MainLayout from '../layouts/MainLayout'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, FAB, IconButton, List, Modal, Portal, Text } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import AddSong from '../components/AddSong'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import HeaderText from '../components/HeaderText'
import { showErrorToast } from '../utils/ErrorUtils'
import { CoflnetSongVoterModelsPlayList, CoflnetSongVoterModelsSong } from '../generated'
import { getListController } from '../utils/ApiUtils'
import SongList from '../components/SongList'
import { IS_CURRENTLY_PARTY_OWNER, PLATFORMS_USED_IN_SEARCH, SPOTIFY_TOKEN, YOUR_SONGS, storage } from '../utils/StorageUtils'
import AddSpotifyPlaylist from '../components/AddSpotifyPlaylist'

export default function YourSongs() {
    let [playlists, setPlaylists] = useState<CoflnetSongVoterModelsPlayList[]>(storage.contains(YOUR_SONGS) ? JSON.parse(storage.getString(YOUR_SONGS)) : [])
    let [modalElementToShow, setModalElementToShow] = useState(null)
    let [isLoading, setIsLoading] = useState(false)
    let [isCurrentlyPartyOwner] = useState(storage.getBoolean(IS_CURRENTLY_PARTY_OWNER) === true)

    useEffect(() => {
        if (!storage.contains(YOUR_SONGS)) {
            loadPlaylists()
        }
    }, [])

    async function loadPlaylists() {
        try {
            setIsLoading(true)
            let listController = await getListController()
            let playlists = (await listController.apiListsGet()).data

            if (playlists?.length === 0) {
                await listController.apiListsPost({
                    title: 'Default Playlist',
                    songs: []
                })
                playlists = (await listController.apiListsGet()).data
            }
            storage.setWithTTL(YOUR_SONGS, JSON.stringify(playlists), 1000 * 60)
            setPlaylists(playlists)
        } catch (e) {
            showErrorToast(e)
        } finally {
            setIsLoading(false)
        }
    }

    async function onAfterPlaylistAdded() {
        loadPlaylists()
    }

    async function onAfterSongAdded(song: CoflnetSongVoterModelsSong) {
        let newPlaylists = [...playlists]
        newPlaylists[0].songs.push(song)
        storage.setWithTTL(YOUR_SONGS, JSON.stringify(playlists), 1000 * 60)
        setPlaylists(newPlaylists)
    }

    async function removeSong(song: CoflnetSongVoterModelsSong) {
        try {
            let listController = await getListController()
            await listController.apiListsListIdSongsSongIdDelete(playlists[0].id, song.id)
            Toast.show({
                type: 'success',
                text1: 'Song removed',
                text2: song.title
            })
            loadPlaylists()
        } catch (e) {
            showErrorToast(e)
        }
    }

    return (
        <MainLayout>
            <HeaderText text="Your Songs" />
            {isLoading ? <ActivityIndicator size="large" /> : null}
            <SongList
                songs={playlists && playlists.length > 0 ? playlists[0].songs : []}
                getListElementClickElement={song => <IconButton icon="delete" iconColor={'red'} size={20} onPress={() => removeSong(song)} />}
                showPlaySongButton={!isCurrentlyPartyOwner}
            />
            <View style={styles.buttonContainer}>
                <FAB
                    icon="plus"
                    label={playlists && playlists.length > 0 && playlists[0].songs && playlists[0].songs?.length > 0 ? 'Add song' : 'Add first song'}
                    onPress={() => {
                        setModalElementToShow(
                            <AddSong
                                playlistId={playlists[0]?.id}
                                onAfterSongAdded={onAfterSongAdded}
                                platforms={storage.contains(PLATFORMS_USED_IN_SEARCH) ? JSON.parse(storage.getString(PLATFORMS_USED_IN_SEARCH)) : null}
                                showSelectPlatformButton
                            />
                        )
                    }}
                />
                <FAB
                    icon="plus"
                    label={'Add Playlist'}
                    style={{ display: storage.contains(SPOTIFY_TOKEN) ? 'flex' : 'none' }}
                    onPress={() => {
                        setModalElementToShow(<AddSpotifyPlaylist onAfterPlaylistAdded={onAfterPlaylistAdded} playlistId={playlists[0]?.id} />)
                    }}
                />
            </View>
            {!isLoading ? (
                <Portal>
                    <Modal
                        visible={!!modalElementToShow}
                        onDismiss={() => {
                            setModalElementToShow(null)
                        }}
                        contentContainerStyle={{ ...globalStyles.fullModalContainer }}
                    >
                        {modalElementToShow}
                    </Modal>
                </Portal>
            ) : null}
        </MainLayout>
    )
}

const styles = StyleSheet.create({
    addSong: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    },
    addPlaylist: {
        position: 'absolute',
        margin: 16,
        right: 140,
        bottom: 0
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: 5,
        position: 'absolute',
        bottom: 10,
        left: 10
    }
})
