import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Camera } from 'expo-camera'

interface Props {
    onBarcodeScan(code: string)
}

export function QRCodeScanner(props: Props) {
    const [hasPermission, setHasPermission] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type)

    useEffect(() => {
        ;(async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }, [])

    if (hasPermission === null) {
        return <View />
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }
    return (
        <View style={styles.container}>
            <Camera
                onBarCodeScanned={(...args) => {
                    const data = args[0].data
                    let result = JSON.stringify(data)
                    if (props.onBarcodeScan) {
                        props.onBarcodeScan(result)
                    }
                }}
                barCodeScannerSettings={{
                    barCodeTypes: ['qr']
                }}
                style={{ flex: 1 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    camera: {
        flex: 1
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    text: {
        fontSize: 18,
        color: 'white'
    }
})
