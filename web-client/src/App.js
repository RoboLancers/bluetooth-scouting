import React from "react"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import MatchStatisticsPage from "./pages/MatchStatistics"
import PitStatisticsPage from "./pages/PitStatistics"
import GenerateSchemaPage from "./pages/GenerateSchema"
import UploadSchemaPage from "./pages/UploadSchema"
import SettingsPage from "./pages/Settings"
import DefaultPage from "./pages/Default"

import "./styles.scss"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path={"/match-statistics"} element={<MatchStatisticsPage />} />
                <Route path={"/pit-statistics"} element={<PitStatisticsPage />} />
                <Route path={"/generate-schema"} element={<GenerateSchemaPage />} />
                <Route path={"/upload-schema"} element={<UploadSchemaPage />} />
                <Route path={"/settings"} element={<SettingsPage />} />
                <Route path={"/"} element={<DefaultPage />} />
            </Routes>
        </Router>
    )
}

export default App