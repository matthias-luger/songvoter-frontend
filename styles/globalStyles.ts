import { StyleSheet } from 'react-native'
import { MD3DarkTheme } from 'react-native-paper'

export let globalStyles = StyleSheet.create({
    primaryElement: {
        backgroundColor: MD3DarkTheme.colors.primary,
        color: MD3DarkTheme.colors.onPrimary
    },
    container: {
        backgroundColor: MD3DarkTheme.colors.background
    },
    horizontalCenter: {
        display: 'flex',
        alignItems: 'center'
    },
    surfaceVariant: {
        color: MD3DarkTheme.colors.onSurfaceVariant,
        backgroundColor: MD3DarkTheme.colors.surfaceVariant
    },
    fullCenterContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    fullModalContainer: {
        flex: 1,
        backgroundColor: MD3DarkTheme.colors.background,
        padding: 20
    }
})
