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
const getAllSurveys = async (req, res) => {
    try {
        const surveys = await prisma.survey.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            success: true,
            data: surveys
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getSurveyById = async (req, res) => {
    try {
        const {id} = req.params;

        const survey = await prisma.survey.findUnique({
            where: {
                id
            }
        })

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: "Survey not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: survey
        })
    } catch (error) {

        console.log(error);
        
        return res.status(500).json({
            message: false,
            message: "Internal server error"
        })
    }
}

const updateSurvey = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, description} = req.body

        const survey = await prisma.survey.update({
            where: {
                id
            },
            data: {
                title, 
                description
            }
        })
        return res.status(200).json({
            success: true,
            message: "Survey updated successfully",
            data: survey
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error" 
        })
    }
}

const deleteSurvey = async (req, res) => {
    try {
         
        const {id} = req.params;

        await prisma.survey.delete({
            where: {
                id
            }
        })

        return res.status(200).json({
            success: true,
            message: "Survey deleted successfully"
        })
    } catch (error) {

        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Publish a Survey

const publishSurvey = async ( req, res ) => {
    try {

        const {id} = req.params

        const survey = await prisma.survey.findUnique({
            where: {
                id
            }
        })

        if (!survey){
            return res.status(404).json({
                success: false,
                message: "Survey not found"
            })
        }

        if (survey.status === "published") {
            return res.status(400).json({
                success: false,
                message: "Survey is already published"
            })
        }

        const publishedSurvey = await prisma.survey.update({
            where: {
                id
            },
            data: {
                status: "published",
                publishedAt: new Date()
            }
        })
        return res.status(200).json({
            success: true,
            message: "Survey published successfully",
            data: publishedSurvey
        })
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: "Internal srever error"
        })
    }
}

module.exports = {
    createSurvey,
    getAllSurveys,
    getSurveyById,
    updateSurvey,
    deleteSurvey,
    publishSurvey
}