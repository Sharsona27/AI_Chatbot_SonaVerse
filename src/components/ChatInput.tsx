import { motion, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { RefObject } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  buttonRotation: number;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

/**
 * Input component for the chat interface
 * Features auto-resizing textarea and animated send button
 */
export default function ChatInput({
  input,
  isLoading,
  buttonRotation,
  textareaRef,
  onInputChange,
  onSendMessage,
  onKeyPress,
}: ChatInputProps) {
  // Animation values for input scaling
  const inputScale = useSpring(1);

  return (
    <CardFooter className="border-t bg-gradient-to-r from-card via-card/90 to-card p-4">
      <motion.div
        className="flex w-full gap-3 items-end"
        style={{ scale: inputScale }}
      >
        <div className="flex-1 relative">
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
            minRows={1}
            maxRows={6}
            className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            onFocus={() => inputScale.set(1.02)}
            onBlur={() => inputScale.set(1)}
          />

          {/* Enhanced send button */}
          <motion.div
            className="absolute bottom-2 right-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: buttonRotation }}
          >
            <Button
              onClick={onSendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="h-8 w-8 p-0 mb-1.5 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg disabled:opacity-50"
            >
              <Send className="h-4 w-4 mb-1" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </CardFooter>
  );
}
