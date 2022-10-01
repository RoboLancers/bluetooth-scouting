import React, { useState, useEffect } from "react"

import { TouchableWithoutFeedback, FlatList, View, Text, StyleSheet, NativeEventEmitter, NativeModules, TouchableOpacity } from "react-native"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import BleManager from "react-native-ble-manager"
const BleManagerModule = NativeModules.BleManager
const bleEmitter = new NativeEventEmitter(BleManagerModule)

import { stringToBytes } from "convert-string"

const Buffer = require("buffer/").Buffer

import Storage from "../scripts/storage"

import { colors } from "../constants"

const UploadPage = ({ navigation }) => {
    const [scanning, setScanning] = useState(false)
    const [devices, setDevices] = useState([])
    const devicesMap = new Map()

    // scan for available devices for 3 seconds
    const startScan = () => {
        if (scanning) return

        devicesMap.clear()

        setDevices(Array.from(devicesMap.values()))

        BleManager.scan([], 3, false).then(() => {
            setScanning(true)
        }).catch((error) => {
            if(error){
                console.warn(error)
            }
        })
    }

    const stopScan = () => setScanning(false)

    // add device to map and state array
    const handleDeviceDiscovered = (device) => {
        if(device.name){
            devicesMap.set(device.id, device)
            setDevices(Array.from(devicesMap.values()))
        }
    }

    // update device map and state array on device disconnect
    const handleDeviceDisconnect = (data) => {
        const device = devicesMap.get(data.peripheral)
        if(device){
            device.connected = false
            devicesMap.set(device.id, device)
            setDevices(Array.from(devicesMap.values()))
        }
    }

    // for testing
    const handleReceiveData = (data) => {
        console.log(data.peripheral)
        console.log(data.characteristic)
        console.log(data.value)
    }

    // update metadata of device and sync map and state array
    const updateDevice = (device, mutator) => {
        let deviceInMap = devicesMap.get(device.id)

        if (!deviceInMap) return

        deviceInMap = mutator(deviceInMap)

        devicesMap.set(device.id, deviceInMap)
        setDevices(Array.from(devicesMap.values()))
    }

    // upload stored form data to device
    const uploadToDevice = (device) => {
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

                // dummy uuids for testing, TODO: look into validity of static vs randomized uuids
                const serviceUUID = "0425b4be-ebba-4903-96d0-8663974f2123"
                const characteristicUUID = "d6dde2c2-71c3-4907-9232-de076f48f8a9"

                const storage = new Storage()
                storage.init(() => {
                    const payload = storage.getScoutForms()
                    const bytes = stringToBytes(JSON.stringify(payload))

                    console.log({ bytes })

                    BleManager.write(device.id, serviceUUID, characteristicUUID, bytes).then(() => {
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
        bleEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", handleReceiveData)
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
        }} ListHeaderComponent={(
            <TouchableWithoutFeedback onPress={startScan}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Scan For Devices</Text>
                </View>
            </TouchableWithoutFeedback>
        )} ListEmptyComponent={(
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
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 120,
        margin: 20,
        marginBottom: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.flair,
        backgroundColor: colors.white
    },
    buttonText: {
        fontFamily: "Open Sans",
        fontWeight: "700",
        fontSize: 20,
        color: colors.flair
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