const prisma = require("../config/prisma")


const createSurvey = async (req, res) => {
    try {
        const { title, description } = req.body;

        const survey = await prisma.survey.create({
            data: {
                title,
                description
            }
        })

        return res.status(201).json({
            success: true,
            message: "Survey created successfully",
            data: survey
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    createSurvey
}