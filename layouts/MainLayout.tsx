import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet } from 'react-native'
import { FooterNavigation } from '../components/FooterNavigation'
import { globalStyles } from '../styles/globalStyles'

export default function MainLayout(props) {
    return (
        <>
            <StatusBar style="dark" />
            <View style={{ ...styles.view, ...globalStyles.container }}>
                <View style={{ ...styles.container }}>{props.children}</View>
                <View style={styles.footer}>
                    <FooterNavigation />
                </View>
            </View>
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
