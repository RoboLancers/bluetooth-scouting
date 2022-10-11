import React, { useState, useEffect } from "react"

import { TouchableWithoutFeedback, View, Text, StyleSheet, Alert } from "react-native"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../scripts/storage"

import { colors } from "../constants"

const SchemaPage = () => {
    const [schemaId, setSchemaId] = useState("Loading...")

    useEffect(() => {
        const storage = new Storage()
        storage.init(() => {
            setSchemaId(storage.getSchemaId())
        })
    }, [])

    return (
        <View style={styles.container}></View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.grey
    }
})

export default SchemaPage