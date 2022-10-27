import React, { useEffect } from "react"

const StatisticsPage = () => {
    useEffect(() => {
        document.title = "Lancer Scout - Statistics"
    }, [])

    return (
        <h1>Statistics</h1>
    )
}

export default StatisticsPage