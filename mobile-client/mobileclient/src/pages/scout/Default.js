import React from "react"

import { TouchableWithoutFeedback, View, Text, StyleSheet } from "react-native"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import { colors } from "../../constants"

const DefaultPage = ({ navigation }) => {
    const startMatchScouting = () => {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
        navigation.push("Match")
    }
    const startPitScouting = () => {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
        navigation.push("Pit")
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={startMatchScouting}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Start Match Scouting</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={startPitScouting}>
                <View style={[styles.buttonContainer, { marginTop: 20 }]}>
                    <Text style={styles.buttonText}>Start Pit Scouting</Text>
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
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 120,
        marginHorizontal: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.crimson,
        backgroundColor: colors.white
    },
    buttonText: {
        fontFamily: "Open Sans",
        fontWeight: "700",
        fontSize: 20,
        color: colors.crimson
    }
})

export default DefaultPage