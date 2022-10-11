import { name as AppName } from "./app.json"

import { AppRegistry } from "react-native"

import App from "./src/App"

import "react-native-gesture-handler"

AppRegistry.registerComponent(AppName, () => App)