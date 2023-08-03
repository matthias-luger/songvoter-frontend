import React, { useState, useCallback, useRef } from 'react'
import { View } from 'react-native'
import { default as YoutubePlayerWebview } from 'react-native-youtube-iframe'

interface Props {
    videoId: string
    autoplay?: boolean
    onVideoHasEnded?(): any
}

export default function YoutubePlayer(props: Props) {
    const [playing, setPlaying] = useState(props.autoplay || false)

    const onStateChange = useCallback(state => {
        if (state === 'ended') {
            setPlaying(false)
            props.onVideoHasEnded()
        }
    }, [])

    return (
        <View>
            <YoutubePlayerWebview height={240} play={playing} videoId={props.videoId} onChangeState={onStateChange} />
        </View>
    )
}
