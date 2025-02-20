import React from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface Conversation {
  id: string;
  officerName: string;
  caseNumber: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatarUrl: string;
}

interface ConversationListProps {
  conversations?: Conversation[];
  onSelectConversation?: (conversationId: string) => void;
  selectedConversationId?: string;
}

const defaultConversations: Conversation[] = [
  {
    id: "1",
    officerName: "Officer Sarah Johnson",
    caseNumber: "CASE-2024-001",
    lastMessage: "We've updated the status of your case...",
    timestamp: "10:30 AM",
    unreadCount: 2,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=officer1",
  },
  {
    id: "2",
    officerName: "Detective Mike Brown",
    caseNumber: "CASE-2024-002",
    lastMessage: "Could you provide additional details about...",
    timestamp: "Yesterday",
    unreadCount: 0,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=officer2",
  },
  {
    id: "3",
    officerName: "Sergeant David Wilson",
    caseNumber: "CASE-2024-003",
    lastMessage: "Thank you for your cooperation...",
    timestamp: "2d ago",
    unreadCount: 1,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=officer3",
  },
];

const ConversationList = ({
  conversations = defaultConversations,
  onSelectConversation = () => {},
  selectedConversationId = "1",
}: ConversationListProps) => {
  return (
    <Card className="w-[300px] h-[700px] bg-white border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      <ScrollArea className="h-[calc(700px-64px)]">
        <div className="p-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedConversationId === conversation.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <img
                    src={conversation.avatarUrl}
                    alt={conversation.officerName}
                    className="w-full h-full object-cover"
                  />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">
                      {conversation.officerName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {conversation.caseNumber}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="rounded-full h-5 min-w-5 flex items-center justify-center"
                  >
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ConversationList;
