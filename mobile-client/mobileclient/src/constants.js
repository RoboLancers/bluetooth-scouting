import { initialWindowMetrics } from "react-native-safe-area-context"

const screen = {
    width: initialWindowMetrics.frame.width - initialWindowMetrics.insets.left - initialWindowMetrics.insets.right,
    height: initialWindowMetrics.frame.height - initialWindowMetrics.insets.top - initialWindowMetrics.insets.bottom,
    top: initialWindowMetrics.insets.top,
    bottom: initialWindowMetrics.insets.bottom
}

const colors = {
    white: "rgb(250, 250, 250)",
    grey: "rgb(230, 230, 230)",
    dark: "rgb(90, 90, 90)",
    black: "rgb(20, 20, 20)",
    flair: "rgb(250, 60, 100)",
    flairLight: "rgb(250, 170, 190)"
}

const bluetoothPeripheral = {
    serviceUUID: "0425b4be-ebba-4903-96d0-8663974f2123",
    characteristicUUID: "d6dde2c2-71c3-4907-9232-de076f48f8a9"
}

export {
    screen,
    colors,
    bluetoothPeripheral
}