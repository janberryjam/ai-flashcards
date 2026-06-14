import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return Response.json(
        { error: "No topic provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a flashcard generator for students.

Return STRICTLY in this format:

QUESTION:
Write one clear question about the topic.

ANSWER:
Write a short, simple answer.

KEY POINTS:
- Bullet point 1
- Bullet point 2
- Bullet point 3

Topic: ${topic}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({ result: text });

  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}