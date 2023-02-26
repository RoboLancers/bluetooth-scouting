import React, { useState, useEffect } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"

import TeamSummary from "../components/TeamSummary"

import mergeForms from "../scripts/mergeForms"
import applyFilters from "../scripts/applyFilters"

import axios from "axios"

const PitStatisticsPage = () => {
    const [forms, setForms] = useState([])

    useEffect(() => {
        document.title = "Lancer Scout - Pit Statistics"

        axios.get("http://localhost:8080/forms").then(({ data }) => setForms(mergeForms(data.filter(form => form.type == "Pit").map(form => JSON.parse(form.inputs)))))
    }, [])

    const [showTeamSummaries, setShowTeamSummaries] = useState(false)
    const toggleShowTeamSummaries = () => setShowTeamSummaries(!showTeamSummaries)

    const [showFilteredTeams, setShowFilteredTeams] = useState(false)
    const toggleShowFilteredTeams = () => setShowFilteredTeams(!showFilteredTeams)

    const [filters, setFilters] = useState([])

    const addFilter = () => setFilters([...filters, { fieldName: "Key", operator: "=", value: "0" }])
    const deleteFilter = (index) => {
        const temp = [...filters]
        temp.splice(index, 1)
        setFilters(temp)
    }
    const updateFilterFieldName = (index, newFieldName) => {
        const temp = [...filters]
        temp[index].fieldName = newFieldName
        setFilters(temp)
    }
    const updateFilterOperator = (index, newOperator) => {
        const temp = [...filters]
        temp[index].operator = newOperator
        setFilters(temp)
    }
    const updateFilterValue = (index, newValue) => {
        const temp = [...filters]
        temp[index].value = newValue
        setFilters(temp)
    }

    const filterRenders = []
    filters.forEach((filter, index) => {
        const handleFieldNameChange = (e) => updateFilterFieldName(index, e.nativeEvent.target.value)
        const handleOperatorChange = (e) => updateFilterOperator(index, e.nativeEvent.target.value)
        const handleValueChange = (e) => updateFilterValue(index, e.nativeEvent.target.value)
        const handleDeletePressed = () => deleteFilter(index)

        filterRenders.push(
            <div key={index} className={"filter"}>
                <textarea className={"filter-param"} value={filter.fieldName} onChange={handleFieldNameChange} />
                <textarea className={"filter-param"} style={{ width: "20px" }} value={filter.operator} onChange={handleOperatorChange} />
                <textarea className={"filter-param"} value={filter.value} onChange={handleValueChange} />
                <FontAwesomeIcon className={"delete-filter"} icon={faTrash} onClick={handleDeletePressed} />
            </div>
        )
    })

    return (
        <React.Fragment>
            <h1>Pit Statistics</h1>
            <hr />
            <section onClick={toggleShowTeamSummaries}>
                <h2>Team Summaries <FontAwesomeIcon className={"toggle-icon"} icon={showTeamSummaries ? faChevronDown : faChevronUp} /></h2>
            </section>
            {
                showTeamSummaries && (
                    <section className={"teams-container"}>
                        {
                            forms.map(TeamSummary)
                        }
                    </section>
                )
            }
            <hr />
            <section onClick={toggleShowFilteredTeams}>
                <h2>Filtered Teams <FontAwesomeIcon className={"toggle-icon"} icon={showFilteredTeams ? faChevronDown : faChevronUp} /></h2>
            </section>
            {
                showFilteredTeams && (
                    <React.Fragment>
                        <section className={"filters-container"}>
                            <div className={"add-filter"} onClick={addFilter}>
                                Add Filter
                                <FontAwesomeIcon style={{ marginLeft: "10px" }} icon={faPlus} />
                            </div>
                            {
                                filterRenders
                            }
                        </section>
                        <section className={"teams-container"}>
                            {
                                applyFilters(forms, filters).map(TeamSummary)
                            }
                        </section>
                    </React.Fragment>
                )
            }
        </React.Fragment>
    )
}

export default PitStatisticsPage