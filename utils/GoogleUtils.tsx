import { User } from '@react-native-google-signin/google-signin'
import { GoogleData } from '../types/global'

let userData: GoogleData

export function getCurrentUserInfo(): GoogleData {
    return userData
}

export function setCurrentUserInfo(userInfo: GoogleData) {
    userData = userInfo
}
