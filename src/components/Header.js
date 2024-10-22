import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from "lucide-react";
import { Switch } from "./ui/switch";

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    
    if (storedDarkMode === null) {
      localStorage.setItem('darkMode', 'true');
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(storedDarkMode === 'true');
      if (storedDarkMode === 'true') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('darkMode', (!isDark).toString());
    
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-[#f5bc24] dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 z-50 font-['Poppins',sans-serif] transition-all duration-500 ease-in-out ${
        showHeader ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center py-2 px-6">
        <div className="flex justify-start">
          <Link to="/">
            <img
              src="/logoFindout.webp"
              alt="Logo"
              className="h-10 object-contain dark:hidden"
            />
            <img
              src="/logoFindoutDarkMode.webp"
              alt="Logo Dark Mode"
              className="h-10 object-contain hidden dark:block"
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-gray-700 dark:text-gray-400" />
            <Switch
              checked={isDark}
              onCheckedChange={toggleTheme}
              className="bg-gray-300 dark:bg-gray-600"
            />
            <Moon className="h-4 w-4 text-gray-700 dark:text-white" />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;