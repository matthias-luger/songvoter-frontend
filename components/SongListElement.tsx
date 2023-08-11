import { IconButton, List, Text } from 'react-native-paper'
import { CoflnetSongVoterModelsSong } from '../generated'
import { View, Image, StyleSheet } from 'react-native'

interface Props {
    song: CoflnetSongVoterModelsSong
    clickElement: JSX.Element
    selected?: boolean
}

export default function SongListElement(props: Props) {
    return (
        <List.Item
            style={props.selected ? styles.selectedItem : null}
            key={props.song.id}
            title={<Text style={props.selected ? styles.selectedTitle : null}>{props.song.title}</Text>}
            descriptionEllipsizeMode={'middle'}
            description={
                <View>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200 }}>
                        {props.song.occurences[0].artist}
                    </Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200 }}>
                        {props.song.occurences[0].platform}
                    </Text>
                </View>
            }
            left={() => <Image style={styles.thumbnail} source={{ uri: props.song.occurences[0].thumbnail }} />}
            right={() => props.clickElement}
        />
    )
}

const styles = StyleSheet.create({
    selectedItem: {
        backgroundColor: '#444444',
        borderRadius: 10,
    },
    selectedTitle: {
        color: 'lime'
    },
    thumbnail: {
        width: 64,
        marginLeft: 10
    }
})
