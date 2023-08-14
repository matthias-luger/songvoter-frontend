import { ActivityIndicator, Button, IconButton, List, MD3Colors, Text, TextInput } from 'react-native-paper'
import { showErrorToast } from '../utils/ToastUtils'
import { useRef, useState } from 'react'
import { ScrollView, Image, View, StyleSheet } from 'react-native'
import { getSongController } from '../utils/ApiUtils'
import { CoflnetSongVoterModelsSong } from '../generated'
import SongListElement from './SongListElement'

interface Props {
    onAddSong(song: CoflnetSongVoterModelsSong)
}

export default function AddSong(props: Props) {
    let [results, setResults] = useState<CoflnetSongVoterModelsSong[]>([])
    let [isLoading, setIsLoading] = useState<boolean>()
    let [showLongLoadingText, setShowLongLoadingText] = useState(false)
    let searchTextRef = useRef('')

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

    let searchFunction = debounce(search, 500)

    return (
        <>
            <TextInput
                label={'Search...'}
                onChangeText={text => {
                    searchFunction(text)
                }}
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
                                clickElement={<IconButton icon="plus" mode="outlined" iconColor={'lime'} size={20} onPress={() => props.onAddSong(result)} />}
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
