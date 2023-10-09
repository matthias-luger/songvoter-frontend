import { router } from 'expo-router'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

export let lastErrorObject

export function showErrorToast(e) {
    lastErrorObject = e
    Toast.show({
        type: 'error',
        text1: e.message ? e.message : typeof e === 'string' ? e : JSON.stringify(e),
        text2: e.response ? e.response.data : null,
        onPress: () => {
            router.push('/error')
        }
    })
}

export async function showSpotifyErrorToast(response: Response) {
    if (response.ok) {
        return
    }

    let message = ''
    try {
        message = await response.json()
    } catch {
        try {
            message = await response.text()
        } catch {}
    }
    lastErrorObject = {
        ...response,
        data: message
    }

    if (response.status === 401) {
        Toast.show({
            type: 'error',
            text1: `Spotify Authentication Error`,
            text2: `Please try to login with Spotify again.`,
            onPress: () => {
                router.push('/error')
            }
        })
        return
    }
    if (response.status === 403) {
        Toast.show({
            type: 'error',
            text1: `Spotify Authentication Error`,
            text2: `Please make sure you have Spotify Premium.`,
            onPress: () => {
                router.push('/error')
            }
        })
        return
    }
    if (response.status === 429) {
        Toast.show({
            type: 'error',
            text1: `Spotify rate limit error`,
            text2: `You sent too many requests.`,
            onPress: () => {
                router.push('/error')
            }
        })
        return
    }
    try {
        let body = await response.json()
        Toast.show({
            type: 'error',
            text1: `Spotify Error: ${body.message}`,
            text2: `Status: ${response.status}`,
            onPress: () => {
                router.push('/error')
            }
        })
    } catch (e) {
        Toast.show({
            type: 'error',
            text1: `Spotify Error`,
            text2: response.url,
            onPress: () => {
                router.push('/error')
            }
        })
    }
}
