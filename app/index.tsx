import { Button, Heading } from 'native-base'
import { StyleSheet } from 'react-native'
import MainLayout from '../layouts/MainLayout'
import { Link } from 'expo-router'

export default function App() {
    return (
        <>
            <MainLayout>
                <Heading size="3xl" style={styles.heading}>
                    SongVoter
                </Heading>
                <Link asChild href="/invite-party">
                    <Button style={styles.button} variant={'subtle'}>
                        Create Party
                    </Button>
                </Link>

                <Link asChild href="/join-party">
                    <Button style={styles.button} variant={'subtle'}>
                        Join Party
                    </Button>
                </Link>
            </MainLayout>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        width: '50%'
    },
    heading: {
        color: '#555'
    }
})
