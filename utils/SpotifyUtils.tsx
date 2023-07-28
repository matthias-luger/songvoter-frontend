import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { showErrorToast } from './ToastUtils'
import { getUserController } from './ApiUtils'

export async function playSpotifySong(songId: string) {
    try {
        let userController = await getUserController()
        let token = await userController.userSpotifyTokenGet()
        let devicesResponse = await fetch(`https://api.spotify.com/v1/me/player/devices`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        let { devices }: { devices: SpotifyApi.UserDevice[] } = await devicesResponse.json()

        if (devices.length === 0) {
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
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if (playResponse.status !== 204) {
            Toast.show({
                type: 'error',
                text1: `Couldn't start Spotify playback (Status ${playResponse.status})`
            })
        }
    } catch (e) {
        console.error(JSON.stringify(e))
        showErrorToast(e)
    }
}
