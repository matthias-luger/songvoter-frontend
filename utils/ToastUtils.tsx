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
