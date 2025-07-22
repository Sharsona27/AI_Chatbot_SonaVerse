import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { OpenAIMessage } from "@/types/chat";

// Zod validation schema for the request body
const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").trim(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = chatRequestSchema.parse(body);

    const { message, conversationHistory } = validatedData;

    // Build the conversation for Gemini
    const geminiMessages = [
      ...conversationHistory.map((msg: { role: "user" | "assistant"; content: string }) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    // Call Gemini API
    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: geminiMessages,
        }),
      }
    );

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error('Gemini API error:', errorText);
      return NextResponse.json({ error: "Gemini API error", details: errorText }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const assistantResponse =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, but I cannot generate a response at the moment.";

    // Return the response
    return NextResponse.json({
      message: assistantResponse,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
