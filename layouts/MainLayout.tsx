import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet } from 'react-native'
import { FooterNavigation } from '../components/FooterNavigation'
import { SongApiControllerImplApi } from '../generated'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { useMaterial3Theme } from '@pchmn/expo-material3-theme'
import { MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'

export default function MainLayout(props) {
    return (
        <>
            <StatusBar style="dark" />
            <SafeAreaView>
                <View style={{ ...styles.view, ...globalStyles.container }}>
                    <View style={{ ...styles.container }}>{props.children}</View>
                    <View style={styles.footer}>
                        <FooterNavigation />
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    view: {
        height: '100%'
    },
    container: {
        flex: 1,
        padding: 10
    },
    footer: {
        position: 'relative'
    }
})
