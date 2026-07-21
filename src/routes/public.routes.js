const express = require("express")

const router = express.Router()


const {
    getPublicSurvey
} = require("../controllers/public.controller")

router.get("/surveys/:id", getPublicSurvey)

module.exports = router