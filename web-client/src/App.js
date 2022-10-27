import React from "react"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import GenerateSchemaPage from "./pages/GenerateSchema"
import UploadSchemaPage from "./pages/UploadSchema"
import SettingsPage from "./pages/Settings"
import StatisticsPage from "./pages/Statistics"

import "./styles.scss"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path={"/generate-schema"} element={<GenerateSchemaPage />} />
                <Route path={"/upload-schema"} element={<UploadSchemaPage />} />
                <Route path={"/settings"} element={<SettingsPage />} />
                <Route path={"/"} element={<StatisticsPage />} />
            </Routes>
        </Router>
    )
}

export default App