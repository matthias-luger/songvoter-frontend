import 'react-native-reanimated'
import 'expo-router/entry'
import { registerRootComponent } from 'expo'
import { ExpoRoot } from 'expo-router'

export function App() {
    console.log("a")
    const ctx = require.context('./app')
    console.log("b")
    return <ExpoRoot context={ctx} />
}

registerRootComponent(App)
