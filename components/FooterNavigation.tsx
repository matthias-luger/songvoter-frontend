import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Link, usePathname, useRouter } from 'expo-router'
import { Keyboard, Pressable, View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import { EventRegister } from 'react-native-event-listeners'
import { NavigationEvents } from '../types/events.d'

const DEFAULT_ROUTES: Route[] = [
    {
        href: '/',
        icon: 'home-outline',
        selectedIcon: 'home',
        label: 'Home'
    },
    {
        href: '/your-songs',
        icon: 'music-note-outline',
        selectedIcon: 'music-note',
        label: 'Your Songs'
    },
    {
        href: '/account',
        icon: 'account-outline',
        selectedIcon: 'account',
        label: 'Account'
    }
]

interface Route {
    href: string
    icon: keyof typeof MaterialCommunityIcons.glyphMap
    selectedIcon: keyof typeof MaterialCommunityIcons.glyphMap
    label: string
}

export function FooterNavigation(props) {
    let pathname = usePathname()
    let theme = useTheme()
    let [routes, setRoutes] = useState<Route[]>([...DEFAULT_ROUTES])
    let [hidden, setHidden] = useState(false)

    useEffect(() => {
        let addListener = EventRegister.addEventListener(NavigationEvents.ADD_NAVIGATION_TAB, function (newTab) {
            setRoutes([...routes, newTab])
        })
        let removeListener = EventRegister.addEventListener(NavigationEvents.ADD_NAVIGATION_TAB, function (href) {
            setRoutes(routes.filter(route => route.href !== href))
        })
        let keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', () => {
            setHidden(true)
        })
        let keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', () => {
            setHidden(false)
        })

        return () => {
            if (typeof addListener === 'string') {
                EventRegister.removeEventListener(addListener)
            }
            if (typeof removeListener === 'string') {
                EventRegister.removeEventListener(removeListener)
            }
            keyboardWillHideSub.remove()
            keyboardWillShowSub.remove()
        }
    }, [])

    if (hidden) {
        return <></>
    }

    return (
        <View style={{ backgroundColor: theme.colors.secondaryContainer, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {routes.map(route => (
                <Link href={route.href} replace key={route.href} asChild style={{ flex: 1 }}>
                    <Pressable>
                        <View style={globalStyles.horizontalCenter}>
                            <MaterialCommunityIcons name={pathname === route.href ? route.selectedIcon : route.icon} size={25} />
                            <Text style={{ fontSize: 18, color: theme.colors.onSecondaryContainer }}>{route.label}</Text>
                        </View>
                    </Pressable>
                </Link>
            ))}
        </View>
    )
}
