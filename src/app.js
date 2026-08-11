const express = require("express")
const cors = require("cors")

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const surveyRoutes = require("./routes/survey.routes")

const questionRoutes = require("./routes/question.routes");

const  getPublicSurvey  = require("./routes/public.routes");

const responseRoutes = require("./routes/response.route")

const statisticsRoutes = require("./routes/statistics.routes")

const app = express()

app.use(cors())

app.use(express.json())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use("/api/surveys", surveyRoutes)

app.use("/api/questions", questionRoutes);

app.use("/api/public", getPublicSurvey)

app.use("/api/responses", responseRoutes);

app.use("/api/statistics", statisticsRoutes)



app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
)

module.exports = app