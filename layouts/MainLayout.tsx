import { StatusBar } from 'expo-status-bar'
import { Box, NativeBaseProvider, extendTheme, useColorModeValue } from 'native-base'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet } from 'react-native'
import { FooterNavigation } from '../components/FooterNavigation'
import { SongApiControllerImplApi } from '../generated'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

export default function MainLayout(props) {
    return (
        <>
            <NativeBaseProvider>
                <SafeAreaProvider>
                    <StatusBar style="dark" />
                    <SafeAreaView>
                        <View style={styles.view}>
                            <Box bg={'coolGray.800'} style={styles.container}>
                                {props.children}
                            </Box>
                            <Box style={styles.footer}>
                                <FooterNavigation />
                            </Box>
                        </View>
                    </SafeAreaView>
                </SafeAreaProvider>
            </NativeBaseProvider>
            <Toast />
        </>
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
