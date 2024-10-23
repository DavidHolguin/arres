import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, ArrowLeft, Clock, Menu, X, User, AlertTriangle } from 'lucide-react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const ChatInterface = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState(location.state?.chatbot || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [lastActive, setLastActive] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const username = 'CHdev'; // This should come from your auth system
    
    let timeOfDay;
    if (hour >= 5 && hour < 12) timeOfDay = "mañana";
    else if (hour >= 12 && hour < 18) timeOfDay = "tarde";
    else if (hour >= 18 && hour < 22) timeOfDay = "noche";
    else timeOfDay = "madrugada";
    
    return `¡Feliz ${timeOfDay}${username ? `, ${username}` : ''}!`;
  };

  const formatLastActive = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Hace un momento';
    if (diff < 3600000) return `Hace ${Math.floor(diff/60000)} minutos`;
    if (diff < 86400000) return `Hace ${Math.floor(diff/3600000)} horas`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const loadConversations = async () => {
      setLoadingConversations(true);
      setConversationsError(false);
      try {
        const response = await fetch(`https://influbot-1d8d03e5b676.herokuapp.com/api/chatbots/${id}/conversations/`);
        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations || []);
        } else {
          console.warn('No se pudieron cargar las conversaciones:', response.status);
          setConversationsError(true);
        }
      } catch (error) {
        console.warn('Error al cargar conversaciones:', error);
        setConversationsError(true);
      } finally {
        setLoadingConversations(false);
      }
    };

    if (id) {
      loadConversations();
    }
  }, [id]);

  // Efecto principal para cargar el chatbot
  useEffect(() => {
    const loadChatbot = async () => {
      try {
        setLoading(true);
        let targetId = id;
        let targetChatbot = chatbot;
        
        if (!targetId) {
          const lastChat = localStorage.getItem('lastActiveChat');
          if (lastChat) {
            const savedChat = JSON.parse(lastChat);
            targetId = savedChat.chatbot.id;
            targetChatbot = savedChat.chatbot;
            navigate(`/chatbot/${targetId}`, { replace: true });
          }
        }

        if (targetId && !targetChatbot) {
          const response = await fetch(`https://influbot-1d8d03e5b676.herokuapp.com/api/chatbots/${targetId}/`);
          if (!response.ok) throw new Error('Failed to load chatbot');
          const data = await response.json();
          targetChatbot = data;
          setChatbot(data);
        }

        if (targetChatbot) {
          localStorage.setItem('lastActiveChat', JSON.stringify({
            chatbot: targetChatbot,
            timestamp: new Date().toISOString(),
            conversationId: null
          }));
          
          try {
            const conversationResponse = await fetch(`https://influbot-1d8d03e5b676.herokuapp.com/api/chatbots/${targetId}/conversations/last/`);
            if (conversationResponse.ok) {
              const conversationData = await conversationResponse.json();
              if (conversationData.conversation_id) {
                setConversationId(conversationData.conversation_id);
                
                const lastChat = JSON.parse(localStorage.getItem('lastActiveChat'));
                localStorage.setItem('lastActiveChat', JSON.stringify({
                  ...lastChat,
                  conversationId: conversationData.conversation_id
                }));

                const messagesResponse = await fetch(`https://influbot-1d8d03e5b676.herokuapp.com/api/chatbots/${targetId}/conversations/${conversationData.conversation_id}/messages/`);
                if (messagesResponse.ok) {
                  const messagesData = await messagesResponse.json();
                  setMessages(messagesData.messages || []);
                }
              }
            }
          } catch (error) {
            console.warn('Error loading conversation history:', error);
            // Continue without conversation history
          }
        }
      } catch (error) {
        console.error('Error loading chatbot:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatbot();
  }, [id, chatbot, navigate]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const response = await fetch(`https://influbot-1d8d03e5b676.herokuapp.com/api/chatbots/${id}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversation_id: conversationId
        }),
      });

      const data = await response.json();
      
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
        setLastActive(new Date().toISOString());
        
        // Actualizamos la lista de conversaciones si es una nueva
        if (!conversationId) {
          setConversations(prev => [{
            id: data.conversation_id,
            created_at: new Date().toISOString(),
            messages: [newMessage]
          }, ...prev]);
        }
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error:', error);
      // Mostrar mensaje de error al usuario
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  if (loading || !chatbot) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30`}>
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">Conversaciones</h2>
          <button onClick={() => setIsMenuOpen(false)} className="p-2">
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="overflow-y-auto h-full">
          {loadingConversations ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent"></div>
            </div>
          ) : conversationsError ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
              <p>No se pudieron cargar las conversaciones</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No hay conversaciones previas
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-700"
                onClick={() => {
                  setConversationId(conv.id);
                  setMessages(conv.messages || []);
                  setIsMenuOpen(false);
                }}
              >
                <div className="text-sm font-medium dark:text-white">
                  {new Date(conv.created_at).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {conv.messages?.[0]?.content.substring(0, 50)}...
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center space-x-4 p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
          <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Menu className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {chatbot.avatar ? (
              <img src={chatbot.avatar} alt={chatbot.name} className="w-full h-full object-cover" />
            ) : (
              <Bot className="w-full h-full p-2 bg-yellow-400" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold dark:text-white">{chatbot.name}</h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {formatLastActive(lastActive) || 'No hay actividad reciente'}
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="p-4 text-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
          {getGreeting()}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <p>¡Comienza una conversación con {chatbot.name}!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start max-w-[70%] space-x-2">
                  {message.role === 'user' ? (
                    <div className="order-2">
                      <div className="bg-blue-500 text-white rounded-lg p-3">
                        {message.content}
                      </div>
                      <div className="text-xs text-right mt-1 text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        {chatbot.avatar ? (
                          <img src={chatbot.avatar} alt={chatbot.name} className="w-full h-full object-cover" />
                        ) : (
                          <Bot className="w-full h-full p-1 text-gray-800" />
                        )}
                      </div>
                      <div>
                        <div className="bg-[#f7bb17] rounded-lg p-3">
                          {message.content}
                        </div>
                        <div className="text-xs mt-1 text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe un mensaje..."
                className="flex-1 p-4 pr-12 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500"
              />
              <button
                onClick={handleSend}
                className="absolute right-2 p-2 text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors duration-200"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;