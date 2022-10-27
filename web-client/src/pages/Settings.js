import React, { useEffect } from "react"

const SettingsPage = () => {
    useEffect(() => {
        document.title = "Lancer Scout - Settingd"
    }, [])

    return (
        <h1>Settings</h1>
    )
}

export default SettingsPage