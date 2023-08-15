import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Link, usePathname, useRouter } from 'expo-router'
import { Keyboard, Pressable, View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { globalStyles } from '../styles/globalStyles'
import { EventRegister } from 'react-native-event-listeners'
import { NavigationEvents } from '../types/events.d'

export const DEFAULT_ROUTES: Route[] = [
    {
        href: '/',
        icon: 'home-outline',
        selectedIcon: 'home',
        label: 'Home',
        aliasRoutes: ['/party-overview', '/create-party', '/invite-party']
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

export interface Route {
    href: string
    icon: keyof typeof MaterialCommunityIcons.glyphMap
    selectedIcon: keyof typeof MaterialCommunityIcons.glyphMap
    label: string
    aliasRoutes?: string[]
}

interface Props {
    routes?: Route[]
}

export function FooterNavigation(props: Props) {
    let pathname = usePathname()
    let theme = useTheme()

    let routes = props.routes || DEFAULT_ROUTES

    function isSelected(route: Route) {
        return route.href === pathname || (route.aliasRoutes && route.aliasRoutes.findIndex(r => r === pathname) !== -1)
    }

    return (
        <View style={{ backgroundColor: theme.colors.secondaryContainer, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {routes.map(route => (
                <Link href={route.href} replace key={route.href} asChild style={{ flex: 1 }}>
                    <Pressable>
                        <View style={globalStyles.horizontalCenter}>
                            <MaterialCommunityIcons name={isSelected(route) ? route.selectedIcon : route.icon} size={25} />
                            <Text style={{ fontSize: 18, color: theme.colors.onSecondaryContainer }}>{route.label}</Text>
                        </View>
                    </Pressable>
                </Link>
            ))}
        </View>
    )
}
