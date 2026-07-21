const express = require("express")

const router = express.Router()

const {
    submitResponse,
    getSurveyResponses
} = require("../controllers/response.controller")

router.post("/", submitResponse)

router.get("/survey/:surveyId", getSurveyResponses);

module.exports = router;