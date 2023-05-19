import MainLayout from '../layouts/MainLayout'
import { useState } from 'react'
import { ScrollView, StyleSheet, View, Image } from 'react-native'
import { FAB, IconButton, List, Modal, Portal, Text } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import AddSong from '../components/AddSong'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { formatTime } from '../utils/Formatter'
import HeaderText from '../components/HeaderText'
import { SPOTIFY_TOKEN, storage } from '../utils/StorageUtils'
import { showErrorToast } from '../utils/ToastUtils'

export default function YourSongs() {
    let [songs, setSongs] = useState<SpotifyApi.TrackObjectFull[]>([])
    let [showAddSongModal, setShowAddSongModal] = useState(false)

    function onSongAdded(song: SpotifyApi.TrackObjectFull) {
        setShowAddSongModal(false)
        Toast.show({
            type: 'success',
            text1: 'Song added',
            text2: song.name
        })
        setSongs([...songs, song])
    }

    async function playSong(song: SpotifyApi.TrackObjectFull) {
        try {
            await fetch(`https://api.spotify.com/v1/me/player/play`, {
                method: 'PUT',
                body: JSON.stringify({
                    uris: [song.uri],
                    position_ms: 0,
                    offset: {
                        position: 0
                    }
                }),
                headers: {
                    Authorization: `Bearer ${storage.getString(SPOTIFY_TOKEN)}`,
                    'Content-Type': 'application/json'
                }
            })
        } catch (e) {
            console.error(JSON.stringify(e))
            showErrorToast(e)
        }
    }

    return (
        <MainLayout>
            <HeaderText text="Your Songs" />
            <ScrollView>
                {songs.map(song => {
                    return (
                        <List.Item
                            key={song.id}
                            title={song.name}
                            descriptionEllipsizeMode={'middle'}
                            description={
                                <View>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200 }}>
                                        {song.artists.map(artist => artist.name).join(' • ')}
                                    </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200 }}>
                                        {formatTime(song.duration_ms)} min
                                    </Text>
                                </View>
                            }
                            left={() => <Image style={{ width: 64 }} source={{ uri: song.album.images[0]?.url }} />}
                            right={() => <IconButton icon="play" mode="outlined" iconColor={'lime'} size={20} onPress={() => playSong(song)} />}
                        />
                    )
                })}
            </ScrollView>
            <FAB
                icon="plus"
                label="Add song"
                style={styles.fab}
                onPress={() => {
                    setShowAddSongModal(true)
                }}
            />
            <Portal>
                <Modal
                    visible={showAddSongModal}
                    onDismiss={() => {
                        setShowAddSongModal(false)
                    }}
                    contentContainerStyle={{ ...globalStyles.fullModalContainer }}
                >
                    <AddSong onAddSong={onSongAdded} />
                </Modal>
            </Portal>
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
