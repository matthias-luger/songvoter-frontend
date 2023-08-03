import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { showErrorToast } from './ToastUtils'
import { getUserController } from './ApiUtils'

export async function playSpotifySong(songId: string) {
    try {
        let userController = await getUserController()
        let token = await userController.userInfoGet()
        let devicesResponse = await fetch(`https://api.spotify.com/v1/me/player/devices`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.spotifyToken}`,
                'Content-Type': 'application/json'
            }
        })
        let res = await devicesResponse.json()

        if (res.error && res.error.status === 401) {
            Toast.show({
                type: 'info',
                text1: `Error authenticating with Spotify.`,
                text2: `Please try logging in again with Spotify`
            })
            return
        }

        let devices = res.devices

        if (!devices || devices.length === 0) {
            Toast.show({
                type: 'info',
                text1: `No active Spotify device found`,
                text2: `Please try starting Spotify`
            })
            return
        }

        let deviceToUse = devices.filter(device => device.is_active)[0] || devices[0]

        let playResponse = await fetch(`https://api.spotify.com/v1/me/player/play?${deviceToUse ? 'device_id=' + deviceToUse.id : null}`, {
            method: 'PUT',
            body: JSON.stringify({
                uris: [`spotify:track:${songId}`],
                position_ms: 0,
                offset: {
                    position: 0
                }
            }),
            headers: {
                Authorization: `Bearer ${token.spotifyToken}`,
                'Content-Type': 'application/json'
            }
        })

        if (playResponse.status !== 204) {
            Toast.show({
                type: 'error',
                text1: `Couldn't start Spotify playback`,
                text2: `(Status ${playResponse.status})`
            })
            return
        }
    } catch (e) {
        showErrorToast(e)
    }
}

export async function getCurrentlyPlayingSongDataFromSpotify() {
    try {
        let userController = await getUserController()
        let token = await userController.userInfoGet()
        let response = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.spotifyToken}`,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            Toast.show({
                type: 'error',
                text1: `Couldn't fetch currently playing song information`,
                text2: `(Status ${response.status})`
            })
            return
        }

        let data = await response.json()
        return data as {
            progress_ms: number
            is_playing: boolean
            item: {
                id: number
                duration_ms: number
            }
        }
    } catch (e) {
        showErrorToast(e)
    }
}

export function subscribeToCurrentlyPlayingSongEnd(onSongEnd: Function): Function {
    let abort = false

    async function waitForSongEnd() {
        let currentSongData = await getCurrentlyPlayingSongDataFromSpotify()
        if (abort) {
            return
        }
        let timeLeft = currentSongData.item.duration_ms - currentSongData.progress_ms
        if (isNaN(timeLeft)) {
            Toast.show({
                type: 'error',
                text1: `Couldn't update playstate for next song. Trying again in 10 seconds...`,
                text2: `${timeLeft}`
            })
        }

        async function timeoutFunction() {
            if (abort) {
                return
            }
            let currentSongData = await getCurrentlyPlayingSongDataFromSpotify()
            let timeLeft = currentSongData.item.duration_ms - currentSongData.progress_ms
            if (isNaN(timeLeft)) {
                Toast.show({
                    type: 'error',
                    text1: `Couldn't update playstate for next song. Trying again in 10 seconds...`,
                    text2: `${timeLeft}`
                })
                setTimeout(() => {
                    timeoutFunction()
                }, 10000)
                return
            }
            let isOver = currentSongData.progress_ms == 0 && currentSongData.is_playing == false
            if (timeLeft < 500 || isOver) {
                onSongEnd()
            } else {
                setTimeout(timeoutFunction, timeLeft)
            }
        }
        setTimeout(timeoutFunction, timeLeft - 100)
    }

    waitForSongEnd()

    return () => {
        abort = true
    }
}
