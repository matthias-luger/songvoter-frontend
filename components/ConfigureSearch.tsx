import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Switch, Text, useTheme } from 'react-native-paper'
import { PLATFORMS_USED_IN_SEARCH, storage } from '../utils/StorageUtils'
import { CoflnetSongVoterModelsSongPlatform } from '../generated'

interface Props {
    onPlatformsChange?(newPlatforms: CoflnetSongVoterModelsSongPlatform[])
}

export function ConfigureSearch(props: Props) {
    let theme = useTheme()
    let [usedPlatforms, setUsedPlatforms] = useState(
        storage.contains(PLATFORMS_USED_IN_SEARCH) ? JSON.parse(storage.getString(PLATFORMS_USED_IN_SEARCH)) : ['youtube', 'spotify']
    )

    function onPlatformChange(platform: string, activate: boolean) {
        let newUsedPlatforms = [...usedPlatforms]
        if (activate && !usedPlatforms.includes(platform)) {
            newUsedPlatforms.push(platform)
            setUsedPlatforms(newUsedPlatforms)
        }
        if (!activate && usedPlatforms.includes(platform)) {
            newUsedPlatforms = newUsedPlatforms.filter(entry => entry !== platform)
            setUsedPlatforms(newUsedPlatforms)
        }
        storage.set(PLATFORMS_USED_IN_SEARCH, JSON.stringify(newUsedPlatforms))
        if (props.onPlatformsChange) {
            props.onPlatformsChange(newUsedPlatforms)
        }
    }

    return (
        <View>
            <Text style={{ ...theme.fonts.headlineSmall }}>Music Platforms</Text>
            <Text style={{ ...theme.fonts.default }}>What songs should the search find?</Text>
            <View>
                <View style={styles.row}>
                    <Text>Spotify</Text>
                    <Switch
                        value={usedPlatforms.includes('spotify')}
                        onValueChange={active => {
                            onPlatformChange('spotify', active)
                        }}
                    />
                </View>
            </View>
            <View style={styles.row}>
                <Text>Youtube</Text>
                <Switch
                    value={usedPlatforms.includes('youtube')}
                    onValueChange={active => {
                        onPlatformChange('youtube', active)
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16
    }
})
