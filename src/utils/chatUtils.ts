import { Message, OpenAIMessage } from "@/types/chat";

// Local storage key for storing chat messages
const CHAT_STORAGE_KEY = "chatMessages";

export const loadMessagesFromStorage = (): Message[] => {
  try {
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!savedMessages) return [];

    return JSON.parse(savedMessages);
  } catch (error) {
    console.error("Failed to parse saved messages:", error);
    return [];
  }
};

export const saveMessagesToStorage = (messages: Message[]): void => {
  if (messages.length > 0) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }
};

export const clearMessagesFromStorage = (): void => {
  localStorage.removeItem(CHAT_STORAGE_KEY);
};

export const convertToOpenAIFormat = (messages: Message[]): OpenAIMessage[] => {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.text,
  }));
};

export const createMessage = (
  text: string,
  role: "user" | "assistant"
): Message => {
  return {
    id: `${role}-${Date.now()}`,
    text: text.trim(),
    role,
    createdAt: new Date().toISOString(),
  };
};

export const scrollToBottom = (
  ref: React.RefObject<HTMLDivElement | null>
): void => {
  ref.current?.scrollIntoView({ behavior: "smooth" });
};

export const formatMessageTime = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString();
};
