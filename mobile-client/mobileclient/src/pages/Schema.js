import React, { useState, useRef, useEffect } from "react"

import { TouchableOpacity, FlatList, View, Text, StyleSheet, Animated, Easing, Alert, NativeModules, NativeEventEmitter } from "react-native"

import { scan, stopScan, connect, retrieveServices, read } from "react-native-ble-manager"
const BleManagerModule = NativeModules.BleManager
const bleEmitter = new NativeEventEmitter(BleManagerModule)

import { bytesToString } from "convert-string"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import validateSchema from "../scripts/validateSchema"

import Storage from "../scripts/storage"

import { colors, bluetoothPeripheral } from "../constants"

const SchemaPage = ({ navigation }) => {
    const [schemaId, setSchemaId] = useState("Loading...")

    const [devices, setDevices] = useState({})
    const devices_ = devices

    const [retrieving, setRetrieving] = useState(false)

    const retrievingIndicatorAngle = useRef(new Animated.Value(0)).current
    Animated.loop(
        Animated.timing(retrievingIndicatorAngle, {
            toValue: 1,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: true
        })
    ).start()

    const retrieveSchemaFromDevice = (id) => {
        if (retrieving) return

        setRetrieving(true)

        try {
            connect(id).then(() => {
                retrieveServices(id).then(() => {
                    read(id, bluetoothPeripheral.service, bluetoothPeripheral.schemaLength).then((schemaLengthInBytes) => {
                        const schemaLength = parseInt(bytesToString(schemaLengthInBytes))
    
                        const chunkRequests = []
                        for(let i = 0;i<schemaLength;i++){
                            const chunkIndexString = new Array(4 - i.toString().length).fill("0").join("") + i.toString()
                            chunkRequests.push(read(id, bluetoothPeripheral.service, bluetoothPeripheral.schemaChunk + chunkIndexString))
                        }
    
                        Promise.all(chunkRequests).then((schemaChunks) => {
                            const schema = JSON.parse(schemaChunks.map(chunk => bytesToString(chunk)).join(""))
                            
                            const validationResult = validateSchema(schema)

                            if(validationResult.valid){
                                setSchemaId(schema.id)
                                const storage = new Storage()
                                storage.init(() => {
                                    storage.setSchema(validationResult.schema)
                                })
        
                                Alert.alert("Successfully Retrieved", "The latest schema is now being used on this device.")
                                setRetrieving(false)
                            } else {
                                Alert.alert("Invalid Schema", "The uploaded schema was not valid. This should be manually fixed on the server.")
                                setRetrieving(false)
                            }
                        })
                    })
                })
            })
        } catch(e){
            console.warn(e)

            Alert.alert("Failed to Retrieve", "There was an issue retrieving the schema from the server. Please try again.")
            setRetrieving(false)
        }
    }

    useEffect(() => {
        const storage = new Storage()
        storage.init(() => {
            setSchemaId(storage.getSchemaId())
        })

        bleEmitter.addListener("BleManagerDiscoverPeripheral", (device) => {
            devices_[device.name] = device.id
            setDevices({...devices_})
        })
        
        navigation.addListener("state", (e) => {
            if(e.data.state.index == 2){
                const storage = new Storage()
                storage.init(() => {
                    setSchemaId(storage.getSchemaId())
                })
                
                scan([ bluetoothPeripheral.service ], 5, false)
            } else {
                stopScan()
            }
        })
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.schemaIdContainer}>
                <Text style={styles.schemaIdText}>
                    {
                        schemaId
                    }
                </Text>
            </View>
            <FlatList style={styles.container} contentContainerStyle={{ paddingBottom: 10 }} showsVerticalScrollIndicator={false} data={Object.keys(devices)} renderItem={({ item }) => {
                return (
                    <TouchableOpacity activeOpacity={1} key={item} onPress={() => {
                        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })

                        retrieveSchemaFromDevice(devices[item])
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
                retrieving && (
                    <View style={styles.retrievingBarContainer}>
                        <View style={styles.retrievingIndicatorContainer}>
                            <Animated.View style={[styles.retrievingIndicator, { transform: [{ rotateZ: retrievingIndicatorAngle.interpolate({
                                inputRange: [ 0, 1 ],
                                outputRange: [ "0deg", "360deg" ]
                            }) }] }]} />
                        </View>
                        <Text style={styles.retrievingText}>Retrieving Schema...</Text>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.grey
    },
    schemaIdContainer: {
        width: "100%",
        alignItems: "center",
        borderBottomColor: colors.crimson,
        borderBottomWidth: 1,
        backgroundColor: colors.white
    },
    schemaIdText: {
        fontFamily: "Open Sans",
        fontWeight: "500",
        fontSize: 16,
        color: colors.crimson,
        marginLeft: 10,
        paddingBottom: 10
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
    retrievingBarContainer: {
        width: "100%",
        height: 60,
        borderTopColor: colors.crimson,
        borderTopWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white
    },
    retrievingIndicatorContainer: {
        width: 30,
        height: 30,
        marginHorizontal: 15
    },
    retrievingIndicator: {
        width: 30,
        height: 30,
        borderWidth: 4,
        borderRadius: 15,
        borderColor: colors.crimson,
        borderTopColor: "transparent"
    },
    retrievingText: {
        fontFamily: "Open Sans",
        fontWeight: "500",
        fontSize: 20,
        color: colors.black
    }
})

export default SchemaPage