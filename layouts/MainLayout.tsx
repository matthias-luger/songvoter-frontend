import { StatusBar } from 'expo-status-bar'
import { Box, NativeBaseProvider, extendTheme } from 'native-base'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet } from 'react-native'
import { FooterNavigation } from '../components/FooterNavigation'

const theme = extendTheme({
    useSystemColorMode: false,
    initialColorMode: 'dark'
})

export default function MainLayout(props) {
    return (
        <NativeBaseProvider config={{ theme }}>
            <SafeAreaProvider>
                <StatusBar style="auto" />
                <SafeAreaView>
                    <View style={styles.view}>
                        <Box style={styles.container}>{props.children}</Box>
                        <Box style={styles.footer}>
                            <FooterNavigation />
                        </Box>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    view: {
        height: '100%'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    footer: {}
})
