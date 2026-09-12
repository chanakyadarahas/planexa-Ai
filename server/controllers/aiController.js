import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ========================================
// Generate Project Description
// ========================================

export const generateProjectDescription = async (req, res) => {
  try {
    const { projectName } = req.body;

    if (!projectName) {
      return res.status(400).json({
        error: "Project name is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: `
You are a project management assistant.

Write a clear and professional project description based on the following project name.

Project name:
${projectName}

Return only the project description.
Do not provide a title.
Do not provide bullet points.
Do not provide development tasks.
Keep the description concise and suitable for a project management application.
      `,
    });

    res.json({
      description: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI error:", error.message);

    res.status(500).json({
      error: "Failed to generate project description",
    });
  }
};


// ========================================
// Generate Tasks
// ========================================

export const generateTasks = async (req, res) => {
  try {
    const { projectName } = req.body;

    if (!projectName) {
      return res.status(400).json({
        error: "Project name is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: `
You are a project management assistant.

Based on the following project name, generate 8 to 10 practical development tasks for the project.

Project name:
${projectName}

Return only the task names as a numbered list.
Do not provide explanations.
Do not provide descriptions.
      `,
    });

    res.json({
      tasks: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI error:", error.message);

    res.status(500).json({
      error: "Failed to generate tasks",
    });
  }
};


// ========================================
// Generate Task Description
// ========================================

export const generateTaskDescription = async (req, res) => {
  try {
    const { taskName } = req.body;

    if (!taskName) {
      return res.status(400).json({
        error: "Task name is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: `
You are a project management assistant.

Write a clear and professional description for the following development task.

Task name:
${taskName}

Return only the task description.
Do not provide a title.
Do not provide bullet points.
Keep the description concise and practical.
      `,
    });

    res.json({
      description: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI error:", error.message);

    res.status(500).json({
      error: "Failed to generate task description",
    });
  }
};