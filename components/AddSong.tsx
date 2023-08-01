import { ActivityIndicator, Button, IconButton, List, MD3Colors, Text, TextInput } from 'react-native-paper'
import { showErrorToast } from '../utils/ToastUtils'
import { useState } from 'react'
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
            setIsLoading(true)
            setResults([])
            let controller = await getSongController()
            let results = await controller.songsSearchGet({
                term: searchText
            })
            setResults(results)
        } catch (e) {
            showErrorToast(e)
        } finally {
            setIsLoading(false)
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
                        <ActivityIndicator size="large" />
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
