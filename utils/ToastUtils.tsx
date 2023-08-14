import { router } from 'expo-router'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

export let lastErrorObject

export function showErrorToast(e) {
    lastErrorObject = e
    console.log(JSON.stringify(e))
    Toast.show({
        type: 'error',
        text1: e.message ? e.message : typeof e === 'string' ? e : JSON.stringify(e),
        onPress: () => {
            router.push('/error')
        }
    })
}
