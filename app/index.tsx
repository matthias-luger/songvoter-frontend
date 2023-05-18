import MainLayout from '../layouts/MainLayout'
import { Link, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { GOOGLE_TOKEN, storage } from '../utils/StorageUtils'
import { PartyController } from '../utils/ApiUtils'
import { CoflnetSongVoterModelsParty } from '../generated'
import SpotifyLogin from '../components/SpotifyLogin'
import { ActivityIndicator, Button, useTheme } from 'react-native-paper'
import { View, Text, StyleSheet } from 'react-native'
import { globalStyles } from '../styles/globalStyles'
import { showErrorToast } from '../utils/ToastUtils'
import HeaderText from '../components/HeaderText'

export default function App() {
    const router = useRouter()
    let theme = useTheme()
    let [isLoading, setIsLoading] = useState(storage.getString(GOOGLE_TOKEN) !== undefined)

    useEffect(() => {
        checkIfUserIsInParty()
    }, [])

    async function checkIfUserIsInParty() {
        if (!storage.getString(GOOGLE_TOKEN)) {
            setIsLoading(false)
            return
        }
        try {
            let party = await PartyController.partyGet()
            if (party) {
                router.push('/party-overview')
            }
        } catch (e) {
            if (e.response?.status === 404) {
                // User is not in a party, do nothing
                return
            }
            console.error(JSON.stringify(e))
            showErrorToast(e)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <>
                <MainLayout>
                    <View style={globalStyles.fullCenterContainer}>
                        <ActivityIndicator />
                    </View>
                </MainLayout>
            </>
        )
    }

    return (
        <>
            <MainLayout>
                <View style={globalStyles.fullCenterContainer}>
                    <HeaderText text="SongVoter" />
                    <Link asChild href="/invite-party">
                        <Button style={{ ...globalStyles.primaryElement, ...styles.button }} textColor={theme.colors.onPrimary}>
                            Create Party
                        </Button>
                    </Link>

                    <Link asChild href="/join-party">
                        <Button style={{ ...globalStyles.primaryElement, ...styles.button }} textColor={theme.colors.onPrimary}>
                            Join Party
                        </Button>
                    </Link>
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
