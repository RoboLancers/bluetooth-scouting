import React, { useEffect } from "react"

import axios from "axios"

const SettingsPage = () => {
    useEffect(() => {
        document.title = "Lancer Scout - Setting"
    }, [])

    const deleteAllForms = () => axios.post("/delete")

    return (
        <React.Fragment>
            <h1>Settings</h1>
            <section>
                <div onClick={deleteAllForms}>Delete All Forms</div>
            </section>
        </React.Fragment>
    )
}

export default SettingsPage