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
    createSection,
    getSections,
    reorderSections
} = require("../controllers/section.controller")

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

router.patch("/:id/publish", publishSurvey);

router.patch("/:surveyId/sections/reorder", reorderSections)

router.patch(
    "/:surveyId/sections/:sectionId/questions/reorder",
    reorderQuestions
)

module.exports = router;