import React, { useState, useRef } from "react"

import { TouchableWithoutFeedback, View, Text, TextInput, StyleSheet } from "react-native"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import { screen, colors } from "../constants"

const ScoutingHeader = ({ title, setValue }) => {
    return (
        <View style={styles.headerContainer} onLayout={(e) => {
            setValue(e.nativeEvent.layout.y)
        }}>
            <Text style={styles.headerText} numberOfLines={1}>
                {
                    title
                }
            </Text>
        </View>
    )
}

const ScoutingTextInput = ({ title, placeholder, value, setValue }) => {
    const inputRef = useRef()

    const focus = () => inputRef.current.focus()

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle} numberOfLines={1}>
                {
                    title
                }
            </Text>
            <TouchableWithoutFeedback onPress={focus}>
                <View style={styles.textInputContainer}>
                    <TextInput ref={inputRef} placeholder={placeholder} value={value} onChangeText={setValue} style={styles.textInput} placeholderTextColor={colors.dark} cursorColor={colors.flair} selectionColor={colors.flair} color multiline />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const ScoutingNumberInput = ({ title, value, setValue }) => {
    const inputRef = useRef()

    const focus = () => inputRef.current.focus()

    const setInputValue = (v) => {
        const num = parseFloat(v)
        if(isNaN(num)){
            setValue(0)
        } else {
            setValue(num)
        }
    }

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle} numberOfLines={1}>
                {
                    title
                }
            </Text>
            <TouchableWithoutFeedback onPress={focus}>
                <View style={styles.textInputContainer}>
                    <TextInput ref={inputRef} value={value.toString()} onChangeText={setInputValue} style={styles.textInput} cursorColor={colors.flair} selectionColor={colors.flair} color multiline keyboardType={"numeric"} />
                </View>
            </TouchableWithoutFeedback>
            
        </View>
    )
}

const ScoutingSliderInput = ({ title, min, max, step, value, setValue }) => {
    const [touchX, setTouchX] = useState(0)

    const handleTouchStart = (e) => {
        setTouchX(e.nativeEvent.touches[0].pageX)
    }

    const handleTouchMove = (e) => {
        const screenWidth = screen.width - 60 - 15
        const deltaX = e.nativeEvent.touches[0].pageX - touchX
        setValue(
            Math.max(Math.min(
                value + (deltaX / screenWidth) * (max - min)
            , max), min)
        )
        setTouchX(e.nativeEvent.touches[0].pageX)
    }

    const handleTouchEnd = () => ReactNativeHapticFeedback.trigger("impactMedium", { enableVibrateFallback: false })

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle} numberOfLines={1}>
                {
                    title
                }
            </Text>
            <View style={styles.sliderInputContainer}>
                <View style={styles.sliderTrackBar} />
                <View style={[styles.sliderInputThumb, { transform: [{ translateX: (screen.width - 60 - 15) * (step * Math.round(value / step) - min) / (max - min) }] }]} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} />
            </View>
            <View style={{ width: "100%" }}>
                <View style={[{ width: 40, alignItems: "center" }, { transform: [{ translateX: (screen.width - 60 - 15) * (step * Math.round(value / step) - min) / (max - min) - 12.5 }] }]}>
                    <Text style={styles.sliderLabel}>
                        {
                            step * Math.round(value / step)
                        }
                    </Text>
                </View>
            </View>
        </View>
    )
}

const ScoutingToggleInput = ({ title, value, setValue }) => {
    const setToFalse = () => setValue(false) && ReactNativeHapticFeedback.trigger("impactMedium", { enableVibrateFallback: false })
    const setToTrue = () => setValue(true) && ReactNativeHapticFeedback.trigger("impactMedium", { enableVibrateFallback: false })

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle} numberOfLines={1}>
                {
                    title
                }
            </Text>
            <View style={styles.toggleButtonsContainer}>
                <TouchableWithoutFeedback onPress={setToFalse}>
                    <View style={[styles.toggleButtonContainer, { borderColor: !value ? colors.flair : colors.white, backgroundColor: !value ? colors.flairLight : colors.white }]}>
                        <Text style={styles.toggleButtonText}>False</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={setToTrue}>
                    <View style={[styles.toggleButtonContainer, { borderColor: value ? colors.flair : colors.white, backgroundColor: value ? colors.flairLight : colors.white }]}>
                        <Text style={styles.toggleButtonText}>True</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

