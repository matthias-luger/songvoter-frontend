import { Text } from 'react-native-paper'
import MainLayout from '../layouts/MainLayout'
import { lastErrorObject } from '../utils/ToastUtils'
import { View } from 'react-native'

export default function Error() {
    let error = lastErrorObject

    return (
        <>
            <MainLayout>
                <View>
                    <Text>{JSON.stringify(error)}</Text>
                </View>
            </MainLayout>
        </>
    )
}
