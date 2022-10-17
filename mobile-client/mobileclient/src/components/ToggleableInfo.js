import React, { useState } from "react"

import { TouchableWithoutFeedback, View, Text, StyleSheet } from "react-native"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import { colors } from "../constants"

const ToggleableInfo = ({ label, children }) => {
    const [show, setShow] = useState(false)

    const toggle = () => {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })

        setShow(!show)
    }

    return (
        <React.Fragment>
            <TouchableWithoutFeedback onPress={toggle}>
                <View style={styles.labelContainer}>
                    <FontAwesomeIcon icon={show ? faChevronUp : faChevronDown} size={16} style={{ marginHorizontal: 10 }} />
                    <Text style={styles.labelText}>
                        {
                            label
                        }
                    </Text>
                </View>
            </TouchableWithoutFeedback>
            {
                show && (
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            {
                                children
                            }
                        </Text>
                    </View>
                )
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    labelContainer: {
        width: "100%",
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: colors.white,
        marginTop: 10
    },
    labelText: {
        fontFamily: "Open Sans",
        fontWeight: "500",
        fontSize: 20,
        color: colors.black
    },
    infoContainer: {
        padding: 16
    },
    infoText: {
        fontFamily: "Open Sans",
        fontStyle: "italic",
        fontWeight: "400",
        fontSize: 18,
        color: colors.dark
    }
})

export default ToggleableInfo