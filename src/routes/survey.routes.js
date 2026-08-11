const express = require("express")

const router = express.Router()

const {
    createSurvey,
    getAllSurveys,
    getSurveyById,
    updateSurvey,
    deleteSurvey,
    publishSurvey
} = require("../controllers/survey.controller")

const {
    createQuestion,
    getQuestions,
    reorderQuestions
} = require("../controllers/question.conroller");

router.post("/", createSurvey);
router.get("/", getAllSurveys);
router.get("/:id", getSurveyById);
router.put("/:id", updateSurvey);
router.delete("/:id", deleteSurvey);

//Question
router.post("/:surveyId/questions", createQuestion)
router.get("/:surveyId/questions", getQuestions)

router.patch("/:id/publish", publishSurvey);

router.patch("/:surveyId/questions/reorder", reorderQuestions)

module.exports = router;