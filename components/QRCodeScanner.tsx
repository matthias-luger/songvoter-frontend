import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Camera } from 'expo-camera'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { BarCodeScanner } from 'expo-barcode-scanner'

interface Props {
    onBarcodeScan(code: string)
    disableAfterScan: boolean
}

export function QRCodeScanner(props: Props) {
    const [hasPermission, setHasPermission] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type)
    let [isDisabled, setIsDisabled] = useState(false)

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
                    if (isDisabled) {
                        return
                    }
                    setIsDisabled(true)
                    const data = args[0].data
                    if (props.onBarcodeScan) {
                        props.onBarcodeScan(data)
                    }
                }}
                barCodeScannerSettings={{
                    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
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
