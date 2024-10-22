import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, User, Settings, MessageSquareMore } from 'lucide-react';

const MenuBar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center px-4 py-2 shadow-lg transition-colors duration-200">
      <Link
        to="/"
        className={`flex flex-col items-center w-16 ${
          isActive('/') 
            ? 'text-[#f7bb17] dark:text-[#f7bb17]' 
            : 'text-gray-600 dark:text-gray-400 hover:text-[#f7bb17] dark:hover:text-[#f7bb17]'
        } transition-colors duration-200`}
      >
        <Home size={20} />
        <span className="text-xs mt-1 font-medium">Inicio</span>
      </Link>

      <Link
        to="/places"
        className={`flex flex-col items-center w-16 ${
          isActive('/places')
            ? 'text-[#f7bb17] dark:text-[#f7bb17]'
            : 'text-gray-600 dark:text-gray-400 hover:text-[#f7bb17] dark:hover:text-[#f7bb17]'
        } transition-colors duration-200`}
      >
        <Store size={20} />
        <span className="text-xs mt-1 font-medium">Comercios</span>
      </Link>

      {/* Refined Central ChatBot Button */}
      <Link
        to="/chats"
        className={`flex flex-col items-center justify-center -mt-6 relative ${
          isActive('/chats')
            ? 'text-white'
            : 'text-white hover:text-white'
        } transition-all duration-200 hover:scale-105 group`}
      >
        <div className={`absolute -top-5 bg-[#f7bb17] rounded-full p-4 shadow-lg
          ${isActive('/chats') 
            ? 'ring-2 ring-[#f7bb17] ring-opacity-50' 
            : ''
          } hover:shadow-xl transition-shadow duration-200 transform`}>
          <MessageSquareMore 
            size={24} 
            className="transform group-hover:rotate-12 transition-transform duration-200" 
          />
        </div>
        <span className={`text-xs mt-8 font-medium ${
          isActive('/chats')
            ? 'text-[#f7bb17]'
            : 'text-gray-600 dark:text-gray-400 group-hover:text-[#f7bb17]'
        }`}>ChatBot</span>
      </Link>

      <Link
        to="/profile"
        className={`flex flex-col items-center w-16 ${
          isActive('/profile')
            ? 'text-[#f7bb17] dark:text-[#f7bb17]'
            : 'text-gray-600 dark:text-gray-400 hover:text-[#f7bb17] dark:hover:text-[#f7bb17]'
        } transition-colors duration-200`}
      >
        <User size={20} />
        <span className="text-xs mt-1 font-medium">Perfil</span>
      </Link>

      <Link
        to="/settings"
        className={`flex flex-col items-center w-16 ${
          isActive('/settings')
            ? 'text-[#f7bb17] dark:text-[#f7bb17]'
            : 'text-gray-600 dark:text-gray-400 hover:text-[#f7bb17] dark:hover:text-[#f7bb17]'
        } transition-colors duration-200`}
      >
        <Settings size={20} />
        <span className="text-xs mt-1 font-medium">Ajustes</span>
      </Link>
    </div>
  );
};

export default MenuBar;