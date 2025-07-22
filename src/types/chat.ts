// Message type for in-memory conversation
export interface Message {
  id: string;
  text: string;
  role: "user" | "assistant";
  createdAt: string;
}

// OpenAI message format
export interface OpenAIMessage {
  role: "user" | "assistant";
  content: string;
}

// Chat API request body
export interface ChatRequest {
  message: string;
  conversationHistory?: OpenAIMessage[];
}

// Chat API response
export interface ChatResponse {
  message: string;
}

// Chat API error response
export interface ChatErrorResponse {
  error: string;
  details?: unknown;
}
