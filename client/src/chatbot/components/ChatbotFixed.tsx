import React, { FC, useState } from 'react';
import ChatFab from './ChatFab';
import ChatDrawer from './ChatDrawerFixed';
import ChatbotErrorBoundary from './ChatbotErrorBoundary';
import { useChatbotFixed } from '../hooks/useChatbotFixed';
import { IResume, IProject } from '../../types/api_types';
import { ModelStatus } from '../context/AIModelContext';

interface ChatbotProps {
  resume: IResume | undefined;
  projects: IProject[];
}

const ChatbotFixed: FC<ChatbotProps> = ({ resume, projects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const chatbot = useChatbotFixed(resume, projects);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <ChatbotErrorBoundary>
      <ChatFab
        onClick={handleToggle}
        modelStatus={chatbot.modelStatus as ModelStatus}
        onRetry={chatbot.retryModelInit}
      />
      <ChatDrawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        chatbot={chatbot}
      />
    </ChatbotErrorBoundary>
  );
};

export default ChatbotFixed;
