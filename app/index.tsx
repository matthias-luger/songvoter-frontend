import MainLayout from '../layouts/MainLayout'
import { Link, Redirect, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { CURRENT_PARTY, GOOGLE_AUTH_OBJECT, storage } from '../utils/StorageUtils'
import { ActivityIndicator, Button, useTheme } from 'react-native-paper'
import { View, StyleSheet, Linking } from 'react-native'
import { globalStyles } from '../styles/globalStyles'
import { showErrorToast } from '../utils/ToastUtils'
import HeaderText from '../components/HeaderText'
import { getPartyController } from '../utils/ApiUtils'
import Toast from 'react-native-toast-message'

export default function App() {
    const router = useRouter()
    let theme = useTheme()

    useEffect(() => {
        checkDeeplinkIfUserIsInParty()
    }, [])

    if (!storage.contains(GOOGLE_AUTH_OBJECT)) {
        return <Redirect href="/google-signin" />
    }

    if (storage.contains(CURRENT_PARTY)) {
        return <Redirect href="/party-overview" />
    }

    async function checkDeeplinkIfUserIsInParty() {
        let initialURL = await Linking.getInitialURL()
        if (initialURL) {
            Toast.show({
                type: 'success',
                text1: initialURL
            })
            let id = initialURL.split('/invite/')[1]
            try {
                let partyController = await getPartyController()
                await partyController.apiPartyInviteIdJoinPost(id)
            } catch (e) {
                showErrorToast(e)
            }
        }
    }

    return (
        <>
            <MainLayout>
                <View style={globalStyles.fullCenterContainer}>
                    <HeaderText text="SongVoter" />
                    <Button
                        mode="contained"
                        onPress={() => {
                            router.push('/create-party')
                        }}
                        style={styles.button}
                    >
                        Create Party
                    </Button>

                    <Button
                        mode="contained"
                        onPress={() => {
                            router.push('/join-party')
                        }}
                        style={styles.button}
                    >
                        Join Party
                    </Button>
                </View>
            </MainLayout>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        margin: 5,
        width: '50%'
    }
})
