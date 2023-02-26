import React, { useEffect, useState } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons"

import axios from "axios"

const UploadSchemaPage = () => {
    useEffect(() => {
        document.title = "Lancer Scout - Upload Schema"
    }, [])

    const [id, setId] = useState("")
    const onIdChange = (e) => setId(e.nativeEvent.target.value)

    const [matchForm, setMatchForm] = useState("")
    const onMatchFormChange = (e) => setMatchForm(e.nativeEvent.target.value)

    const [pitForm, setPitForm] = useState("")
    const onPitFormChange = (e) => setPitForm(e.nativeEvent.target.value)

    const upload = () => {
        try {
            const matchFormJSON = JSON.parse(matchForm)
            const pitFormJSON = JSON.parse(pitForm)

            axios.post("http://localhost:8080/schema", {
                schema: {
                    id,
                    matchForm: matchFormJSON,
                    pitForm: pitFormJSON
                }
            }).then(() => {
                alert("Successfully uploaded new schema to the server and archived existing schema.")
            }).catch((e) => {
                console.log(e)
                alert("Failed to connect to server, make sure it is running.")
            })
        } catch(e){
            alert("Forms were not valid JSON, make sure you copy pasted fully if you used the generator.")
        }
    }

    return (
        <React.Fragment>
            <h1>Upload Schema</h1>
            <section>
                <h2>Form Information</h2>
                <div>
                    <h3>Form Id:</h3>
                    <input className={"wide-input"} type="text" value={id} onChange={onIdChange} />
                </div>
                <div>
                    <h3>Match Scout Form</h3>
                    <textarea className={"json"} value={matchForm} onChange={onMatchFormChange} />
                </div>
                <div>
                    <h3>Pit Scout Form</h3>
                    <textarea className={"json"} value={pitForm} onChange={onPitFormChange} />
                </div>
            </section>
            <div className={"action-container"} onClick={upload}>
                <div className={"action-text"}>Upload</div>
                <FontAwesomeIcon icon={faCloudArrowUp} />
            </div>
        </React.Fragment>
    )
}

export default UploadSchemaPage