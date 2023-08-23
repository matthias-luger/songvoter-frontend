import { IconButton, Modal, Portal } from 'react-native-paper'
import { CoflnetSongVoterModelsSong } from '../generated'
import { useEffect, useState } from 'react'
import YoutubePlayer from './YoutubePlayer'
import { globalStyles } from '../styles/globalStyles'
import { pauseSpotifySongPlayback, playSpotifySong } from '../utils/SpotifyUtils'
import SongListElement from './SongListElement'
import { ScrollView } from 'react-native-gesture-handler'

interface Props {
    songs: CoflnetSongVoterModelsSong[]
    getListElementClickElement(song: CoflnetSongVoterModelsSong): JSX.Element
    playingSong?: CoflnetSongVoterModelsSong
    showPlaySongButton?: boolean
}

export default function SongList(props: Props) {
    let [currentlyPlayingSong, setCurrentlyPlayingSong] = useState(props.playingSong)
    let [showYoutubeModal, setShowYoutubeModal] = useState(false)

    useEffect(() => {
        setCurrentlyPlayingSong(props.playingSong)
    }, [props.playingSong])

    async function playSong(song: CoflnetSongVoterModelsSong) {
        setCurrentlyPlayingSong(song)
        if (song.occurences[0].platform === 'youtube') {
            setShowYoutubeModal(true)
            return
        }
        if (song.occurences[0].platform === 'spotify') {
            await playSpotifySong(song.occurences[0].externalId)
            return
        }
    }

    async function pauseSong(song: CoflnetSongVoterModelsSong) {
        setCurrentlyPlayingSong(null)
        if (song.occurences[0].platform === 'youtube') {
            setShowYoutubeModal(false)
            return
        }
        if (song.occurences[0].platform === 'spotify') {
            await pauseSpotifySongPlayback()
            return
        }
    }

    function isCurrentlyPlaying(song: CoflnetSongVoterModelsSong) {
        return currentlyPlayingSong && currentlyPlayingSong.id === song.id
    }

    function getPlayIcon(song: CoflnetSongVoterModelsSong) {
        if (!props.showPlaySongButton) {
            return isCurrentlyPlaying(song) ? (
                <IconButton icon="equalizer" style={{ position: 'absolute', zIndex: 100, marginLeft: 22 }} iconColor="lime" />
            ) : null
        }
        if (isCurrentlyPlaying(song)) {
            return (
                <IconButton
                    icon="pause"
                    onPress={
                        props.showPlaySongButton
                            ? () => {
                                  pauseSong(song)
                              }
                            : null
                    }
                />
            )
        }
        return (
            <IconButton
                icon="play"
                onPress={() => {
                    playSong(song)
                }}
                style={{ marginLeft: 0 }}
            />
        )
    }

    return (
        <ScrollView>
            {props.songs.map(song => (
                <SongListElement
                    song={song}
                    isPlaying={isCurrentlyPlaying(song)}
                    clickElement={props.getListElementClickElement(song)}
                    playButtonElement={getPlayIcon(song)}
                />
            ))}
            <Portal>
                <Modal
                    visible={showYoutubeModal}
                    dismissable
                    onDismiss={() => {
                        setShowYoutubeModal(false)
                    }}
                    contentContainerStyle={{ ...globalStyles.fullModalContainer }}
                >
                    {currentlyPlayingSong ? <YoutubePlayer videoId={currentlyPlayingSong.occurences[0].externalId} playing /> : null}
                </Modal>
            </Portal>
        </ScrollView>
    )
}
