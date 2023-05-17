import { Box, Heading } from 'native-base'
import MainLayout from '../layouts/MainLayout'
import { useState } from 'react'
import { StyleSheet } from 'react-native'
import GoogleLogin from '../components/GoogleLogin'
import { GoogleData } from '../types/global'
import SpotifyLogin from '../components/SpotifyLogin'

export default function Spotify() {
    return (
        <MainLayout>
            <Heading style={styles.heading} size="2xl">
                Your Songs
            </Heading>
        </MainLayout>
    )
}

const styles = StyleSheet.create({
    heading: {
        color: '#555',
        alignSelf: 'center'
    }
})
