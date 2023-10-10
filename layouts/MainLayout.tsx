import { StatusBar } from 'expo-status-bar'
import { View, StyleSheet } from 'react-native'
import { FooterNavigation, Route } from '../components/FooterNavigation'
import { globalStyles } from '../styles/globalStyles'

interface Props {
    routes?: Route[]
    children?: JSX.Element | JSX.Element[]
}

export default function MainLayout(props: Props) {

    return (
        <>
            <StatusBar style="dark" />
            <View style={{ ...styles.view, ...globalStyles.container }}>
                <View style={{ ...styles.container }}>{props.children}</View>
                <View style={styles.footer}>
                    <FooterNavigation routes={props.routes} />
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
