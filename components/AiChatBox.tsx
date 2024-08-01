import { cn } from "@/lib/utils";
import { Bot, XCircle } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useChat } from "ai/react";
import { Input } from "./ui/input";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Message } from "ai";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}
const AiChatBox = ({ open, onClose }: AIChatBoxProps) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();
  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";
  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden"
      )}
    >
      <div className="flex h-[400px] shadow-xl rounded-lg flex-col border">
        <Button
          variant={"outline"}
          onClick={onClose}
          className="mb-1 ms-auto block"
        >
          <XCircle size={30} />
        </Button>
        <div className="mt-3 h-full overflow-y-auto px-3">
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Something went wrong. Please try again.",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
              <Bot />
              Ask the AI a question about your notes
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-1 m-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Send Query..."
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
};

export default AiChatBox;


function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  const { user } = useUser();

  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="User image"
          width={100}
          height={100}
          className="ml-2 h-10 w-10 rounded-full object-cover"
        />
      )}
    </div>
  );
}
