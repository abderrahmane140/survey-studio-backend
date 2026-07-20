const express = require("express")

const router = express.Router()

const {
    updateSection,
    deleteSection
} = require("../controllers/section.controller")

router.put("/:id", updateSection)

router.delete("/:id", deleteSection)

module.exports = router