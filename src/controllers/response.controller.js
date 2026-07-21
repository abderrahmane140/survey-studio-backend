const prisma = require("../config/prisma")

const submitResponse = async (req, res) => {
    try {

        const {surveyId, answers} = req.body

        const survey = await prisma.survey.findUnique({
            where: {
                id: surveyId
            }
        })

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: "Survey not found"
            })
        }

        const response = await prisma.surveyResponse.create({
            data: {
                surveyId
            }
        })

        for (const answer of answers) {
            await prisma.responseAnswer.create({
                data: {
                    responseId: response.id,
                    questionId: answer.questionId,
                    value: answer.value
                }
            })
        }

        return res.status(201).json({
            success: true,
            message: "Survey submitted successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getSurveyResponses = async (req, res) => {
    try {
        const {surveyId} = req.params

        const responses = await prisma.surveyResponse.findMany({
            where: {
                surveyId
            },
            include: {
                answers: {
                    include: {
                        question: true
                    }
                }
            },
            orderBy: {
                submittedAt: "desc"
            }
        })

        return res.status(200).json({
            success: true,
            data: responses
        })
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    submitResponse,
    getSurveyResponses
}