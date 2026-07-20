const express = require("express")
const cors = require("cors")

const surveyRoutes = require("./routes/survey.routes")

const sectionRoutes = require("./routes/section.routes")

const app = express()

app.use(cors())

app.use(express.json())

app.use("/api/serveys", surveyRoutes)

app.use("/api/sections", sectionRoutes)

module.exports = app