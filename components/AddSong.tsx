import { Button, IconButton, List, MD3Colors, Text, TextInput } from 'react-native-paper'
import { SPOTIFY_TOKEN, storage } from '../utils/StorageUtils'
import { showErrorToast } from '../utils/ToastUtils'
import { useState } from 'react'
import { ScrollView, Image, View, StyleSheet } from 'react-native'
import { formatTime } from '../utils/Formatter'
import { getSongController } from '../utils/ApiUtils'
import { CoflnetSongVoterModelsSong } from '../generated'
import SongListElement from './SongListElement'

interface Props {
    onAddSong(song: CoflnetSongVoterModelsSong)
}

export default function AddSong(props: Props) {
    let [results, setResults] = useState<CoflnetSongVoterModelsSong[]>([])

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
            let controller = await getSongController()
            let results = await controller.songsSearchGet({
                term: searchText
            })
            console.log(JSON.stringify(results))
            setResults(results)
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
                {results.map(result => (
                    <SongListElement
                        song={result}
                        clickElement={<IconButton icon="plus" mode="outlined" iconColor={'lime'} size={20} onPress={() => props.onAddSong(result)} />}
                    />
                ))}
            </ScrollView>
        </>
    )
}
