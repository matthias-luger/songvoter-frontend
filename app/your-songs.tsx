import MainLayout from '../layouts/MainLayout'
import { useState } from 'react'
import { ScrollView, StyleSheet, View, Image } from 'react-native'
import { FAB, List, Modal, Portal, Text } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import AddSong from '../components/AddSong'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { formatTime } from '../utils/Formatter'
import HeaderText from '../components/HeaderText'

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
