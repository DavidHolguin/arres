import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const ChatbotCard = ({ chatbot, onClick }) => (
  <div 
    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
    onClick={() => onClick(chatbot)}
  >
    <div className="relative h-40 bg-gradient-to-r from-cyan-500 to-blue-500">
      <img
        src={chatbot.logo || "/api/placeholder/400/320"}
        alt={chatbot.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-white text-xl font-bold">{chatbot.name}</h3>
        <p className="text-gray-200 text-sm">{chatbot.company_name}</p>
      </div>
    </div>
    <div className="p-4">
      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{chatbot.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">{chatbot.model_name}</span>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Chatear
        </button>
      </div>
    </div>
  </div>
);

const ChatbotList = () => {
  const [chatbots, setChatbots] = useState([]);

  useEffect(() => {
    fetch('https://backendfindout-ea692e018a66.herokuapp.com/api/chatbots/')
      .then(res => res.json())
      .then(data => setChatbots(data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {chatbots.map(chatbot => (
        <ChatbotCard
          key={chatbot.id}
          chatbot={chatbot}
          onClick={(chatbot) => console.log('Chatbot clicked:', chatbot)}
        />
      ))}
    </div>
  );
};

export default ChatbotList;