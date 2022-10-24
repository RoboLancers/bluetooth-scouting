const validateSchema = (schema) => {
    const hasKeys = schema.hasOwnProperty("id") && schema.hasOwnProperty("matchForm") && schema.hasOwnProperty("pitForm")

    if (!hasKeys) return { valid: false }

    const correctTypes = typeof schema.id == "string" && Array.isArray(schema.matchForm) && Array.isArray(schema.pitForm)

    if (!correctTypes) return { valid: false }
    
    return {
        valid: [...schema.matchForm, ...schema.pitForm].every((question) => {
            if (!question.hasOwnProperty("type") || typeof question.type != "string" || !question.hasOwnProperty("title") || typeof question.title != "string") return false
            if (![ "header", "text", "number", "timer", "slider", "toggle", "radio", "dropdown" ].includes(question.type)) return false
            if(question.type == "slider"){
                return (
                    question.hasOwnProperty("min") &&
                    question.hasOwnProperty("max") &&
                    question.hasOwnProperty("step") &&
                    question.max > question.min &&
                    question.step < question.max - question.min
                )
            } else {
                return (question.type == "radio" || question.type == "dropdown") == (question.hasOwnProperty("options") && question.options.length > 0)
            }
        }),
        schema
    }
}

export default validateSchema