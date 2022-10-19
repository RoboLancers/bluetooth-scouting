import { initialWindowMetrics } from "react-native-safe-area-context"

const screen = {
    width: initialWindowMetrics.frame.width - initialWindowMetrics.insets.left - initialWindowMetrics.insets.right,
    height: initialWindowMetrics.frame.height - initialWindowMetrics.insets.top - initialWindowMetrics.insets.bottom,
    top: initialWindowMetrics.insets.top,
    bottom: initialWindowMetrics.insets.bottom
}

const colors = {
    white: "rgb(245, 245, 245)",
    grey: "rgb(220, 220, 220)",
    dark: "rgb(90, 90, 90)",
    black: "rgb(20, 20, 20)",
    crimson: "rgb(184, 1, 0)",
    pink: "rgb(250, 130, 130)",
    gold: "rgb(245, 245, 245)"
    // gold: "rgb(238, 184, 34)"
}

const bluetoothPeripheral = {
    service: "0425b4be-ebba-4903-96d0-8663974f2123",
    upload: "d6dde2c2-71c3-4907-9232-de076f48f8a9",
    schemaLength: "95df9c18-c01d-489e-af18-63df799ae7d3",
    schemaChunk: "19995b5d-7e8e-4211-9e3f-38428d42" // 4 bytes appended dynamically to retrieve indexed chunk
}

export {
    screen,
    colors,
    bluetoothPeripheral
}