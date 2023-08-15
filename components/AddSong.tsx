import { ActivityIndicator, Button, IconButton, List, MD3Colors, Text, TextInput } from 'react-native-paper'
import { showErrorToast } from '../utils/ToastUtils'
import { useRef, useState } from 'react'
import { ScrollView, Image, View, StyleSheet } from 'react-native'
import { getListController, getSongController } from '../utils/ApiUtils'
import { CoflnetSongVoterModelsSong } from '../generated'
import SongListElement from './SongListElement'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

interface Props {
    playlistId: string
    onAfterSongAdded(song: CoflnetSongVoterModelsSong)
}

interface SongListItem extends CoflnetSongVoterModelsSong {
    addingState?: 'adding' | 'added'
}

export default function AddSong(props: Props) {
    let [results, setResults] = useState<SongListItem[]>([])
    let [isLoading, setIsLoading] = useState<boolean>()
    let [showLongLoadingText, setShowLongLoadingText] = useState(false)
    let searchTextRef = useRef('')

    let resultsRef = useRef(results)
    resultsRef.current = results

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
        searchTextRef.current = searchText
        let timeout
        try {
            setIsLoading(true)
            setResults([])

            timeout = setTimeout(() => {
                setShowLongLoadingText(true)
            }, 3000)

            let controller = await getSongController()
            let results = await controller.songsSearchGet({
                term: searchText
            })
            if (searchText !== searchTextRef.current) {
                return
            }
            setResults(results)
        } catch (e) {
            showErrorToast(e)
        } finally {
            clearTimeout(timeout)
            setIsLoading(false)
            setShowLongLoadingText(false)
        }
    }

    async function onAddSong(song: SongListItem) {
        let songs = [...results]
        let s = songs.find(s => s.id === song.id)
        if (s) {
            s.addingState = 'adding'
        }
        setResults(songs)
        try {
            let listController = await getListController()
            await listController.listsListIdSongsPost({
                listId: props.playlistId,
                coflnetSongVoterModelsSongId: {
                    id: song.id
                }
            })
            Toast.show({
                type: 'success',
                text1: 'Song added',
                text2: song.title
            })
            if (props.onAfterSongAdded) {
                props.onAfterSongAdded(song)
            }
            let newResults = [...resultsRef.current]
            let s = resultsRef.current.find(s => s.id === song.id)
            if (s) {
                s.addingState = 'added'
            }
            setResults(newResults)
        } catch (e) {
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
                autoFocus
            />
            {
                <ScrollView>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" style={{ marginTop: 25 }} />
                            {showLongLoadingText ? (
                                <>
                                    <Text>Fetching new song information.</Text>
                                    <Text>Search might take a bit longer...</Text>
                                </>
                            ) : null}
                        </View>
                    ) : (
                        results.map(result => (
                            <SongListElement
                                key={result.id}
                                song={result}
                                clickElement={
                                    !result.addingState ? (
                                        <IconButton icon="plus" mode="outlined" iconColor={'lime'} size={20} onPress={() => onAddSong(result)} />
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
    }
})
