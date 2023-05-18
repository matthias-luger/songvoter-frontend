import { Button, IconButton, List, MD3Colors, Text, TextInput } from 'react-native-paper'
import { SPOTIFY_TOKEN, storage } from '../utils/StorageUtils'
import { showErrorToast } from '../utils/ToastUtils'
import { useState } from 'react'
import { ScrollView, Image, View, StyleSheet } from 'react-native'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { formatTime } from '../utils/Formatter'

interface Props {
    onAddSong(song: SpotifyApi.TrackObjectFull)
}

export default function AddSong(props: Props) {
    let [results, setResults] = useState<SpotifyApi.TrackObjectFull[]>([])

    function debounce(func, delay) {
        let timeoutId

        return function (...args) {
            clearTimeout(timeoutId)

            timeoutId = setTimeout(() => {
                func.apply(this, args)
            }, delay)
        }
    }

    async function search(searchText: string) {
        if (!searchText) {
            return
        }
        try {
            let response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchText)}&type=track&limit=20`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${storage.getString(SPOTIFY_TOKEN)}`
                }
            })
            let result = await response.json()
            setResults(result.tracks?.items || [])
        } catch (e) {
            console.error(JSON.stringify(e))
            showErrorToast(e)
        }
    }

    let searchFunction = debounce(search, 500)

    return (
        <>
            <TextInput
                label={'Search...'}
                onChangeText={text => {
                    searchFunction(text)
                }}
            />
            <ScrollView>
                {results.map(result => {
                    return (
                        <List.Item
                            key={result.id}
                            title={result.name}
                            descriptionEllipsizeMode={'middle'}
                            description={
                                <View>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200 }}>
                                        {result.artists.map(artist => artist.name).join(' • ')}
                                    </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200 }}>
                                        {formatTime(result.duration_ms)} min
                                    </Text>
                                </View>
                            }
                            left={() => <Image style={{ width: 64 }} source={{ uri: result.album.images[0]?.url }} />}
                            right={() => <IconButton icon="plus" mode="outlined" iconColor={'lime'} size={20} onPress={() => props.onAddSong(result)} />}
                        />
                    )
                })}
            </ScrollView>
        </>
    )
}
