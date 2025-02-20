import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Paperclip } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
    avatar: string;
    isOfficer: boolean;
  };
  timestamp: string;
}

interface ChatWindowProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
}

const defaultMessages: Message[] = [
  {
    id: "1",
    content: "Hello, how can I help you today?",
    sender: {
      name: "Officer Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=officer1",
      isOfficer: true,
    },
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    content: "I would like to provide additional information about my case.",
    sender: {
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=citizen1",
      isOfficer: false,
    },
    timestamp: "10:05 AM",
  },
];

const ChatWindow = ({
  messages = defaultMessages,
  onSendMessage = () => {},
}: ChatWindowProps) => {
  const [newMessage, setNewMessage] = React.useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=officer1" />
            <AvatarFallback>OJ</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Officer Johnson</h3>
            <p className="text-sm text-gray-500">Case #123-456</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender.isOfficer ? "flex-row" : "flex-row-reverse"}`}
            >
              <Avatar>
                <AvatarImage src={message.sender.avatar} />
                <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender.isOfficer
                    ? "bg-gray-100"
                    : "bg-blue-500 text-white"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs mt-1 block opacity-70">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            className="shrink-0"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
