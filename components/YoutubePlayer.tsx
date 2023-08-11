import React, { useState, useCallback, useRef } from 'react'
import { View } from 'react-native'
import { default as YoutubePlayerWebview } from 'react-native-youtube-iframe'

interface Props {
    videoId: string
    onVideoHasEnded?(): any
    playing?: boolean
}

export default function YoutubePlayer(props: Props) {
    const onStateChange = useCallback(state => {
        if (state === 'ended') {
            props.onVideoHasEnded()
        }
    }, [])

    return (
        <View>
            <YoutubePlayerWebview height={240} play={props.playing} videoId={props.videoId} onChangeState={onStateChange} />
        </View>
    )
}
