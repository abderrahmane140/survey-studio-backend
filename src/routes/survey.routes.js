const express = require("express")

const router = express.Router()

const {
    createSurvey,
    getAllSurveys,
    getSurveyById,
    updateSurvey
} = require("../controllers/survey.controller")


router.post("/", createSurvey);
router.get("/", getAllSurveys);
router.get("/:id", getSurveyById);
router.put("/:id", updateSurvey);


module.exports = router;