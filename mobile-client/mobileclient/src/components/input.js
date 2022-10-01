import React, { useState, useEffect, useRef } from "react"

import { TouchableWithoutFeedback, View, Text, TextInput, StyleSheet } from "react-native"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faMinus, faPlus, faRepeat, faPlay, faPause } from "@fortawesome/free-solid-svg-icons"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import format from "format-duration"

import { screen, colors } from "../constants"

const FormHeader = ({ title, setValue }) => {
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

const FormTextInput = ({ title, placeholder, value, setValue }) => {
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
                <View style={styles.inputTextContainer}>
                    <TextInput ref={inputRef} placeholder={placeholder} value={value} onChangeText={setValue} style={styles.inputText} placeholderTextColor={colors.dark} cursorColor={colors.flair} selectionColor={colors.flair} color multiline />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const FormNumberInput = ({ title, value, setValue }) => {
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

    const minus = () => {
        if(value > 0){
            ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
            setValue(value - 1)
        }
    }

    const plus = () => {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
        setValue(value + 1)
    }

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle} numberOfLines={1}>
                {
                    title
                }
            </Text>
            <View style={styles.multiControlInputContainer}>
                <TouchableWithoutFeedback onPress={focus}>
                    <View style={styles.inputTextContainer}>
                        <TextInput ref={inputRef} value={value.toString()} onChangeText={setInputValue} style={styles.inputText} cursorColor={colors.flair} selectionColor={colors.flair} color multiline keyboardType={"numeric"} />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={minus}>
                    <View style={styles.controlButton}>
                        <FontAwesomeIcon icon={faMinus} color={colors.flair} size={22} />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={plus}>
                    <View style={styles.controlButton}>
                        <FontAwesomeIcon icon={faPlus} color={colors.flair} size={22} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

const FormTimerInput = ({ title, value, setValue }) => {
    const [running, setRunning] = useState(false)

    const [startTimestep, setStartTimestep] = useState(0)
    const [endTimestep, setEndTimestep] = useState(0)

    const timeElapsed = running ? endTimestep - startTimestep : value

    useEffect(() => {
        if(running){
            const interval = setInterval(() => setEndTimestep(Date.now()), 500)

            return () => clearInterval(interval)
        }
    }, [running])

    const restart = () => {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
        setValue(0)
        setStartTimestep(Date.now())
        setEndTimestep(Date.now())
    }

    const start = () => {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
        setRunning(true)
        setStartTimestep(Date.now() - timeElapsed)
        setEndTimestep(Date.now())
    }

    const stop = () => {
        ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
        setRunning(false)
        setValue(timeElapsed)
    }

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle} numberOfLines={1}>
                {
                    title
                }
            </Text>
            <View style={styles.multiControlInputContainer}>
                <View style={styles.inputTextContainer}>
                    <Text style={styles.inputText}>
                        {
                            format(timeElapsed, { leading: true })
                        }
                    </Text>
                </View>
                <TouchableWithoutFeedback onPress={restart}>
                    <View style={styles.controlButton}>
                        <FontAwesomeIcon icon={faRepeat} color={colors.flair} size={22} />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={running ? stop : start}>
                    <View style={styles.controlButton}>
                        <FontAwesomeIcon icon={running ? faPause : faPlay} color={colors.flair} size={22} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

const FormSliderInput = ({ title, min, max, step, value, setValue }) => {
    const [touchX, setTouchX] = useState(0)

    const handleTouchStart = (e) => {
        setTouchX(e.nativeEvent.touches[0].pageX)
    }

    const handleTouchMove = (e) => {
        const screenWidth = screen.width - 60 - 15
        const deltaX = e.nativeEvent.touches[0].pageX - touchX

        const newValue = Math.max(Math.min(value + (deltaX / screenWidth) * (max - min), max), min)

        if(Math.round(value / step) != Math.round(newValue / step)){
            ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
        }

        setValue(newValue)
        setTouchX(e.nativeEvent.touches[0].pageX)
    }

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle} numberOfLines={1}>
                {
                    title
                }
            </Text>
            <View style={{ width: "100%" }}>
                <View style={[{ width: 40, alignItems: "center" }, { transform: [{ translateX: (screen.width - 60 - 15) * (step * Math.round(value / step) - min) / (max - min) - 12.5 }] }]}>
                    <Text style={styles.sliderLabel}>
                        {
                            step * Math.round(value / step)
                        }
                    </Text>
                </View>
            </View>
            <TouchableWithoutFeedback>
                <View style={styles.sliderInputContainer}>
                    <View style={styles.sliderTrackBar} />
                    <View style={[styles.sliderInputThumb, { transform: [{ translateX: (screen.width - 60 - 15) * (step * Math.round(value / step) - min) / (max - min) }] }]} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const FormToggleInput = ({ title, value, setValue }) => {
    const setToFalse = () => {
        if(value){
            ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
        }
        setValue(false)
    }
    const setToTrue = () => {
        if(!value){
            ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
        }
        setValue(true)
    }

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

const FormRadioInput = ({ title, options, value, setValue }) => {
    const optionRenders = []

    options.forEach((option, index) => {
        const setSelectedOption = () => {
            if(value != index){
                ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
            }
            setValue(index)
        }

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
            Component = FormHeader
            break
        case "text":
            Component = FormTextInput
            break
        case "number":
            Component = FormNumberInput
            break
        case "timer":
            Component = FormTimerInput
            break
        case "slider":
            Component = FormSliderInput
            break
        case "toggle":
            Component = FormToggleInput
            break
        case "radio":
            Component = FormRadioInput
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
    inputTextContainer: {
        flex: 1,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.flair,
        borderRadius: 10
    },
    inputText: {
        fontFamily: "Open Sans",
        fontWeight: "500",
        fontStyle: "italic",
        fontSize: 16,
        color: colors.black
    },
    multiControlInputContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    controlButton: {
        width: 68,
        height: 68,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20,
        borderWidth: 1,
        borderColor: colors.flair,
        borderRadius: 10
    },
    sliderInputContainer: {
        width: "100%",
        height: 40,
        marginTop: 10,
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