import { User } from '@react-native-google-signin/google-signin'

interface GoogleData extends User {
    serverToken?: string
}
