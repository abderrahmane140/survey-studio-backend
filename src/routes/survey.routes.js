const express = require("express")

const router = express.Router()

const {
    createSurvey
} = require("../controllers/survey.controller")


router.post("/", createSurvey);

module.exports = router;