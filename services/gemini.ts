
import { GoogleGenAI, Type } from "@google/genai";
import { Task, FileItem } from "../types";

export const getGeminiPlan = async (tasks: Task[], fileStructure: FileItem[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const taskContext = tasks.map(t => `${t.title} (${t.status})`).join(', ');
  const fileContext = JSON.stringify(fileStructure);

  const prompt = `System state: 
  Tasks: ${taskContext}
  File Structure: ${fileContext}

  Act as a Silicon Autonomous PM. Provide a list of thoughts and actions in JSON format.
  Analyze the architecture based on the files and tasks. Focus on high-level system coherence.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 8000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plans: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  thought: { type: Type.STRING },
                  action: { type: Type.STRING },
                  timestamp: { type: Type.STRING }
                },
                required: ["thought", "action", "timestamp"]
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text.trim());
    return data.plans;
  } catch (error) {
    console.error("Gemini Error:", error);
    return [{
      thought: "Neural bridge interrupted. Retrying sync...",
      action: "Restarting thinking protocol.",
      timestamp: new Date().toLocaleTimeString()
    }];
  }
};

export const analyzeArchitecture = async (files: FileItem[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Examine this file structure and suggest a scalable architecture for a high-performance autonomous system: ${JSON.stringify(files)}. Return a concise technical summary.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });

  return response.text;
};
