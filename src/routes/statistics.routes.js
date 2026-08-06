const express = require("express")

const router = express.Router()

const {
    getAllSurveysStatistics
} = require("../controllers/statistics.controller")

router.get("/", getAllSurveysStatistics)

module.exports = router