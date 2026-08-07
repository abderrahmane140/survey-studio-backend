const prisma = require("../config/prisma");

const allowedTypes = [
  "short_text",
  "long_text",
  "email",
  "number",
  "date",
  "single_choice",
  "multiple_choice",
  "rating",
];

const createQuestion = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const { label, type, required, placeholder, description, options } =
      req.body;

    const section = await prisma.surveySection.findUnique({
      where: {
        id: sectionId,
      },
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question type",
      });
    }

    const lastQuestion = await prisma.surveyQuestion.findFirst({
      where: {
        sectionId,
      },
      orderBy: {
        orderIndex: "desc",
      },
    });

    const [question] = await prisma.$transaction([
      prisma.surveyQuestion.create({
        data: {
          sectionId,
          label,
          type,
          required: required ?? false,
          placeholder,
          description,
          options,
          orderIndex: lastQuestion ? lastQuestion.orderIndex + 1 : 1,
        },
      }),

      prisma.survey.update({
        where: {
          id: section.surveyId,
        },
        data: {
          updatedAt: new Date(),
        },
      }),
    ]);

    return res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Questions
const getQuestions = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const questions = await prisma.surveyQuestion.findMany({
      where: {
        sectionId,
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Update Question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const { label, type, description, placeholder, required, options } =
      req.body;

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question type",
      });
    }

    // Look up the question first — we need its section to find the survey
    const existingQuestion = await prisma.surveyQuestion.findUnique({
      where: { id },
      include: { section: true },
    });

    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const [question] = await prisma.$transaction([
      prisma.surveyQuestion.update({
        where: {
          id,
        },
        data: {
          label,
          type,
          description,
          placeholder,
          required,
          options,
        },
      }),

      prisma.survey.update({
        where: {
          id: existingQuestion.section.surveyId,
        },
        data: {
          updatedAt: new Date(),
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: question,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete Question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Look up the question first — same reason as updateQuestion
    const existingQuestion = await prisma.surveyQuestion.findUnique({
      where: { id },
      include: { section: true },
    });

    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await prisma.$transaction([
      prisma.surveyQuestion.delete({
        where: {
          id,
        },
      }),

      prisma.survey.update({
        where: {
          id: existingQuestion.section.surveyId,
        },
        data: {
          updatedAt: new Date(),
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reorder questions within a section
const reorderQuestions = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { order } = req.body; 

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({
        success: false,
        message: "order must be a non-empty array of question IDs",
      });
    }

    const section = await prisma.surveySection.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const existingQuestions = await prisma.surveyQuestion.findMany({
      where: { sectionId },
      select: { id: true },
    });

    const existingIds = existingQuestions.map((q) => q.id).sort();
    const submittedIds = [...order].sort();

    const isSameSet =
      existingIds.length === submittedIds.length &&
      existingIds.every((id, i) => id === submittedIds[i]);

    if (!isSameSet) {
      return res.status(400).json({
        success: false,
        message: "order must include exactly the questions that belong to this section",
      });
    }

    await prisma.$transaction([
      ...order.map((id, index) =>
        prisma.surveyQuestion.update({
          where: { id },
          data: { orderIndex: index },
        })
      ),
      prisma.survey.update({
        where: { id: section.surveyId },
        data: { updatedAt: new Date() },
      }),
    ]);

    const questions = await prisma.surveyQuestion.findMany({
      where: { sectionId },
      orderBy: { orderIndex: "asc" },
    });

    return res.status(200).json({
      success: true,
      message: "Questions reordered successfully",
      data: questions,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  reorderQuestions
};