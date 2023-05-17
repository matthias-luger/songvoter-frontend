import { User } from '@react-native-google-signin/google-signin'
import { TokenResponse } from 'expo-auth-session'

interface GoogleData extends User {
    serverToken?: string
}

interface SpotifyAuthentication extends TokenResponse {}
