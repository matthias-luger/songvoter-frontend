import { StyleSheet } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

interface Props {
    text: string
}

export default function HeaderText(props: Props) {
    let theme = useTheme()

    return <Text style={{ ...theme.fonts.headlineLarge, color: theme.colors.onBackground, ...styles.heading }}>{props.text}</Text>
}

const styles = StyleSheet.create({
    heading: {
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})
