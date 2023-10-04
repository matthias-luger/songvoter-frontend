import { ActivityIndicator, IconButton, List, Text } from 'react-native-paper'
import { showErrorToast } from '../utils/ToastUtils'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View, StyleSheet, Image } from 'react-native'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { SpotifyPlaylist, getSpotifyPlaylists, getSpotifyTracksForPlaylist } from '../utils/SpotifyUtils'
import HeaderText from './HeaderText'
import { getListController } from '../utils/ApiUtils'

interface Props {
    playlistId?: string
    onAfterPlaylistAdded(playlist: SpotifyPlaylist): Promise<void>
}

interface PlaylistItem extends SpotifyPlaylist {
    addingState?: 'adding' | 'added'
}

export default function AddSpotifyPlaylist(props: Props) {
    let [playlists, setPlaylists] = useState<PlaylistItem[]>([])
    let [isLoading, setIsLoading] = useState<boolean>(true)

    let playlistRef = useRef(playlists)
    playlistRef.current = playlists

    useEffect(() => {
        init()
    }, [])

    async function init() {
        setIsLoading(true)
        let playlists = await getSpotifyPlaylists()
        setPlaylists(playlists)
        setIsLoading(false)
    }

    async function onAddPlaylist(playlist: SpotifyPlaylist) {
        let newPlaylists = [...playlists]
        let s = newPlaylists.find(s => s.id === playlist.id)
        if (s) {
            s.addingState = 'adding'
        }
        setPlaylists(newPlaylists)
        try {
            if (props.playlistId) {
                let tracks = await getSpotifyTracksForPlaylist(playlist.id)
                let listController = await getListController()
                listController.apiListsListIdSongsSpotifyPost(
                    props.playlistId,
                    tracks.map(trackEntry => trackEntry.track.id)
                )
            }

            if (props.onAfterPlaylistAdded) {
                await props.onAfterPlaylistAdded(playlist)
            }

            Toast.show({
                type: 'success',
                text1: 'Playlist added',
                text2: playlist.name
            })
            let newPlaylists = [...playlistRef.current]
            let s = playlistRef.current.find(s => s.id === playlist.id)
            if (s) {
                s.addingState = 'added'
            }
            setPlaylists(newPlaylists)
        } catch (e) {
            showErrorToast(e)
        }
    }

    return (
        <>
            <HeaderText text="Your Spotify Playlists" />
            {
                <ScrollView>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" style={{ marginTop: 25 }} />
                        </View>
                    ) : (
                        playlists.map(result => (
                            <List.Item
                                key={result.id}
                                title={<Text>{result.name}</Text>}
                                descriptionEllipsizeMode={'middle'}
                                description={
                                    <View>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200 }}>
                                            {result.description}
                                        </Text>
                                    </View>
                                }
                                left={() => (
                                    <>
                                        <Image style={styles.thumbnail} source={{ uri: result.images[0].url }} />
                                    </>
                                )}
                                right={() =>
                                    !result.addingState ? (
                                        <IconButton icon="plus" mode="outlined" iconColor={'lime'} size={20} onPress={() => onAddPlaylist(result)} />
                                    ) : result.addingState === 'adding' ? (
                                        <ActivityIndicator />
                                    ) : null
                                }
                            />
                        ))
                    )}
                </ScrollView>
            }
        </>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    thumbnail: {
        width: 64,
        marginLeft: 10
    }
})
