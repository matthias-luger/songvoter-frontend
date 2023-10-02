import React, { useState, useCallback, useEffect } from 'react'
import { AppState, View } from 'react-native'
import { default as YoutubePlayerWebview } from 'react-native-youtube-iframe'

interface Props {
    videoId: string
    onVideoHasEnded?(): any
    playing?: boolean
}

export default function YoutubePlayer(props: Props) {
    let [appIsActive, setAppIsActive] = useState(AppState.currentState === 'active')

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            setAppIsActive(nextAppState === 'active')
        })

        return () => {
            subscription.remove()
        }
    })

    const onStateChange = useCallback(state => {
        if (state === 'ended') {
            props.onVideoHasEnded()
        }
    }, [])

    return (
        <View>
            <YoutubePlayerWebview height={240} play={props.playing && appIsActive} videoId={props.videoId} onChangeState={onStateChange} />
        </View>
    )
}
