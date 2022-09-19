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

export {
    screen,
    colors
}