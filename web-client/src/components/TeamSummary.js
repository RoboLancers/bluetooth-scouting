import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComments } from "@fortawesome/free-solid-svg-icons"

const TeamSummary = (form, index) => {
    const summaryInputRenders = []
    // assume first entry is the team name
    form.slice(1).forEach((entry, index) => {
        if(Array.isArray(entry.value)){
            const responseRenders = []
            entry.value.forEach((response, index) => {
                responseRenders.push(
                    <li key={index}>
                        {
                            response
                        }
                    </li>
                )
            })

            summaryInputRenders.push(
                <div key={index} className={"summary-input"}>
                    <div className={"summary-key"}>
                        {
                            entry.title
                        }
                    </div>
                    <div className={"summary-value"}>
                        <FontAwesomeIcon icon={faComments} />
                        <div className={"multi-input-value-container"}>
                            <ul>
                                {
                                    responseRenders
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            )
        } else {
            summaryInputRenders.push(
                <div key={index} className={"summary-input"}>
                    <div className={"summary-key"}>
                        {
                            entry.title
                        }
                    </div>
                    <div className={"summary-value"}>
                        {
                            typeof entry.value == "number" ? entry.value.toFixed(2) : typeof entry.value == "boolean" ? (entry.value ? "true" : "false") : entry.value
                        }
                    </div>
                </div>
            )
        }
    })

    return (
        <div key={index} className={"team"}>
            <h3>
                {
                    form[0].value
                }
            </h3>
            {
                summaryInputRenders
            }
        </div>
    )
}

export default TeamSummary