const ScoutingRadioInput = ({ title, options, value, setValue }) => {
    const optionRenders = []

    options.forEach((option, index) => {
        const setSelectedOption = () => setValue(index) && ReactNativeHapticFeedback.trigger("impactMedium", { enableVibrateFallback: false })

        optionRenders.push(
            <TouchableWithoutFeedback key={index} onPress={setSelectedOption}>
                <View style={[styles.optionButtonContainer, { borderColor: index == value ? colors.flair : colors.white, backgroundColor: index == value ? colors.flairLight : colors.white }]}>
                    <Text style={styles.optionButtonText}>
                        {
                            option
                        }
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    })

    return (
        <View style={[styles.inputContainer, { paddingBottom: 10 }]}>
            <Text style={styles.inputTitle} numberOfLines={1}>
                {
                    title
                }
            </Text>
            {
                optionRenders
            }
        </View>
    )
}

const Input = (props) => {
    let Component = () => null

    switch(props.type){
        case "header":
            Component = ScoutingHeader
            break
        case "text":
            Component = ScoutingTextInput
            break
        case "number":
            Component = ScoutingNumberInput
            break
        case "slider":
            Component = ScoutingSliderInput
            break
        case "toggle":
            Component = ScoutingToggleInput
            break
        case "radio":
            Component = ScoutingRadioInput
            break
    }

    return Component(props)
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        height: 60,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    headerText: {
        paddingHorizontal: 20,
        fontFamily: "Open Sans",
        fontWeight: "700",
        fontSize: 24,
        color: colors.flair,
        textDecorationLine: "underline",
        textDecorationColor: colors.flair
    },
    inputContainer: {
        margin: 10,
        marginBottom: 0,
        padding: 20,
        borderRadius: 10,
        backgroundColor: colors.white
    },
    inputTitle: {
        fontFamily: "Open Sans",
        fontWeight: "400",
        color: colors.black,
        fontSize: 20,
        marginBottom: 20
    },
    textInputContainer: {
        width: "100%",
        padding: 20,
        borderWidth: 1,
        borderColor: colors.flair,
        borderRadius: 10
    },
    textInput: {
        fontFamily: "Open Sans",
        fontWeight: "500",
        fontStyle: "italic",
        fontSize: 16,
        color: colors.black
    },
    sliderInputContainer: {
        width: "100%",
        height: 40,
        justifyContent: "center"
    },
    sliderInputThumb: {
        position: "absolute",
        width: 15,
        height: 30,
        borderWidth: 2.5,
        borderColor: colors.flair,
        borderRadius: 10,
        backgroundColor: colors.flairLight
    },
    sliderTrackBar: {
        width: "100%",
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.dark
    },
    sliderLabel: {
        fontFamily: "Open Sans",
        fontWeight: "700",
        fontSize: 18,
        color: colors.black
    },
    toggleButtonsContainer: {
        width: "100%",
        height: 80,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    toggleButtonContainer: {
        width: 0.5 * (screen.width - 60) - 10,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderWidth: 5
    },
    toggleButtonText: {
        fontFamily: "Open Sans",
        fontWeight: "700",
        fontSize: 20,
        color: colors.black
    },
    optionButtonContainer: {
        width: "100%",
        height: 60,
        justifyContent: "center",
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 5
    },
    optionButtonText: {
        paddingHorizontal: 20,
        fontFamily: "Open Sans",
        fontWeight: "700",
        fontSize: 18,
        color: colors.black
    }
})

export default Input