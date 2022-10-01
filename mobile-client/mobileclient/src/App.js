import React from "react"

import { TouchableWithoutFeedback, View, Text } from "react-native"

import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import ScoutPage from "./pages/Scout"
import SchemaPage from "./pages/Schema"
import UploadPage from "./pages/Upload"

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faBinoculars, faFileCode, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons"

import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import { screen, colors } from "./constants"

const App = () => {
    const Tab = createBottomTabNavigator()

    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName={"Match"} screenOptions={({ route, navigation }) => {
                return {
                    headerStyle: {
                        height: screen.top + 70,
                        backgroundColor: colors.white,
                        borderBottomColor: colors.flair,
                        borderBottomWidth: 1
                    },
                    headerTitleStyle: {
                        fontFamily: "Open Sans",
                        fontWeight: "700",
                        fontSize: 24,
                        color: colors.black
                    },
                    tabBarStyle: {
                        height: screen.bottom + 70,
                        backgroundColor: colors.white,
                        borderTopColor: colors.flair,
                        borderTopWidth: 1
                    },
                    tabBarLabelStyle: {
                        fontFamily: "Open Sans",
                        fontWeight: "500",
                        fontSize: 16,
                        paddingBottom: 6
                    },
                    tabBarButton: (props) => {
                        return (
                            <TouchableWithoutFeedback onPress={() => {
                                ReactNativeHapticFeedback.trigger("impactLight", { enableVibrateFallback: false })
                                navigation.navigate(route.name)
                            }}>
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                    {
                                        props.children
                                    }
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    },
                    tabBarActiveTintColor: colors.flair,
                    tabBarInactiveTintColor: colors.black
                }
            }}>
                <Tab.Screen name={"Scout"} component={ScoutPage} options={{
                    headerShown: false,
                    tabBarIcon: (props) => <FontAwesomeIcon icon={faBinoculars} {...props} />
                }} />
                <Tab.Screen name={"Schema"} component={SchemaPage} options={{
                    tabBarIcon: (props) => <FontAwesomeIcon icon={faFileCode} {...props} />
                }} />
                <Tab.Screen name={"Upload"} component={UploadPage} options={{
                    tabBarIcon: (props) => <FontAwesomeIcon icon={faCloudArrowUp} {...props} />
                }} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default App