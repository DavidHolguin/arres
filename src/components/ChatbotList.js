import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const ChatbotCard = ({ chatbot, onClick }) => (
  <div 
    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
  >
    <div className="relative h-40 bg-gradient-to-r from-cyan-500 to-blue-500">
      <img
        src={chatbot.avatar || "/api/placeholder/400/320"}
        alt={chatbot.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-white text-xl font-bold">{chatbot.name}</h3>
        <p className="text-gray-200 text-sm">{chatbot.description?.substring(0, 50)}...</p>
      </div>
    </div>
    
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Tipo:</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{chatbot.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Modelo:</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{chatbot.model}</span>
        </div>
        {chatbot.category && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Categoría:</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{chatbot.category}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Creado: {new Date(chatbot.created_at).toLocaleDateString()}
        </span>
        <button 
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick(chatbot);
          }}
        >
          <MessageCircle className="w-4 h-4" />
          Chatear
        </button>
      </div>
    </div>
  </div>
);

const ChatbotList = () => {
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        setLoading(true);
        // Actualizar esta URL según la estructura que elijas
        const response = await fetch('/api/chatbots/chatbots/');
        if (!response.ok) {
          throw new Error('Error al cargar los chatbots');
        }
        const data = await response.json();
        setChatbots(data);
      } catch (err) {
        setError(err.message);
        console.error('Error al obtener chatbots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatbots();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error al cargar los chatbots: {error}</p>
      </div>
    );
  }

  if (!chatbots?.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No hay chatbots disponibles</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Chatbots Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatbots.map(chatbot => (
          <ChatbotCard
            key={chatbot.id}
            chatbot={chatbot}
            onClick={(chatbot) => {
              console.log('Chatbot seleccionado:', chatbot);
              // Aquí puedes agregar la lógica para iniciar el chat
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatbotList;