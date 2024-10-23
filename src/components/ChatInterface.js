import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot } from 'lucide-react';
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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chatbot data and handle persistence
  useEffect(() => {
    const loadChatbot = async () => {
      try {
        setLoading(true);
        let targetId = id;
        let targetChatbot = chatbot;
        
        // If no ID in URL, try to load from localStorage
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
          // Save current chat as active
          localStorage.setItem('lastActiveChat', JSON.stringify({
            chatbot: targetChatbot,
            timestamp: new Date().toISOString(),
            conversationId: null // Will be updated when available
          }));
          
          // Load last conversation for this chatbot
          const conversationResponse = await fetch(`https://influbot-1d8d03e5b676.herokuapp.com/api/chatbots/${targetId}/conversations/last/`);
          if (conversationResponse.ok) {
            const conversationData = await conversationResponse.json();
            if (conversationData.conversation_id) {
              setConversationId(conversationData.conversation_id);
              
              // Update localStorage with conversation ID
              const lastChat = JSON.parse(localStorage.getItem('lastActiveChat'));
              localStorage.setItem('lastActiveChat', JSON.stringify({
                ...lastChat,
                conversationId: conversationData.conversation_id
              }));

              // Load conversation messages
              const messagesResponse = await fetch(`https://influbot-1d8d03e5b676.herokuapp.com/api/chatbots/${targetId}/conversations/${conversationData.conversation_id}/messages/`);
              if (messagesResponse.ok) {
                const messagesData = await messagesResponse.json();
                setMessages(messagesData.messages || []);
              }
            }
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
        
        // Update conversation ID in localStorage
        const lastChat = JSON.parse(localStorage.getItem('lastActiveChat'));
        localStorage.setItem('lastActiveChat', JSON.stringify({
          ...lastChat,
          conversationId: data.conversation_id,
          timestamp: new Date().toISOString()
        }));
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading || !chatbot) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh] bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex items-center space-x-4 p-4 border-b dark:border-gray-700">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {chatbot.avatar ? (
            <img src={chatbot.avatar} alt={chatbot.name} className="w-full h-full object-cover" />
          ) : (
            <Bot className="w-8 h-8 text-cyan-500" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold dark:text-white">{chatbot.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{chatbot.description}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
              }`}
            >
              {message.content}
              <div className="text-xs mt-1 opacity-75">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button
            onClick={handleSend}
            className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-lg transition-colors duration-200"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;