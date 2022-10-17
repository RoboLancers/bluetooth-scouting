import React from "react"

import { TouchableWithoutFeedback, ScrollView, View, Text, StyleSheet, Alert } from "react-native"

import ToggleableInfo from "../components/ToggleableInfo"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../scripts/storage"

import { colors } from "../constants"

const SettingsPage = () => {
    const clearScoutingData = () => {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })

        Alert.alert("Clear Scouting Data?", "You will lose all currently saved scout data. Only do this at the end of competition.", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    const storage = new Storage()
                    storage.init(() => {
                        storage.clearForms(() => {})
                    })
                }
            }
        ])
    }

    const deleteSchema = () => {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })

        Alert.alert("Delete Schema?", "The schema you are currently using will be deleted. You will still be able to use the generic schema, but this is not recommended during competitions.", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    const storage = new Storage()
                    storage.init(() => {
                        storage.deleteSchema(() => {})
                    })
                }
            }
        ])
    }

    return (
        <ScrollView style={styles.container}>
            <ToggleableInfo label={"Privacy Policy"}>
                TODO
            </ToggleableInfo>
            <ToggleableInfo label={"Terms and Conditions"}>
                TODO
            </ToggleableInfo>
            <TouchableWithoutFeedback onPress={clearScoutingData}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Clear Scouting Data</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={deleteSchema}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Delete Schema</Text>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.grey
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 120,
        marginTop: 20,
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

export default SettingsPage