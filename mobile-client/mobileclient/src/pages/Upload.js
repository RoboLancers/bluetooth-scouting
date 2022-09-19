import React, { useState, useEffect } from "react"

import { TouchableWithoutFeedback, FlatList, View, Text, StyleSheet } from "react-native"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../scripts/storage"

import { colors } from "../constants"

const UploadPage = ({ navigation }) => {
    const [scoutForms, setScoutForms] = useState([])

    useEffect(() => {
        const subscriber = navigation.addListener("state", (e) => {
            if(e.data.state.index == 2){
                const storage = new Storage()
                storage.init(() => {
                    setScoutForms(storage.getScoutForms())
                })
            }
        })

        return subscriber
    }, [])

    const upload = () => {
        ReactNativeHapticFeedback.trigger("impactMedium", { enableVibrateFallback: false })
        // TODO: open bluetooth channel and post stringified async storage scout forms data
    }

    return (
        <FlatList style={styles.container} contentContainerStyle={{ paddingBottom: 10 }} showsVerticalScrollIndicator={false} data={scoutForms.reverse()} renderItem={({ item }) => {
            return (
                <View style={styles.formSummaryContainer}>
                    <Text style={styles.teamLabel}>Team <Text style={styles.teamNumber}>#
                        {
                            item.inputs["Team Number"]
                        }
                    </Text></Text>
                    <Text style={styles.scoutMetaText}>
                        {
                            `${item.type} Scout from ${(new Date(item.id)).toLocaleDateString("en-US")}`
                        }
                    </Text>
                </View>
            )
        }} keyExtractor={(_, index) => index} ListHeaderComponent={(
            <TouchableWithoutFeedback onPress={upload}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Send Data to Server</Text>
                </View>
            </TouchableWithoutFeedback>
        )} ListEmptyComponent={(
            <Text style={styles.emptyText}>No Scouting Data Yet</Text>
        )} />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.grey
    },
    formSummaryContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 70,
        borderRadius: 10,
        margin: 10,
        marginBottom: 0,
        padding: 20,
        backgroundColor: colors.white
    },
    teamLabel: {
        fontFamily: "Open Sans",
        fontWeight: "700",
        fontSize: 20,
        color: colors.black
    },
    teamNumber: {
        fontFamily: "Open Sans",
        fontWeight: "900",
        fontSize: 20,
        color: colors.flair,
        textDecorationLine: "underline",
        textShadowColor: colors.flairLight
    },
    scoutMetaText: {
        fontFamily: "Open Sans",
        fontWeight: "400",
        fontStyle: "italic",
        fontSize: 16,
        color: colors.black
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