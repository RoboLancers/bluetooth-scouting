import React from "react"

import { TouchableWithoutFeedback, View, Alert } from "react-native"

import { createStackNavigator } from "@react-navigation/stack"

import DefaultPage from "./scout/Default"
import MatchPage from "./scout/Match"
import PitPage from "./scout/Pit"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import { screen, colors } from "../constants"

const ScoutPage = () => {
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator initialRouteName={"Default"} screenOptions={{
            headerStyle: {
                height: screen.top + 70,
                backgroundColor: colors.gold,
                shadowOpacity: 0
            },
            headerTitleStyle: {
                fontFamily: "Open Sans",
                fontWeight: "700",
                fontSize: 24,
                color: colors.black
            },
            gestureEnabled: false,
            headerLeft: ({ onPress }) => {
                return (
                    <TouchableWithoutFeedback onPress={() => {
                        ReactNativeHapticFeedback.trigger("impactMedium", { enableVibrateFallback: false })
                        Alert.alert("Are You Sure?", "If you exit the page all of the scouting information for this entry will be lost.", [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            {
                                text: "Yes",
                                onPress
                            }
                        ])
                    }}>
                        <View style={{ flex: 1, width: 80, alignItems: "center", justifyContent: "center" }}>
                            <FontAwesomeIcon icon={faChevronLeft} size={24} color={colors.crimson} />
                        </View>
                    </TouchableWithoutFeedback>
                )
            }
        }}>
            <Stack.Screen name={"Default"} component={DefaultPage} options={{
                headerLeft: null,
                headerStyle: {
                    height: screen.top + 70,
                    backgroundColor: colors.gold,
                    borderBottomColor: colors.crimson,
                    borderBottomWidth: 1
                },
                headerTitle: "Select Scouting Mode"
            }} />
            <Stack.Screen name={"Match"} component={MatchPage} options={{
                headerTitle: "Match Scout"
            }} />
            <Stack.Screen name={"Pit"} component={PitPage} options={{
                headerTitle: "Pit Scout"
            }} />
        </Stack.Navigator>
    )
}

export default ScoutPage