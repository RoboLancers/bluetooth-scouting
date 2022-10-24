import React, { useState, useRef, useEffect } from "react"

import { TouchableOpacity, FlatList, View, Text, StyleSheet, Animated, Easing, Alert, NativeModules, NativeEventEmitter } from "react-native"

import { scan, stopScan, connect, retrieveServices, write } from "react-native-ble-manager"
const BleManagerModule = NativeModules.BleManager
const bleEmitter = new NativeEventEmitter(BleManagerModule)

import { stringToBytes } from "convert-string"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../scripts/storage"

import { colors, bluetoothPeripheral } from "../constants"

const UploadPage = ({ navigation }) => {
    const [devices, setDevices] = useState({})
    const devices_ = devices

    const [uploading, setUploading] = useState(false)

    const uploadingIndicatorAngle = useRef(new Animated.Value(0)).current
    Animated.loop(
        Animated.timing(uploadingIndicatorAngle, {
            toValue: 1,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: true
        })
    ).start()

    const uploadToDevice = (id) => {
        if (uploading) return

        setUploading(true)

        try {
            connect(id).then(() => {
                retrieveServices(id).then(() => {
                    const storage = new Storage()
                    storage.init(() => {
                        const payload = stringToBytes(JSON.stringify(storage.getScoutForms()))
                        
                        write(id, bluetoothPeripheral.service, bluetoothPeripheral.upload, payload).then(() => {
                            Alert.alert("Successfully Transferred", "Your scouting data has been uploaded to the server.")
                            setUploading(false)
                        })
                    })
                })
            })
        } catch(e){
            console.warn(e)

            Alert.alert("Failed to Transfer", "There was an issue transferring your data to the server. Please try again.")
            setUploading(false)
        }
    }

    useEffect(() => {
        bleEmitter.addListener("BleManagerDiscoverPeripheral", (device) => {
            devices_[device.name] = device.id
            setDevices({...devices_})
        })

        navigation.addListener("state", (e) => {
            if(e.data.state.index == 1){
                scan([ bluetoothPeripheral.service ], 5, false)
            } else {
                stopScan()
            }
        })
    }, [])

    return (
        <React.Fragment>
            <FlatList style={styles.container} contentContainerStyle={{ paddingBottom: 10 }} showsVerticalScrollIndicator={false} data={Object.keys(devices)} renderItem={({ item }) => {
                return (
                    <TouchableOpacity activeOpacity={1} key={item} onPress={() => {
                        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })

                        uploadToDevice(devices[item])
                    }}>
                        <Text style={styles.device}>
                            {
                                item
                            }
                        </Text>
                    </TouchableOpacity>
                )
            }} ListEmptyComponent={(
                <Text style={styles.emptyText}>No Devices Found</Text>
            )} />
            {
                uploading && (
                    <View style={styles.uploadingBarContainer}>
                        <View style={styles.uploadingIndicatorContainer}>
                            <Animated.View style={[styles.uploadingIndicator, { transform: [{ rotateZ: uploadingIndicatorAngle.interpolate({
                                inputRange: [ 0, 1 ],
                                outputRange: [ "0deg", "360deg" ]
                            }) }] }]} />
                        </View>
                        <Text style={styles.uploadingText}>Uploading Forms...</Text>
                    </View>
                )
            }
        </React.Fragment>
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
    },
    uploadingBarContainer: {
        width: "100%",
        height: 60,
        borderTopColor: colors.crimson,
        borderTopWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white
    },
    uploadingIndicatorContainer: {
        width: 30,
        height: 30,
        marginHorizontal: 15
    },
    uploadingIndicator: {
        width: 30,
        height: 30,
        borderWidth: 4,
        borderRadius: 15,
        borderColor: colors.crimson,
        borderTopColor: "transparent"
    },
    uploadingText: {
        fontFamily: "Open Sans",
        fontWeight: "500",
        fontSize: 20,
        color: colors.black
    }
})

export default UploadPage