// get array of all forms where the answer to the provided field is the provided value
const getAllFormsWhereFieldIsExactValue = (forms, fieldName, value) => forms.filter(
    form => Array.isArray(form[fieldName]) ?
        form[fieldName].some(v => v == value) :
        form[fieldName] == value
)

// get array of all forms where the answer to the provided field is the provided value
const getAllFormsWhereFieldIsNotExactValue = (forms, fieldName, value) => forms.filter(
    form => Array.isArray(form[fieldName]) ?
        form[fieldName].some(v => v != value) :
        form[fieldName] != value
)

// get array of all forms that have an answer to the provided field greater than the provided value 
const getAllFormsWhereFieldIsGreaterThanValue = (forms, fieldName, value) => forms.filter(form => typeof form[fieldName] == "number" && form[fieldName] > value)

// get array of all forms that have an answer to the provided field less than the provided value 
const getAllFormsWhereFieldIsLessThanValue = (forms, fieldName, value) => forms.filter(form => typeof form[fieldName] == "number" && form[fieldName] < value)

// get array of all forms that have an answer to the provided field greater than the provided value 
const getAllFormsWhereFieldIsGreaterThanOrEqualToValue = (forms, fieldName, value) => forms.filter(form => typeof form[fieldName] == "number" && form[fieldName] >= value)

// get array of all forms that have an answer to the provided field less than the provided value 
const getAllFormsWhereFieldIsLessThanOrEqualToValue = (forms, fieldName, value) => forms.filter(form => typeof form[fieldName] == "number" && form[fieldName] <= value)

const applyFilters = (forms, filters) => {
    let filtered = forms.map(form => {
        const formObject = {}
        form.forEach(input => {
            formObject[input.title] = input.value
        })
        return formObject
    })

    filters.forEach(filter => {
        const filterValue = filter.value.trim() 
        const typeCoercedFilterValue = (filterValue == "true" || filterValue == "false") ? filterValue == "true" : (!isNaN(filterValue) && !isNaN(parseFloat(filterValue))) ? parseFloat(filterValue) : filterValue

        const filterFunctionMap = {
            "=": getAllFormsWhereFieldIsExactValue,
            "!=": getAllFormsWhereFieldIsNotExactValue,
            ">": getAllFormsWhereFieldIsGreaterThanValue,
            "<": getAllFormsWhereFieldIsLessThanValue,
            ">=": getAllFormsWhereFieldIsGreaterThanOrEqualToValue,
            "<=": getAllFormsWhereFieldIsLessThanOrEqualToValue
        }

        if(Object.keys(filterFunctionMap).includes(filter.operator.trim())){
            filtered = filterFunctionMap[filter.operator.trim()](filtered, filter.fieldName.trim(), typeCoercedFilterValue)
        }
    })

    filtered = filtered.map(form => {
        const formArray = []
        Object.keys(form).forEach(inputField => {
            formArray.push({
                title: inputField,
                value: form[inputField]
            })
        })
        return formArray
    })

    return filtered
}

export default applyFilters