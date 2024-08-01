import { Bot } from "lucide-react";
import { useState } from "react";
// import AIChatBox from "./AIChatBox";
import { Button } from "./ui/button";
import AiChatBox from "./AiChatBox";

export default function AIChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setChatBoxOpen(true)}>
        <Bot size={20} className="mr-2" />
        AI Chat
      </Button>
      <AiChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
}
