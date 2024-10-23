import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Store, User, Settings, MessageSquareMore, Brain } from 'lucide-react';

const MenuBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isIconSwapped, setIsIconSwapped] = useState(false);
  
  useEffect(() => {
    setShowMenu(true);
    return () => setShowMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsIconSwapped(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleChatClick = (e) => {
    e.preventDefault();
    const lastChat = localStorage.getItem('lastActiveChat');
    if (lastChat) {
      const { chatbot } = JSON.parse(lastChat);
      navigate(`/chatbot/${chatbot.id}`);
    } else {
      navigate('/chatbot');
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 
      border-t border-gray-200 dark:border-gray-700 
      flex justify-around items-end px-4 py-2 shadow-lg 
      transition-all duration-500 ease-in-out
      ${showMenu ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <Link
        to="/"
        className={`flex flex-col items-center w-16 transform transition-transform duration-300
          ${isActive('/') ? 'scale-105' : 'hover:scale-105'}`}
      >
        <Home size={20} className={`mb-1 ${
          isActive('/') 
            ? 'text-[#f7bb17] dark:text-[#f7bb17]' 
            : 'text-gray-600 dark:text-white hover:text-[#f7bb17] dark:hover:text-[#f7bb17]'
        }`} />
        <span className={`text-xs font-medium transition-colors duration-200 mb-1 ${
          isActive('/')
            ? 'text-[#f7bb17] dark:text-[#f7bb17]'
            : 'text-gray-600 dark:text-white'
        }`}>Inicio</span>
      </Link>

      <Link
        to="/search"
        className={`flex flex-col items-center w-16 transform transition-transform duration-300
          ${isActive('/places') ? 'scale-105' : 'hover:scale-105'}`}
      >
        <Store size={20} className={`mb-1 ${
          isActive('/places')
            ? 'text-[#f7bb17] dark:text-[#f7bb17]'
            : 'text-gray-600 dark:text-white hover:text-[#f7bb17] dark:hover:text-[#f7bb17]'
        }`} />
        <span className={`text-xs font-medium transition-colors duration-200 mb-1 ${
          isActive('/places')
            ? 'text-[#f7bb17] dark:text-[#f7bb17]'
            : 'text-gray-600 dark:text-white'
        }`}>Comercios</span>
      </Link>

      <Link
        to="/chatbot"
        onClick={handleChatClick}
        className="flex flex-col items-center pb-1 w-20 group"
      >
        <div className={`relative flex items-center justify-center w-14 h-14 -mt-5 mb-1
          bg-[#f7bb17] dark:bg-[#f7bb17] rounded-full shadow-lg 
          transform transition-all duration-300 
          ${isActive('/chatbot') ? 'scale-110 ring-4 ring-[#f7bb17]/30' : 'hover:scale-110'}
        `}>
          <div className="relative w-6 h-6">
            <MessageSquareMore
              size={24}
              className={`absolute inset-0 text-white transform transition-all duration-500 ease-in-out
                ${isIconSwapped ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
            />
            <Brain
              size={24}
              className={`absolute inset-0 text-white transform transition-all duration-500 ease-in-out
                ${isIconSwapped ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'}`}
            />
          </div>
        </div>
        <span className={`text-xs font-medium mb-1 transition-colors duration-200 ${
          isActive('/chatbot')
            ? 'text-[#f7bb17] dark:text-[#f7bb17]'
            : 'text-gray-600 dark:text-white group-hover:text-[#f7bb17]'
        }`}>ChatBot</span>
      </Link>

      <Link
        to="/profile"
        className={`flex flex-col items-center w-16 transform transition-transform duration-300
          ${isActive('/profile') ? 'scale-105' : 'hover:scale-105'}`}
      >
        <User size={20} className={`mb-1 ${
          isActive('/profile')
            ? 'text-[#f7bb17] dark:text-[#f7bb17]'
            : 'text-gray-600 dark:text-white hover:text-[#f7bb17] dark:hover:text-[#f7bb17]'
        }`} />
        <span className={`text-xs font-medium transition-colors duration-200 mb-1 ${
          isActive('/profile')
            ? 'text-[#f7bb17] dark:text-[#f7bb17]'
            : 'text-gray-600 dark:text-white'
        }`}>Perfil</span>
      </Link>

      <Link
        to="/settings"
        className={`flex flex-col items-center w-16 transform transition-transform duration-300
          ${isActive('/settings') ? 'scale-105' : 'hover:scale-105'}`}
      >
        <Settings size={20} className={`mb-1 ${
          isActive('/settings')
            ? 'text-[#f7bb17] dark:text-[#f7bb17]'
            : 'text-gray-600 dark:text-white hover:text-[#f7bb17] dark:hover:text-[#f7bb17]'
        }`} />
        <span className={`text-xs font-medium transition-colors duration-200 mb-1 ${
          isActive('/settings')
            ? 'text-[#f7bb17] dark:text-[#f7bb17]'
            : 'text-gray-600 dark:text-white'
        }`}>Ajustes</span>
      </Link>
    </div>
  );
};

export default MenuBar;