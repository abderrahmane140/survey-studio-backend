const express = require("express")

const router = express.Router()

const {
    createSurvey,
    getAllSurveys
} = require("../controllers/survey.controller")


router.post("/", createSurvey);
router.get("/", getAllSurveys);


module.exports = router;