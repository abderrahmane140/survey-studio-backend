const express = require("express")

const router = express.Router()

const {
    createSurvey,
    getAllSurveys,
    getSurveyById,
    updateSurvey,
    deleteSurvey
} = require("../controllers/survey.controller")

const {
    createSection,
    getSections
} = require("../controllers/section.controller")

const {
    createQuestion,
    getQuestions
} = require("../controllers/question.conroller");

router.post("/", createSurvey);
router.get("/", getAllSurveys);
router.get("/:id", getSurveyById);
router.put("/:id", updateSurvey);
router.delete("/:id", deleteSurvey);


//Sections
router.post("/:surveyId/sections", createSection)
router.get("/:surveyId/sections", getSections)

//Question
router.post(
    "/:surveyId/sections/:sectionId/questions",
    createQuestion
)

router.get(
    "/:surveyId/sections/:sectionId/questions",
    getQuestions
);
module.exports = router;