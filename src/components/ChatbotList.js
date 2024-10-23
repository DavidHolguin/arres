import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

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
        // Fetch last message timestamp for each chatbot
        const chatbotsWithTimestamp = await Promise.all(
          data
            .filter(chatbot => chatbot.is_active)
            .map(async ({ name, description, avatar, id }) => {
              try {
                const conversationResponse = await fetch(`https://influbot-1d8d03e5b676.herokuapp.com/api/chatbots/${id}/conversations/last/`);
                const conversationData = await conversationResponse.json();
                return {
                  name,
                  description,
                  avatar,
                  id,
                  lastUsed: conversationData.last_message_timestamp || null
                };
              } catch (error) {
                console.error(`Error fetching last message for chatbot ${id}:`, error);
                return {
                  name,
                  description,
                  avatar,
                  id,
                  lastUsed: null
                };
              }
            })
        );
        
        setChatbots(chatbotsWithTimestamp);
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
    // Save last used chatbot to localStorage
    localStorage.setItem('lastUsedChatbot', JSON.stringify(chatbot));
    navigate(`/chatbot/${chatbot.id}`, { state: { chatbot } });
  };

  const formatLastUsed = (timestamp) => {
    if (!timestamp) return 'No usado aún';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
      }
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="mx-auto flex justify-between items-center pb-4 pt-6">
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
            className="flex items-center justify-between px-4 py-3 border-t border-[#F9F6EF] dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => handleChatbotClick(chatbot)}
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full shadow-inner overflow-hidden">
                <img
                  src={chatbot.avatar || "/api/placeholder/56/56"}
                  alt={chatbot.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-xl leading-5	 font-semibold text-[#121445] dark:text-white m-0">
                  {chatbot.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 m-0">
                  {chatbot.description}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Último uso: {formatLastUsed(chatbot.lastUsed)}
                </p>
              </div>
            </div>

            
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatbotList;