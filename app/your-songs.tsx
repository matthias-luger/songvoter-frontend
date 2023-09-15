import MainLayout from '../layouts/MainLayout'
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { ActivityIndicator, FAB, IconButton, List, Modal, Portal, Text } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import AddSong from '../components/AddSong'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import HeaderText from '../components/HeaderText'
import { showErrorToast } from '../utils/ToastUtils'
import { CoflnetSongVoterModelsPlayList, CoflnetSongVoterModelsSong } from '../generated'
import { getListController } from '../utils/ApiUtils'
import SongList from '../components/SongList'
import { IS_CURRENTLY_PARTY_OWNER, YOUR_SONGS, storage } from '../utils/StorageUtils'

export default function YourSongs() {
    let [playlists, setPlaylists] = useState<CoflnetSongVoterModelsPlayList[]>(storage.contains(YOUR_SONGS) ? JSON.parse(storage.getString(YOUR_SONGS)) : [])
    let [showAddSongModal, setShowAddSongModal] = useState(false)
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
            let playlists = await listController.apiListsGet()

            if (playlists?.length === 0) {
                await listController.apiListsPost({
                    coflnetSongVoterModelsPlayListCreate: {
                        title: 'Default Playlist',
                        songs: []
                    }
                })
                playlists = await listController.apiListsGet()
            }
            storage.set(YOUR_SONGS, JSON.stringify(playlists))
            setPlaylists(playlists)
        } catch (e) {
            showErrorToast(e)
        } finally {
            setIsLoading(false)
        }
    }

    async function onAfterSongAdded(song: CoflnetSongVoterModelsSong) {
        let newPlaylists = [...playlists]
        newPlaylists[0].songs.push(song)
        storage.set(YOUR_SONGS, JSON.stringify(playlists))
        setPlaylists(newPlaylists)
    }

    async function removeSong(song: CoflnetSongVoterModelsSong) {
        try {
            let listController = await getListController()
            await listController.apiListsListIdSongsSongIdDelete({
                listId: playlists[0].id,
                songId: song.id
            })
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
            <FAB
                icon="plus"
                label={playlists && playlists.length > 0 && playlists[0].songs && playlists[0].songs?.length > 0 ? 'Add song' : 'Add first song'}
                style={styles.fab}
                onPress={() => {
                    setShowAddSongModal(true)
                }}
            />
            {!isLoading ? (
                <Portal>
                    <Modal
                        visible={showAddSongModal}
                        onDismiss={() => {
                            setShowAddSongModal(false)
                        }}
                        contentContainerStyle={{ ...globalStyles.fullModalContainer }}
                    >
                        <AddSong playlistId={playlists[0]?.id} onAfterSongAdded={onAfterSongAdded} />
                    </Modal>
                </Portal>
            ) : null}
        </MainLayout>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    }
})
