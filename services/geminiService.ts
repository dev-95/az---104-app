

import { GoogleGenAI, Type } from "@google/genai";
import { QUIZ_LENGTH, GEMINI_MODEL_NAME } from '../constants';
import { QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateAz104Quiz = async (topic?: string, length: number = QUIZ_LENGTH, mainTopic?: string): Promise<QuizQuestion[]> => {
    try {
        let prompt = `You are an expert on the Microsoft Azure AZ-104 exam. Generate ${length} multiple-choice questions.`;
        if (topic && mainTopic && topic !== mainTopic) {
            prompt += ` The questions should focus specifically on the sub-topic of "${topic}" within the main category of "${mainTopic}".`;
        } else if (topic) {
            prompt += ` The questions should focus specifically on the topic of "${topic}".`;
        } else {
            prompt += ` The questions should cover a range of topics from the AZ-104 syllabus, including identity, governance, storage, compute, and virtual networking.`;
        }
        prompt += ` Ensure the questions are challenging and relevant to the exam.`;

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: {
                                type: Type.STRING,
                                description: "The quiz question text."
                            },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "An array of 4 possible answers."
                            },
                            correctAnswerIndex: {
                                type: Type.INTEGER,
                                description: "The 0-based index of the correct answer in the 'options' array."
                            },
                            explanation: {
                                type: Type.STRING,
                                description: "A detailed explanation of why the correct answer is right."
                            }
                        },
                        required: ["question", "options", "correctAnswerIndex", "explanation"]
                    },
                },
            },
        });

        const jsonString = response.text;
        const quizData = JSON.parse(jsonString);

        if (!Array.isArray(quizData) || quizData.length === 0) {
            throw new Error("AI returned no questions.");
        }
        
        // Basic validation
        const validatedQuestions = quizData.filter(q => 
            q.question && Array.isArray(q.options) && q.options.length > 1 &&
            typeof q.correctAnswerIndex === 'number' && q.explanation
        );

        if (validatedQuestions.length !== quizData.length) {
            console.warn("Some questions returned by AI were malformed.", { original: quizData, validated: validatedQuestions });
        }

        if (validatedQuestions.length === 0) {
             throw new Error("AI returned malformed questions.");
        }

        return validatedQuestions;
    } catch (error) {
        console.error("Error generating quiz with Gemini:", error);
        throw new Error("Failed to generate quiz questions. Please check your API key and try again.");
    }
};