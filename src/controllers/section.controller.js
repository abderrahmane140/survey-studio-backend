const prisma = require('../config/prisma')

const createSection = async (req, res) => {
    try{
        const { surveyId } = req.params
        const { title } = req.body


        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            })
        }

        //Make sure the survey exists
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId }
        })

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: "Survey not found"
            })
        }

        //Get the last section to determine the next order 
        const lastSection = await prisma.surveySection.findFirst({
            where: { surveyId},
            orderBy: {
                orderIndex: 'desc'
            }
        })

        const section = await prisma.surveySection.create({
            data: {
                title,
                surveyId,
                orderIndex: lastSection ? lastSection.orderIndex + 1 : 1
            }
        })
        
        return res.status(201).json({
            success: true,
            data: section
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Get all sections
const getSections = async (req, res) => {
    try {
        const { surveyId } = req.params

        const sections = await prisma.surveySection.findMany({
            where: {
                surveyId
            },
            orderBy: {
                orderIndex: "asc"
            }
        })

        return res.status(200).json({
            success: true,
            data: sections
        })
    } catch (error) {

        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// update section
const updateSection = async (req, res) => {
    try {

        const { id } = req.params
        const { title, orderIndex } = req.body

        const section = await prisma.surveySection.update({
            where: {
                id
            },
            data: { 
                title,
                orderIndex
            }
        })

        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: section
        })
    } catch(error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Delete section
const deleteSection = async (req, res) => {
    try {
        const {id} = req.params

        await prisma.surveySection.delete({
            where: {
                id
            }
        })

        return res.status(200).json({
            success: true,
            message: "section deleted successfully"
        })
    } catch(error) {

        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Reorder sections within a survey
const reorderSections = async (req, res) => {
    try {
        const { surveyId } = req.params
        const { order } = req.body // array of section IDs in desired order

        if (!Array.isArray(order) || order.length === 0) {
            return res.status(400).json({
                success: false,
                message: "order must be a non-empty array of section IDs"
            })
        }

        const existingSections = await prisma.surveySection.findMany({
            where: { surveyId },
            select: { id: true }
        })

        const existingIds = existingSections.map(s => s.id).sort()
        const submittedIds = [...order].sort()

        const isSameSet =
            existingIds.length === submittedIds.length &&
            existingIds.every((id, i) => id === submittedIds[i])

        if (!isSameSet) {
            return res.status(400).json({
                success: false,
                message: "order must include exactly the sections that belong to this survey"
            })
        }

        await prisma.$transaction(
            order.map((id, index) =>
                prisma.surveySection.update({
                    where: { id },
                    data: { orderIndex: index }
                })
            )
        )

        const sections = await prisma.surveySection.findMany({
            where: { surveyId },
            orderBy: { orderIndex: "asc" }
        })

        return res.status(200).json({
            success: true,
            message: "Sections reordered successfully",
            data: sections
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


module.exports = {
    createSection,
    getSections,
    updateSection,
    deleteSection,
    reorderSections
}