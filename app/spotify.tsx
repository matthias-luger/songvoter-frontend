import { Heading } from 'native-base'
import MainLayout from '../layouts/MainLayout'
import { GoogleLogin } from '../components/GoogleLogin'

export default function Spotify() {
    return (
        <MainLayout>
            <Heading>Spotify</Heading>
            <GoogleLogin />
        </MainLayout>
    )
}
