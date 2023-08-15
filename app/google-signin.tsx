import { StyleSheet, View } from 'react-native'
import MainLayout from '../layouts/MainLayout'
import HeaderText from '../components/HeaderText'
import GoogleLogin from '../components/GoogleLogin'
import { globalStyles } from '../styles/globalStyles'
import { router } from 'expo-router'

export default function GoogleSigninPage() {
    function onAfterLogin() {
        router.push('/')
    }

    return (
        <>
            <MainLayout routes={[]}>
                <View style={globalStyles.fullCenterContainer}>
                    <HeaderText text={'Login'} />
                    <GoogleLogin onAfterLogin={onAfterLogin} />
                </View>
            </MainLayout>
        </>
    )
}

const styles = StyleSheet.create({
    leaveButton: {
        width: '100%',
        display: 'flex',
        backgroundColor: 'red'
    },
    addSongsButton: {
        width: '45%',
        backgroundColor: 'blue'
    },
    inviteButton: {
        width: '45%',
        backgroundColor: 'blue'
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 10
    }
})
