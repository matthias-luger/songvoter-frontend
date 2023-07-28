import React, { useState, useCallback, useRef } from 'react'
import { Button, View, Alert } from 'react-native'
import { default as YoutubePlayerWebview } from 'react-native-youtube-iframe'

interface Props {
    videoId: string
}

export default function YoutubePlayer(props: Props) {
    const [playing, setPlaying] = useState(false)

    const onStateChange = useCallback(state => {
        if (state === 'ended') {
            setPlaying(false)
            Alert.alert('video has finished playing!')
        }
    }, [])

    const togglePlaying = useCallback(() => {
        setPlaying(prev => !prev)
    }, [])

    return (
        <View>
            <YoutubePlayerWebview height={300} play={playing} videoId={props.videoId} onChangeState={onStateChange} />
            <Button title={playing ? 'pause' : 'play'} onPress={togglePlaying} />
        </View>
    )
}
