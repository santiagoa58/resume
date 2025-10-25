import React, { FC, useState } from 'react';
import ChatFab from './ChatFab';
import ChatDrawer from './ChatDrawer';
import { useChatbot } from '../hooks/useChatbot';
import { IResume, IProject } from '../../types/api_types';

interface ChatbotProps {
  resume: IResume | undefined;
  projects: IProject[];
}

const Chatbot: FC<ChatbotProps> = ({ resume, projects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const chatbot = useChatbot(resume, projects);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <ChatFab onClick={handleToggle} modelStatus={chatbot.modelStatus} />
      <ChatDrawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        chatbot={chatbot}
      />
    </>
  );
};

export default Chatbot;
