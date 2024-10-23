import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const ChatbotList = () => {
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const response = await fetch('https://influbot-1d8d03e5b676.herokuapp.com/api/chatbots/', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los chatbots');
        }

        const data = await response.json();
        const activeChatbots = data
          .filter(chatbot => chatbot.is_active)
          .map(({ name, description, avatar, id }) => ({
            name,
            description,
            avatar,
            id
          }));
        
        setChatbots(activeChatbots);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatbots();
  }, []);

  const handleChatbotClick = (chatbot) => {
    navigate(`/chatbot/${chatbot.id}`, { state: { chatbot } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      <div className="w-[90%] mx-auto flex justify-between items-center py-12">
        <h2 className="text-lg font-semibold text-[#121445] dark:text-white">ChatBots</h2>
        <button 
          onClick={() => navigate('/chatbots')} 
          className="text-sm text-[#121445] dark:text-white bg-transparent border-none cursor-pointer hover:underline"
        >
          Ver más
        </button>
      </div>

      <div className="w-full bg-white dark:bg-gray-800 rounded-t-lg">
        {chatbots.map((chatbot) => (
          <div
            key={chatbot.id}
            className="flex items-center justify-between p-4 border-t border-[#F9F6EF] dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => handleChatbotClick(chatbot)}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full shadow-inner overflow-hidden">
                <img
                  src={chatbot.avatar || "/api/placeholder/56/56"}
                  alt={chatbot.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-[55%]">
                <h3 className="text-sm font-semibold text-[#121445] dark:text-white m-0">
                  {chatbot.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 m-0">
                  {chatbot.description}
                </p>
              </div>
            </div>

            <button className="bg-[#1449E2] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-inner hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Abrir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatbotList;