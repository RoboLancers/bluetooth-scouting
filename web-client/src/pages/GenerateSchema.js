import React, { useEffect, useState } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons"

const GenerateSchemaPage = () => {
    useEffect(() => {
        document.title = "Lancer Scout - Generate Schema"
    }, [])

    const [formQuestions, setFormQuestions] = useState([])
    const formQuestionsWithOptionsArray = formQuestions.map((question) => {
        if(question.type == "radio" || question.type == "dropdown"){
            return {
                type: question.type,
                title: question.title,
                options: question.options.split(",").map(option => option.trim())
            }
        } else {
            return question
        }
    })

    const addNewQuestion = () => {
        const temp = [...formQuestions]
        temp.push({
            type: "header",
            title: "New Question"
        })
        setFormQuestions(temp)
    }
    
    const setQuestionType = (index, type) => {
        const temp = [...formQuestions]
        if(type != formQuestions[index].type){
            if(type == "header" || type == "text" || type == "number" || type == "timer" || type == "toggle"){
                temp[index] = {
                    type,
                    title: temp[index].title
                }
            } else if(type == "slider") {
                temp[index] = {
                    type: "slider",
                    title: temp[index].title,
                    min: 0,
                    max: 10,
                    step: 1
                }
            } else if(type == "radio" || type == "dropdown") {
                temp[index] = {
                    type: type,
                    title: temp[index].title,
                    options: ""
                }
            }
        }
        setFormQuestions(temp)
    }

    const updateQuestionInfo = (index, change) => {
        const temp = [...formQuestions]
        temp[index][change[0]] = change[1]
        setFormQuestions(temp)
    }

    const deleteQuestion = (index) => {
        const temp = [...formQuestions]
        temp.splice(index, 1)
        setFormQuestions(temp)
    }

    const formQuestionRenders = []

    formQuestions.forEach((question, index) => {
        const optionRenders = []
        
        Object.keys(question).forEach((optionName, innerIndex) => {
            if(optionName == "type") return
            const optionValue = question[optionName]
            optionRenders.push(
                <div key={innerIndex} className={"option-container"}>
                    <div className={"option-container-name"}>
                        {
                            optionName.slice(0, 1).toUpperCase() + optionName.slice(1)
                        }
                    </div>
                    <input type={"text"} value={optionValue} onChange={(e) => {
                        const change = [ optionName, e.nativeEvent.target.value ]
                        updateQuestionInfo(index, change)
                    }} />
                </div>
            )
        })

        formQuestionRenders.push(
            <div key={index} className={"form-question-container"}>
                <div className={"form-question-type-container"}>
                    <div>Type</div>
                    <select className={"form-question-type-selector"} defaultValue={question.type} onChange={(e) => {
                        setQuestionType(index, e.nativeEvent.target.value)
                    }}>
                        <option>header</option>
                        <option>text</option>
                        <option>number</option>
                        <option>timer</option>
                        <option>slider</option>
                        <option>toggle</option>
                        <option>radio</option>
                        <option>dropdown</option>
                    </select>
                    <FontAwesomeIcon className={"delete-form-question"} icon={faTrash} onClick={() => {
                        deleteQuestion(index)
                    }} />
                </div>
                <hr />
                <div className={"form-question-options-container"}>
                    {
                        optionRenders
                    }
                </div>
            </div>
        )
    })

    return (
        <div className="schema-tools">
            <h1>Generate Schema</h1>
            <section>
                <h2>Form Questions</h2>
                {
                    formQuestionRenders
                }
            </section>
            <div className={"action-container"} onClick={addNewQuestion}>
                <div className={"action-text"}>Add New Question </div>
                <FontAwesomeIcon icon={faPlus} />
            </div>
            <section>
                <h2>Generated Schema JSON</h2>
                <div className={"json"}>
                    {
                        JSON.stringify(formQuestionsWithOptionsArray, null, 4)
                    }
                </div>
            </section>
        </div>
    )
}

export default GenerateSchemaPage