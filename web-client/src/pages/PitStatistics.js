import React, { useState, useEffect } from "react"

import TeamInput from "../components/TeamInput"

import mergeForms from "../scripts/mergeForms"

import axios from "axios"

const PitStatisticsPage = () => {
    const [forms, setForms] = useState([])

    useEffect(() => {
        document.title = "Lancer Scout - Pit Statistics"

        axios.get("http://localhost:8080/forms").then(({ data }) => setForms(mergeForms(data.filter(form => form.type == "Pit").map(form => JSON.parse(form.inputs)), "Team Name")))
    }, [])

    const [focusedTeamName, setFocusedTeamName] = useState("Select A Team")

    const teamNames = forms.map(teamInputs => teamInputs.find(input => input.title == "Team Name").value)
    teamNames.unshift("Select A Team")

    const focusTeam = forms.find(teamInputs => teamInputs.find(input => input.title == "Team Name").value == focusedTeamName)

    return (
        <React.Fragment>
            <h1>Pit Statistics</h1>
            <hr />
            <div style={{ width: "100%", textAlign: "center" }}>
                <select onChange={(e) => {
                    setFocusedTeamName(e.target.value)
                }}>
                    {
                        teamNames.map((name, index) => {
                            return (
                                <option key={index}>
                                    {
                                        name
                                    }
                                </option>
                            )
                        })
                    }
                </select>
            </div>
            {
                focusedTeamName != "Select A Team" && (
                    focusTeam.map(({ title, value }, index) => {
                        return (
                            <TeamInput key={index} title={title} value={value} />
                        )
                    })
                )
            }
        </React.Fragment>
    )
}

export default PitStatisticsPage