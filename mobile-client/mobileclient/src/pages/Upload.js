import React, { useState, useEffect } from "react"

import { FlatList, Text, StyleSheet, NativeEventEmitter, NativeModules, TouchableOpacity } from "react-native"

import BleManager from "react-native-ble-manager"
const BleManagerModule = NativeModules.BleManager
const bleEmitter = new NativeEventEmitter(BleManagerModule)

import { stringToBytes } from "convert-string"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../scripts/storage"

import { colors, bluetoothPeripheral } from "../constants"

const UploadPage = ({ navigation }) => {
    const [scanning, setScanning] = useState(false)
    const [devices, setDevices] = useState([])
    const devicesMap = new Map()

    // scan for available devices for 3 seconds
    const startScan = () => {
        if (scanning) return

        devicesMap.clear()

        setDevices(Array.from(devicesMap.values()))

        BleManager.scan([ bluetoothPeripheral.serviceUUID ], 3, false).then(() => {
            setScanning(true)
        }).catch((error) => {
            if(error){
                console.warn(error)
            }
        })
    }

    const stopScan = () => setScanning(false)

    const handleDeviceDiscovered = (device) => {
        if(device.name){
            devicesMap.set(device.id, device)
            setDevices(Array.from(devicesMap.values()))
        }
    }

    const handleDeviceDisconnect = (data) => {
        const device = devicesMap.get(data.peripheral)
        if(device){
            device.connected = false
            devicesMap.set(device.id, device)
            setDevices(Array.from(devicesMap.values()))
        }
    }

    const updateDevice = (device, mutator) => {
        let deviceInMap = devicesMap.get(device.id)

        if (!deviceInMap) return

        deviceInMap = mutator(deviceInMap)

        devicesMap.set(device.id, deviceInMap)
        setDevices(Array.from(devicesMap.values()))
    }

    const uploadToDevice = (device) => {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })

        if (!device) return

        // why do we need to do this?
        if(device.connected){
            return BleManager.disconnect(device.id)
        }

        BleManager.connect(device.id).then(() => {
            updateDevice(device, (device) => {
                device.connected = true
                return device
            })

            // retrieve services (maybe?) is required before read/write
            BleManager.retrieveServices(device.id).then(() => {
                BleManager.readRSSI(device.id).then((rssi) => {
                    updateDevice(device, (device) => {
                        device.rssi = rssi
                        return device
                    })
                })

                const storage = new Storage()
                storage.init(() => {
                    const payload = storage.getScoutForms()
                    const bytes = stringToBytes(JSON.stringify(payload))

                    BleManager.write(device.id, bluetoothPeripheral.serviceUUID, bluetoothPeripheral.characteristicUUID, bytes).then(() => {
                        console.log("successfully wrote data, should alert user")
                    }).catch((e) => {
                        console.warn(e)
                    })
                })
            })
        }).catch((e) => {
            console.warn(e)
        })
    }

    useEffect(() => {
        BleManager.start({ showAlert: true })
        bleEmitter.addListener("BleManagerDiscoverPeripheral", handleDeviceDiscovered)
        bleEmitter.addListener("BleManagerStopScan", stopScan)
        bleEmitter.addListener("BleManagerDisconnectPeripheral", handleDeviceDisconnect)

        return navigation.addListener("state", (e) => {
            if(e.data.state.index == 1){
                startScan()
            }
        })
    }, [])

    return (
        <FlatList style={styles.container} contentContainerStyle={{ paddingBottom: 10 }} showsVerticalScrollIndicator={false} data={devices} renderItem={({ item }) => {
            return (
                <TouchableOpacity activeOpacity={1} key={item.id} onPress={() => {
                    uploadToDevice(item)
                }}>
                    <Text style={styles.device}>
                        {
                            item.name
                        }
                    </Text>
                </TouchableOpacity>
            )
        }} ListEmptyComponent={(
            <Text style={styles.emptyText}>No Devices Found</Text>
        )} />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.grey
    },
    device: {
        fontFamily: "Open Sans",
        fontWeight: "500",
        fontSize: 16,
        color: colors.black,
        paddingHorizontal: 10,
        paddingVertical: 20,
        margin: 10,
        marginBottom: 0,
        borderRadius: 10,
        backgroundColor: colors.white,
        overflow: "hidden"
    },
    emptyText: {
        marginVertical: 30,
        fontFamily: "Open Sans",
        fontWeight: "500",
        fontStyle: "italic",
        fontSize: 20,
        color: colors.dark,
        textAlign: "center"
    }
})

export default UploadPage