const express = require("express")
const cors = require("cors")

const surveyRoutes = require("./routes/survey.routes")

const sectionRoutes = require("./routes/section.routes")

const questionRoutes = require("./routes/question.routes");

const app = express()

app.use(cors())

app.use(express.json())

app.use("/api/surveys", surveyRoutes)

app.use("/api/sections", sectionRoutes)

app.use("/api/questions", questionRoutes);

module.exports = app