"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useChatState } from "@/hooks/useChatState";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import { cardVariants } from "@/constants/animations";

export default function Chat() {
  const {
    // State
    messages,
    input,
    isLoading,
    buttonRotation,

    // Refs
    scrollAreaRef,
    messagesEndRef,
    textareaRef,

    // Actions
    setInput,
    sendMessage,
    clearConversation,
  } = useChatState();

  // Handle Enter key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-4 flex items-center justify-center">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl h-[85vh]"
      >
        <Card className="h-full flex flex-col shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          {/* Header with title and clear button */}
          <ChatHeader
            messageCount={messages.length}
            onClearChat={clearConversation}
          />

          {/* Messages area with welcome screen and loading */}
          <MessageList
            messages={messages}
            isLoading={isLoading}
            scrollAreaRef={scrollAreaRef}
            messagesEndRef={messagesEndRef}
          />

          {/* Input area with textarea and send button */}
          <ChatInput
            input={input}
            isLoading={isLoading}
            buttonRotation={buttonRotation}
            textareaRef={textareaRef}
            onInputChange={setInput}
            onSendMessage={sendMessage}
            onKeyPress={handleKeyPress}
          />
        </Card>
      </motion.div>
    </div>
  );
}
