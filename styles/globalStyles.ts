import { StyleSheet } from 'react-native'
import { MD3DarkTheme } from 'react-native-paper'
import { myTheme } from '../index'

export let globalStyles = StyleSheet.create({
    primaryElement: {
        backgroundColor: myTheme.colors.primary,
        color: myTheme.colors.onPrimary
    },
    container: {
        backgroundColor: myTheme.colors.background
    },
    horizontalCenter: {
        display: 'flex',
        alignItems: 'center'
    },
    surfaceVariant: {
        color: myTheme.colors.onSurfaceVariant,
        backgroundColor: myTheme.colors.surfaceVariant
    },
    fullCenterContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    fullModalContainer: {
        flex: 1,
        backgroundColor: myTheme.colors.background,
        padding: 20
    }
})
