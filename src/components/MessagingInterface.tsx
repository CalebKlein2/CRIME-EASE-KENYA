import React from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

interface MessagingInterfaceProps {
  onSelectConversation?: (conversationId: string) => void;
  onSendMessage?: (message: string) => void;
  selectedConversationId?: string;
}

const MessagingInterface = ({
  onSelectConversation = () => {},
  onSendMessage = () => {},
  selectedConversationId = "1",
}: MessagingInterfaceProps) => {
  return (
    <div className="flex w-[1200px] h-[700px] bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <ConversationList
        onSelectConversation={onSelectConversation}
        selectedConversationId={selectedConversationId}
      />
      <div className="flex-1">
        <ChatWindow onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default MessagingInterface;
