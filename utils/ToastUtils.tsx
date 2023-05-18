import { Toast } from 'react-native-toast-message/lib/src/Toast'

export function showErrorToast(e) {
    Toast.show({
        type: 'error',
        text1: e.message ? e.message : typeof e === 'string' ? e : JSON.stringify(e)
    })
}
