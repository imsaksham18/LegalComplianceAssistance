import httpClient from "../api/httpClient";
import { answerLocally } from "../engine/copilotEngine";

// "remote" targets a future gateway route (/assistant/ask) backed by Spring AI + pgvector RAG.
const MODE = process.env.REACT_APP_ASSISTANT_MODE || "local";

/**
 * Remote contract: POST /assistant/ask { question, context }
 *   -> { title, summary: string[], items: [{label, detail, tone, route}], citations: [{label, route}] }
 */
export const askCopilot = async (question, intel) => {
  if (MODE !== "remote") return answerLocally(question, intel);

  try {
    const { data } = await httpClient.post("/assistant/ask", {
      question,
      context: {
        healthScore: intel.healthScore,
        maturityLevel: intel.maturity.level,
      },
    });
    return {
      followUps: [],
      items: [],
      citations: [],
      ...data,
      grounded: true,
      source: "rag",
    };
  } catch (error) {
    return { ...answerLocally(question, intel), degraded: error.message };
  }
};
