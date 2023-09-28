import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { showErrorToast } from './ToastUtils'
import { getUserController, getUserInfo } from './ApiUtils'

async function getSpotifyDevices(): Promise<any[] | null> {
    try {
        let token = await getUserInfo()
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

        let devices: any[] = res.devices

        if (!devices || devices.length === 0) {
            Toast.show({
                type: 'info',
                text1: `No active Spotify device found`,
                text2: `Please try starting Spotify`
            })
        }
        return devices
    } catch (e) {
        showErrorToast(e)
    }
    return null
}

export async function getSpotifyPlaybackState() {
    try {
        let token = await getUserInfo()
        let playResponse = await fetch(`https://api.spotify.com/v1/me/player`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.spotifyToken}`,
                'Content-Type': 'application/json'
            }
        })
        if (!playResponse.ok) {
            Toast.show({
                type: 'error',
                text1: `Couldn't get Spotify Playback State`,
                text2: `(Status ${playResponse.status})`
            })
            return
        }
        return (await playResponse.json()) as {
            item?: {}
            is_playing: boolean
        }
    } catch (e) {
        showErrorToast(e)
    }
}

export async function pauseSpotifySongPlayback() {
    let playbackState = await getSpotifyPlaybackState()
    if (!playbackState.is_playing) {
        return
    }
    try {
        let token = await getUserInfo()
        let devices = await getSpotifyDevices()
        if (!devices) {
            return
        }
        let deviceToUse = devices.filter(device => device.is_active)[0] || devices[0]
        let playResponse = await fetch(`https://api.spotify.com/v1/me/player/pause?${deviceToUse ? 'device_id=' + deviceToUse.id : null}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token.spotifyToken}`,
                'Content-Type': 'application/json'
            }
        })
        if (!playResponse.ok) {
            Toast.show({
                type: 'error',
                text1: `Couldn't pause Spotify Playback`,
                text2: `(Status ${playResponse.status})`
            })
            return
        }
    } catch (e) {
        showErrorToast(e)
    }
}

export async function resumeSpotifySongPlayback() {
    try {
        let token = await getUserInfo()
        let devices = await getSpotifyDevices()
        if (!devices) {
            return
        }
        let deviceToUse = devices.filter(device => device.is_active)[0] || devices[0]
        let playResponse = await fetch(`https://api.spotify.com/v1/me/player/play?${deviceToUse ? 'device_id=' + deviceToUse.id : null}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token.spotifyToken}`,
                'Content-Type': 'application/json'
            }
        })
        if (!playResponse.ok) {
            Toast.show({
                type: 'error',
                text1: `Couldn't resume Spotify Playback`,
                text2: `(Status ${playResponse.status})`
            })
            return
        }
    } catch (e) {
        showErrorToast(e)
    }
}

export async function playSpotifySong(songId: string) {
    try {
        let token = await getUserInfo()
        let devices = await getSpotifyDevices()
        if (!devices) {
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
        let token = await getUserInfo()
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
        if (response.status === 204) {
            return null
        }

        let data = await response.json()
        return data as {
            progress_ms: number
            is_playing: boolean
            item: {
                id: string
                duration_ms: number
            }
        }
    } catch (e) {
        showErrorToast(e)
    }
}

let currentTimeout
export function subscribeToCurrentlyPlayingSongEnd(onSongEnd: Function, songDuration: number): Function {
    if (currentTimeout) {
        clearTimeout(currentTimeout)
    }

    let abort = false
    async function timeoutFunction() {
        if (abort) {
            return
        }

        let currentSongData = await getCurrentlyPlayingSongDataFromSpotify()
        if (!currentSongData || !currentSongData.item) {
            console.log('No current song data: ' + JSON.stringify(currentSongData))
            return
        }
        let timeLeft = currentSongData.item.duration_ms - currentSongData.progress_ms
        if (isNaN(timeLeft)) {
            Toast.show({
                type: 'error',
                text1: `Couldn't update playstate for next song. Trying again in 10 seconds...`,
                text2: `${timeLeft}`
            })
            currentTimeout = setTimeout(() => {
                timeoutFunction()
            }, 10000)
            return
        }
        if (timeLeft < 1000 || (!currentSongData.is_playing && currentSongData.progress_ms === 0)) {
            onSongEnd()
        } else {
            currentTimeout = setTimeout(timeoutFunction, timeLeft)
        }
    }
    currentTimeout = setTimeout(timeoutFunction, songDuration - 500)

    return () => {
        abort = true
    }
}

export async function getSpotifyPlaylists() {
    try {
        let token = await getUserInfo()
        let response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=50`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.spotifyToken}`,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            Toast.show({
                type: 'error',
                text1: `Couldn't fetch playlist information`,
                text2: `(Status ${response.status})`
            })
            return
        }
        if (response.status === 204) {
            return []
        }

        let data = await response.json()
        return data.items as {
            items: {
                id: string
                href: number
                images?: { url: string; height: number; width: number }[]
                name: string
                tracks: {
                    href: string
                    total: number
                }
                uri: string
            }[]
        }
    } catch (e) {
        showErrorToast(e)
    }
}
