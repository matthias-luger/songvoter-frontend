import React, { useState, useCallback, useRef } from 'react'
import { Button, View, Alert } from 'react-native'
import { default as YoutubePlayerWebview } from 'react-native-youtube-iframe'

export default function YoutubePlayer() {
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
            <YoutubePlayerWebview height={300} play={playing} videoId={'fPO76Jlnz6c'} onChangeState={onStateChange} />
            <Button title={playing ? 'pause' : 'play'} onPress={togglePlaying} />
        </View>
    )
}
