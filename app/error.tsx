import { Divider, Text } from 'react-native-paper'
import MainLayout from '../layouts/MainLayout'
import { lastErrorObject } from '../utils/ToastUtils'
import { ScrollView } from 'react-native-gesture-handler'

export default function Error() {
    let error = lastErrorObject

    return (
        <>
            <MainLayout>
                <ScrollView>
                    {error && error.response && error.response.data ? <Text>Data: {error.response.data}</Text> : null}
                    <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                    <Text>{JSON.stringify(error)}</Text>
                </ScrollView>
            </MainLayout>
        </>
    )
}
