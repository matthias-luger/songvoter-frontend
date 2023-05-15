import * as React from 'react'

import { StyleSheet, Text } from 'react-native'
import { useCameraDevices, useFrameProcessor } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
import { Barcode, BarcodeFormat, scanBarcodes } from 'vision-camera-code-scanner'

interface Props {
    onBarcodeScan?(barcode: Barcode)
}

export function QRCodeScanner(props: Props) {
    const [hasPermission, setHasPermission] = React.useState(false)
    const devices = useCameraDevices()
    const device = devices.back

    const frameProcessor = useFrameProcessor(frame => {
        'worklet'
        const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true })
        const barcode = detectedBarcodes[0]
        if (barcode && props.onBarcodeScan) {
            props.onBarcodeScan(barcode)
        }
    }, [])

    React.useEffect(() => {
        ;(async () => {
            const status = await Camera.requestCameraPermission()
            setHasPermission(status === 'authorized')
        })()
    }, [])

    return (
        device != null &&
        hasPermission && (
            <>
                <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} frameProcessor={frameProcessor} frameProcessorFps={5} />
            </>
        )
    )
}

const styles = StyleSheet.create({
    barcodeTextURL: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    }
})
