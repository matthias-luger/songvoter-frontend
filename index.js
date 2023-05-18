import 'react-native-reanimated'
import 'expo-router/entry'
import { registerRootComponent } from 'expo'
import { ExpoRoot } from 'expo-router'
import { MD3DarkTheme, PaperProvider } from 'react-native-paper'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export function App() {
    const ctx = require.context('./app')
    const paperTheme = { ...MD3DarkTheme }

    return (
        <>
            <PaperProvider theme={paperTheme}>
                <SafeAreaProvider>
                    <ExpoRoot context={ctx} />
                </SafeAreaProvider>
            </PaperProvider>
            <Toast />
        </>
    )
}

registerRootComponent(App)
