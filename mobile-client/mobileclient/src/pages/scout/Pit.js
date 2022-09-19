import React, { useRef, useState, useEffect } from "react"

import { TouchableWithoutFeedback, ScrollView, View, Text, StyleSheet } from "react-native"

import Input from "../../components/input"

import useKeyboardHeight from "react-native-use-keyboard-height"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import Storage from "../../scripts/storage"

import { screen, colors } from "../../constants"

const PitPage = ({ navigation }) => {
    const ref = useRef()

    const [form, setForm] = useState([])
    const [inputState, setInputState] = useState([]) // stores relative render y of headers, stored here for convenience

    const keyboardHeight = Math.max(0, useKeyboardHeight() - (70 + screen.bottom))

    useEffect(() => {
        const storage = new Storage()
        storage.init(() => {
            setForm(storage.getPitForm())
        })
    }, [])

    useEffect(() => {
        const defaultInputs = []

        form.forEach(input => {
            let defaultInput = null
            
            switch(input.type){
                case "text":
                    defaultInput = ""
                    break
                case "number":
                    defaultInput = 0
                    break
                case "slider":
                    defaultInput = input.min
                    break
                case "toggle":
                    defaultInput = false
                    break
                case "radio":
                    defaultInput = 0
                    break
            }

            defaultInputs.push(defaultInput)
        })

        setInputState(defaultInputs)
    }, [form])

    const setInput = (index, value) => {
        const temp = [...inputState]
        temp[index] = value
        setInputState(temp)
    }

    const saveInputs = () => {
        const id = Date.now()

        const scoutData = { id, type: "Pit", inputs: {} }
        inputState.forEach((input, index) => {
            if(form[index].type != "header"){
                scoutData.inputs[form[index].title] = input
            }
        })
        
        const storage = new Storage()
        storage.init(() => {
            storage.addScoutForm(scoutData, navigation.goBack)
        })
    }

    const linkRenders = []
    form.forEach((item, index) => {
        if(item.type == "header"){
            linkRenders.push(
                <TouchableWithoutFeedback key={index} onPress={() => {
                    ReactNativeHapticFeedback.trigger("impactMedium", { enableVibrateFallback: false })
                    ref.current.scrollTo({
                        x: 0,
                        y: inputState[index] - 10,
                        animated: true
                    })
                }}>
                    <View style={styles.linkContainer}>
                        <Text style={styles.linkText}>
                            {
                                item.title
                            }
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    })

    const inputRenders = []
    inputState.forEach((item, index) => {
        inputRenders.push(
            <Input key={index} value={item} setValue={value => setInput(index, value)} {...form[index]} />
        )
    })

    return (
        <React.Fragment>
            <ScrollView style={styles.linksContainer} contentContainerStyle={{ paddingRight: 10 }} horizontal showsHorizontalScrollIndicator={false} children={linkRenders} />
            <ScrollView ref={ref} style={styles.inputsContainer} showsVerticalScrollIndicator={false}>
                {
                    inputRenders
                }
                <TouchableWithoutFeedback onPress={saveInputs}>
                    <View style={[styles.buttonContainer, { marginBottom: 20 + keyboardHeight }]}>
                        <Text style={styles.buttonText}>Save</Text>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    inputsContainer: {
        backgroundColor: colors.grey
    },
    linksContainer: {
        width: "100%",
        height: 80,
        paddingVertical: 10,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.flair
    },
    linkContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        marginLeft: 10,
        backgroundColor: colors.flairLight,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.flair
    },
    linkText: {
        fontFamily: "Open Sans",
        fontWeight: "400",
        fontSize: 18,
        color: colors.black
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 120,
        margin: 20,
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

export default PitPage