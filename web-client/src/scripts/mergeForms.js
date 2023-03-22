const mergeForms = (forms, teamNameKey) => {
    const teamInputs = []
    forms.forEach(form => {
        const teamName = form.find(teamInput => teamInput.t == teamNameKey).v

        const teamIndex = teamInputs.findIndex(teamInput => typeof teamInput[teamNameKey] == "string" ? teamInput[teamNameKey] == teamName : teamInput[teamNameKey][0] == teamName)
        
        if(teamIndex == -1){
            const mergedTeam = {}
            form.forEach(input => {
                mergedTeam[input.t] = [ input.v ]
            })
            teamInputs.push(mergedTeam)
        } else {
            form.forEach(input => {
                if(teamInputs[teamIndex].hasOwnProperty(input.t)){
                    teamInputs[teamIndex][input.t].push(input.v)
                } else {
                    teamInputs[teamIndex][input.t] = [ input.v ]
                }
            })
        }
    })

    const merged = []

    teamInputs.forEach(teamInput => {
        const inputArray = []
        Object.keys(teamInput).forEach(inputField => {
            let fieldValue = teamInput[inputField]

            if(fieldValue.every(value => value == fieldValue[0])){
                fieldValue = fieldValue[0]
                if(typeof fieldValue == "string" && fieldValue.length > 20){
                    fieldValue = [ fieldValue ]
                }
            } else if(fieldValue.every(value => typeof value == "number")){
                let sum = 0
                fieldValue.forEach(value => sum += value)
                fieldValue = sum / fieldValue.length
            }

            inputArray.push({
                title: inputField,
                value: fieldValue
            })
        })
        merged.push(inputArray)
    })

    return merged
}

export default mergeForms