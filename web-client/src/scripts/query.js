// get array of all unique input field names
const getAllFieldNames = (forms) => {
    const allFieldNames = []

    forms.forEach(form => {
        Object.keys(form).forEach(name => {
            if(!allFieldNames.includes(name)){
                allFieldNames.push(name)
            }
        })
    })

    return allFieldNames
}

// get array of all unique types of the provided input field
const getAllInputTypesOfField = (forms, fieldName) => {
    const allFieldTypes = []

    forms.forEach(form => {
        const formFieldType = typeof form[fieldName]
        if(!allFieldTypes.includes(formFieldType)){
            allFieldTypes.push(formFieldType)
        }
    })

    return allFieldTypes
}

// get array of all (not unique) answers to the provided input field
const getAllAnswersToField = (forms, fieldName) => forms.map(form => form[fieldName])

// get array of all forms where the answer to the provided field is the provided value
const getAllFormsWhereFieldIsExactValue = (forms, fieldName, value) => forms.filter(form => form[fieldName] == value)

// get array of all forms that have an answer to the provided field greater than the provided value 
const getAllFormsWhereFieldIsGreaterThanValue = (forms, fieldName, value) => forms.filter(form => form[fieldName] > value)

// get array of all forms that have an answer to the provided field less than the provided value 
const getAllFormsWhereFieldIsLessThanValue = (forms, fieldName, value) => forms.filter(form => form[fieldName] < value)

// get array of all forms where the answer to the provided field is true
const getAllFormsWhereFieldIsTrue = (forms, fieldName) => forms.filter(form => form[fieldName])

// get array of all forms where the answer to the provided field is false
const getAllFormsWhereFieldIsFalse = (forms, fieldName) => forms.filter(form => !form[fieldName])