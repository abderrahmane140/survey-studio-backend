const express = require('express')

const router = express.Router()


const {
    updateQuestion,
    deleteQuestion
} = require("../controllers/question.conroller");

router.put("/:id", updateQuestion)

router.delete("/:id", deleteQuestion)

module.exports = router