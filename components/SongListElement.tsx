import { IconButton, List, Text } from 'react-native-paper'
import { CoflnetSongVoterModelsSong } from '../generated'
import { View, Image } from 'react-native'

interface Props {
    song: CoflnetSongVoterModelsSong
    clickElement: JSX.Element
}

export default function SongListElement(props: Props) {
    return (
        <List.Item
            key={props.song.id}
            title={props.song.title}
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
            left={() => <Image style={{ width: 64 }} source={{ uri: props.song.occurences[0].thumbnail }} />}
            right={() => props.clickElement}
        />
    )
}
