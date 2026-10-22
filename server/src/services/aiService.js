const { blueprints } = require("../data/learningBlueprints");

let OpenAI = null;
try {
  ({ OpenAI } = require("openai"));
} catch (error) {
  OpenAI = null;
}

let client = null;

function getClient() {
  if (!process.env.OPENAI_API_KEY || !OpenAI) {
    return null;
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  return client;
}

function detectTrack(goal, interests = []) {
  const combined = `${goal?.title || ""} ${goal?.description || ""} ${interests.join(" ")}`.toLowerCase();

  if (combined.includes("ai") || combined.includes("machine learning") || combined.includes("ml")) {
    return "ai";
  }

  if (combined.includes("data")) {
    return "dataScience";
  }

  return "fullstack";
}

function fallbackPath(user, goal) {
  const track = detectTrack(goal, user.interests);
  const baseTopics = blueprints[track] || blueprints.fullstack;

  return baseTopics.map((topic, index) => ({
    ...topic,
    orderIndex: index + 1
  }));
}

function fallbackRecommendations(user, goal, topics) {
  const completedTopics = topics.filter((topic) => topic.progress_status === "completed");
  const pendingTopics = topics.filter((topic) => topic.progress_status !== "completed");
  const lowConfidenceTopics = topics.filter((topic) => Number(topic.confidence_score) < 60);
  const nextTopics = pendingTopics.slice(0, 3).map((topic) => ({
    title: topic.title,
    reason: `This is the next logical step toward your goal: ${goal.title}.`,
    expectedOutcome: `You will strengthen ${topic.phase.toLowerCase()} and move your roadmap forward.`
  }));

  const practiceProjects = pendingTopics.slice(0, 2).map((topic, index) => ({
    title: `${topic.title} practice sprint ${index + 1}`,
    description: topic.practice_project || `Create a hands-on project that applies ${topic.title}.`,
    focusArea: topic.phase
  }));

  const resources = pendingTopics
    .flatMap((topic) => Array.isArray(topic.resource_links) ? topic.resource_links : [])
    .slice(0, 5)
    .map((resource) => ({
      title: resource.title,
      url: resource.url
    }));

  const revisionAreas = lowConfidenceTopics.slice(0, 3).map((topic) => ({
    title: topic.title,
    reason: "Your confidence score suggests this topic needs another review pass."
  }));

  const weakAreas = lowConfidenceTopics.slice(0, 3).map((topic) => topic.phase);
  const summary = completedTopics.length === 0
    ? `Start with ${nextTopics[0]?.title || "your first topic"} to begin building momentum toward ${goal.title}.`
    : `You have finished ${completedTopics.length} topic(s). The strongest next move is ${nextTopics[0]?.title || "reviewing your current roadmap"}.`;

  return {
    summary,
    nextTopics,
    practiceProjects,
    resources,
    revisionAreas,
    weakAreas,
    encouragement: `You are progressing toward ${goal.title}. Keep your weekly study sessions focused and consistent.`
  };
}

function buildLearningPathPrompt(user, goal) {
  return `
Create a personalized learning path for a learner.

Learner profile:
- Name: ${user.full_name}
- Current role: ${user.role_title || "Not provided"}
- Proficiency: ${user.proficiency_level}
- Interests: ${(user.interests || []).join(", ") || "Not provided"}
- Weekly target hours: ${user.weekly_target_hours}

Goal:
- Title: ${goal.title}
- Description: ${goal.description || "Not provided"}

Return valid JSON only with this shape:
{
  "topics": [
    {
      "title": "string",
      "description": "string",
      "phase": "string",
      "orderIndex": 1,
      "estimatedHours": 6,
      "difficulty": "beginner|intermediate|advanced",
      "practiceProject": "string",
      "resources": [
        { "title": "string", "url": "https://example.com" }
      ],
      "aiNotes": "string"
    }
  ]
}

Keep the path practical, sequential, and focused on the user's goal.
`;
}

function buildRecommendationPrompt(user, goal, topics) {
  const compactTopics = topics.map((topic) => ({
    title: topic.title,
    phase: topic.phase,
    status: topic.progress_status,
    completionPercent: topic.completion_percent,
    confidenceScore: topic.confidence_score
  }));

  return `
Analyze this learner and recommend the next best learning actions.

Learner profile:
- Name: ${user.full_name}
- Goal: ${goal.title}
- Goal description: ${goal.description || "Not provided"}
- Interests: ${(user.interests || []).join(", ") || "Not provided"}
- Weekly target hours: ${user.weekly_target_hours}

Learning roadmap progress:
${JSON.stringify(compactTopics, null, 2)}

Return valid JSON only:
{
  "summary": "string",
  "nextTopics": [
    {
      "title": "string",
      "reason": "string",
      "expectedOutcome": "string"
    }
  ],
  "practiceProjects": [
    {
      "title": "string",
      "description": "string",
      "focusArea": "string"
    }
  ],
  "resources": [
    {
      "title": "string",
      "url": "https://example.com"
    }
  ],
  "revisionAreas": [
    {
      "title": "string",
      "reason": "string"
    }
  ],
  "weakAreas": ["string"],
  "encouragement": "string"
}

Prioritize what the learner should study next, where they should revise, and what practice project would accelerate learning.
`;
}

function safeJsonParse(content) {
  if (!content) {
    return null;
  }

  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    return null;
  }

  try {
    return JSON.parse(content.slice(firstBrace, lastBrace + 1));
  } catch (error) {
    return null;
  }
}

async function generateLearningPath(user, goal) {
  const openAiClient = getClient();
  if (!openAiClient) {
    return fallbackPath(user, goal);
  }

  try {
    const response = await openAiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You create structured, practical learning roadmaps and always return JSON."
        },
        {
          role: "user",
          content: buildLearningPathPrompt(user, goal)
        }
      ],
      temperature: 0.7
    });

    const parsed = safeJsonParse(response.choices[0]?.message?.content);
    if (!parsed?.topics?.length) {
      return fallbackPath(user, goal);
    }

    return parsed.topics.map((topic, index) => ({
      title: topic.title,
      description: topic.description,
      phase: topic.phase,
      orderIndex: topic.orderIndex || index + 1,
      estimatedHours: topic.estimatedHours || 6,
      difficulty: topic.difficulty || "beginner",
      practiceProject: topic.practiceProject || "",
      resources: Array.isArray(topic.resources) ? topic.resources : [],
      aiNotes: topic.aiNotes || ""
    }));
  } catch (error) {
    return fallbackPath(user, goal);
  }
}

async function generateRecommendations(user, goal, topics) {
  const openAiClient = getClient();
  if (!openAiClient) {
    return fallbackRecommendations(user, goal, topics);
  }

  try {
    const response = await openAiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a learning coach who returns JSON with precise next-step recommendations."
        },
        {
          role: "user",
          content: buildRecommendationPrompt(user, goal, topics)
        }
      ],
      temperature: 0.6
    });

    const parsed = safeJsonParse(response.choices[0]?.message?.content);
    if (!parsed?.summary) {
      return fallbackRecommendations(user, goal, topics);
    }

    return parsed;
  } catch (error) {
    return fallbackRecommendations(user, goal, topics);
  }
}

module.exports = {
  buildLearningPathPrompt,
  buildRecommendationPrompt,
  generateLearningPath,
  generateRecommendations
};
