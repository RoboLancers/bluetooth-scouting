import React, { useState, useEffect } from "react"

import { TouchableWithoutFeedback, View, Text, StyleSheet, Alert } from "react-native"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"
import Share from "react-native-share"

import Storage from "../scripts/storage"

import { colors } from "../constants"

const SchemaPage = () => {
    const [schema, setSchema] = useState({ id: "Loading..." })

    useEffect(() => {
        const storage = new Storage()
        storage.init(() => {
            setSchema(storage.getSchema())
        })
    }, [])

    const exportSchema = () => {
        ReactNativeHapticFeedback.trigger("impactMedium", { enableVibrateFallback: false })
        Share.open({
            message: JSON.stringify(schema),
            failOnCancel: false
        }).catch((e) => {
            Alert.alert("Error Exporting Schema", "An error occurred exporting your schema. Please try again and if the error continues, try restarting the app.\n\n"+ e)
        })
    }

    const receiveNewSchema = () => {
        ReactNativeHapticFeedback.trigger("impactMedium", { enableVibrateFallback: false })
        // TODO: open bluetooth channel and listen for incoming
    }

    return (
        <View style={styles.container}>
            <View style={styles.currentSchemaContainer}>
                <Text style={styles.currentSchemaLabel}>Current ID:</Text>
                <Text style={styles.currentSchemaId}>
                    {
                        schema.id
                    }
                </Text>
            </View>
            <TouchableWithoutFeedback onPress={exportSchema}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Export Current Schema</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={receiveNewSchema}>
                <View style={[styles.buttonContainer, { marginTop: 20 }]}>
                    <Text style={styles.buttonText}>Receive New Schema</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.grey
    },
    currentSchemaContainer: {
        position: "absolute",
        top: 20,
        left: 20,
        right: 20
    },
    currentSchemaLabel: {
        fontFamily: "Open Sans",
        fontWeight: "500",
        fontSize: 20,
        color: colors.dark
    },
    currentSchemaId: {
        marginTop: 10,
        fontFamily: "Open Sans",
        fontWeight: "500",
        fontStyle: "italic",
        fontSize: 14,
        color: colors.black
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 120,
        marginHorizontal: 20,
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
    }
})

export default SchemaPage