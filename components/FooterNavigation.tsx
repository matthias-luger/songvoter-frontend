import React, { useState } from 'react'
import { Box, Text, Heading, VStack, FormControl, Input, Button, Icon, HStack, Center, Pressable } from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Link, usePathname, useRouter } from 'expo-router'

interface Route {
    href: string
    icon: keyof typeof MaterialCommunityIcons.glyphMap
    selectedIcon: keyof typeof MaterialCommunityIcons.glyphMap
    label: string
}

let routes: Route[] = [
    {
        href: '/',
        icon: 'home-outline',
        selectedIcon: 'home',
        label: 'Home'
    },
    {
        href: '/test',
        icon: 'home-outline',
        selectedIcon: 'home',
        label: 'Test'
    },
    {
        href: '/spotify',
        icon: 'music-note-outline',
        selectedIcon: 'music',
        label: 'Spotify'
    }
]

export function FooterNavigation() {
    let pathname = usePathname()

    return (
        <Box safeAreaBottom bg="white" width="100%">
            <HStack bg="indigo.600" safeAreaBottom shadow={6}>
                {routes.map(route => (
                    <Link href={route.href} replace key={route.href} asChild style={{ flex: 1, paddingTop: 6, paddingBottom: 6 }}>
                        <Pressable>
                            <Center>
                                <Icon
                                    mb="1"
                                    as={<MaterialCommunityIcons name={pathname === route.href ? route.selectedIcon : route.icon} />}
                                    color="white"
                                    size="sm"
                                />
                                <Text style={{ color: 'white', fontSize: 18 }}>{route.label}</Text>
                            </Center>
                        </Pressable>
                    </Link>
                ))}
            </HStack>
        </Box>
    )
}
