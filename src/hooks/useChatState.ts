import { useState, useEffect, useRef } from "react";
import { Message, ChatRequest, ChatResponse } from "@/types/chat";
import {
  loadMessagesFromStorage,
  saveMessagesToStorage,
  clearMessagesFromStorage,
  convertToOpenAIFormat,
  createMessage,
  scrollToBottom,
} from "@/utils/chatUtils";

export const useChatState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonRotation, setButtonRotation] = useState(0);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedMessages = loadMessagesFromStorage();
    setMessages(savedMessages);
  }, []);

  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  const clearConversation = () => {
    setMessages([]);
    clearMessagesFromStorage();
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = createMessage(input, "user");

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setButtonRotation(360);
    setTimeout(() => setButtonRotation(0), 500);

    try {
      const requestBody: ChatRequest = {
        message: userMessage.text,
        conversationHistory: convertToOpenAIFormat(messages),
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      const assistantMessage = createMessage(data.message, "assistant");

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = createMessage(
        "Sorry, I encountered an error. Please try again.",
        "assistant"
      );

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    isLoading,
    buttonRotation,

    scrollAreaRef,
    messagesEndRef,
    textareaRef,

    setInput,
    sendMessage,
    clearConversation,
  };
};
