const express = require("express")

const router = express.Router()

const {
    createSurvey,
    getAllSurveys,
    getSurveyById
} = require("../controllers/survey.controller")


router.post("/", createSurvey);
router.get("/", getAllSurveys);
router.get("/:id", getSurveyById);


module.exports = router;