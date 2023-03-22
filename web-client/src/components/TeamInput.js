import React from "react"

const primitiveToString = (value) => {
    if(typeof value == "string"){
        return value
    } else if(typeof value == "number"){
        return value.toPrecision(3)
    } else if(typeof value == "boolean"){
        return value ? "true" : "false"
    } else {
        return "TYPE ERROR"
    }
}

const arrayToString = (value) => {
    const elems = []

    for(let i = 0;i<value.length - 1;i++){
        elems.push(
            <span key={i * 2}>
                {
                    value[i]
                }
            </span>
        )
        elems.push(
            <React.Fragment key={i * 2 + 1}>
                <br />
                •
                <br />
            </React.Fragment>
        )
    }

    elems.push(
        <span key={"last"}>
            {
                value[value.length - 1]
            }
        </span>
    )

    return elems
}

const TeamInput = ({ title, value }) => {
    const displayValue = Array.isArray(value) ? arrayToString(value.map(v => primitiveToString(v))) : primitiveToString(value)

    return (
        <div className={"team-input"}>
            <div className={"team-input-title"}>
                {
                    title
                }
            </div>
            <div className={"team-input-value"}>
                {
                    displayValue
                }
            </div>
        </div>
    )
}

export default TeamInput