import MainLayout from '../layouts/MainLayout'
import { Link, Redirect, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { CURRRENT_PARTY, GOOGLE_AUTH_OBJECT, storage } from '../utils/StorageUtils'
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
        checkIfUserIsInParty()
    }, [])

    if (!storage.contains(GOOGLE_AUTH_OBJECT)) {
        return <Redirect href="/google-signin" />
    }

    async function checkIfUserIsInParty() {
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

        if (storage.contains(CURRRENT_PARTY)) {
            router.push('/party-overview')
        }
    }

    return (
        <>
            <MainLayout>
                <View style={globalStyles.fullCenterContainer}>
                    <HeaderText text="SongVoter" />
                    <Button
                        onPress={() => {
                            router.push('/create-party')
                        }}
                        style={{ ...globalStyles.primaryElement, ...styles.button }}
                        textColor={theme.colors.onPrimary}
                    >
                        Create Party
                    </Button>

                    <Button
                        onPress={() => {
                            router.push('/join-party')
                        }}
                        style={{ ...globalStyles.primaryElement, ...styles.button }}
                        textColor={theme.colors.onPrimary}
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
