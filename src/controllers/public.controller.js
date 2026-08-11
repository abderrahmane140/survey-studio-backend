const prisma = require("../config/prisma");

const getPublicSurvey = async (req, res) => {

    try {

        const { id } = req.params;

        const survey = await prisma.survey.findFirst({
            where: {
                id,
                status: "published"
            },
            include: {
                questions: {
                    orderBy: {
                        orderIndex: "asc"
                    }
                }
            }
        });

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: "Survey not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: survey
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};

module.exports = {
    getPublicSurvey
};