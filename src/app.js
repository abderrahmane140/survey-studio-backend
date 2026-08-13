const express = require("express")
const cors = require("cors")

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const surveyRoutes = require("./routes/survey.routes")

const questionRoutes = require("./routes/question.routes");

const  getPublicSurvey  = require("./routes/public.routes");

const responseRoutes = require("./routes/response.route")

const statisticsRoutes = require("./routes/statistics.routes")

const authRoutes = require("./routes/auth.routes");
const authenticate = require("./middlewares/auth.middleware");

const app = express()

app.use(cors())

app.use(express.json())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use("/api/auth", authRoutes)

app.use("/api/surveys", authenticate, surveyRoutes)
app.use("/api/questions", authenticate, questionRoutes);
app.use("/api/public", getPublicSurvey)   
app.use("/api/statistics", authenticate, statisticsRoutes)


app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
)

module.exports = app