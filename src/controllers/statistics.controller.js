const prisma = require("../config/prisma");

// Helper: questions now live directly on the survey
const getQuestionsFromSurvey = (survey) => survey.questions;

// Stats for ONE survey
const getSurveyStatistics = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderIndex: "asc" },
          include: { answers: true },
        },
        responses: { select: { id: true } },
      },
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    const questions = getQuestionsFromSurvey(survey);

    const totalResponses = survey.responses.length;
    const totalQuestions = questions.length;

    const totalPossibleAnswers = totalResponses * totalQuestions;
    const totalActualAnswers = questions.reduce(
      (sum, q) => sum + q.answers.length,
      0
    );
    const averageCompletionRate =
      totalPossibleAnswers > 0
        ? Number(((totalActualAnswers / totalPossibleAnswers) * 100).toFixed(2))
        : 0;

    const questionStats = questions.map((q) => {
      const totalAnswers = q.answers.length;
      let breakdown = null;

      if (q.type === "single_choice" || q.type === "multiple_choice") {
        breakdown = {};
        for (const answer of q.answers) {
          const values = Array.isArray(answer.value) ? answer.value : [answer.value];
          for (const v of values) {
            breakdown[v] = (breakdown[v] || 0) + 1;
          }
        }
      }

      if (q.type === "rating") {
        const ratings = q.answers
          .map((a) => Number(a.value))
          .filter((n) => !Number.isNaN(n));

        breakdown = {
          average: ratings.length
            ? Number((ratings.reduce((s, n) => s + n, 0) / ratings.length).toFixed(2))
            : 0,
          distribution: ratings.reduce((acc, n) => {
            acc[n] = (acc[n] || 0) + 1;
            return acc;
          }, {}),
        };
      }

      return {
        id: q.id,
        label: q.label,
        type: q.type,
        totalAnswers,
        breakdown,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        surveyId: survey.id,
        title: survey.title,
        status: survey.status,
        totalResponses,
        totalQuestions,
        averageCompletionRate,
        questions: questionStats,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Stats across ALL surveys
const getAllSurveysStatistics = async (req, res) => {
  try {
    const surveys = await prisma.survey.findMany({
      include: {
        questions: {
          include: { answers: true },
        },
        responses: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const surveyStats = surveys.map((survey) => {
      const questions = getQuestionsFromSurvey(survey);

      const totalResponses = survey.responses.length;
      const totalQuestions = questions.length;

      const totalPossibleAnswers = totalResponses * totalQuestions;
      const totalActualAnswers = questions.reduce(
        (sum, q) => sum + q.answers.length,
        0
      );
      const averageCompletionRate =
        totalPossibleAnswers > 0
          ? Number(((totalActualAnswers / totalPossibleAnswers) * 100).toFixed(2))
          : 0;

      return {
        surveyId: survey.id,
        title: survey.title,
        status: survey.status,
        totalResponses,
        totalQuestions,
        averageCompletionRate,
      };
    });

    const totalSurveys = surveyStats.length;
    const totalResponses = surveyStats.reduce((sum, s) => sum + s.totalResponses, 0);
    const totalQuestions = surveyStats.reduce((sum, s) => sum + s.totalQuestions, 0);

    return res.status(200).json({
      success: true,
      data: {
        totalSurveys,
        totalResponses,
        totalQuestions,
        surveys: surveyStats,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getSurveyStatistics,
  getAllSurveysStatistics,
};