import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CompanyList from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail';
import Search from './components/Search';
import Login from './components/Login';
import Register from './components/Register';
import MenuBar from './components/MenuBar';
import Profile from './components/Profile';
import Settings from './components/Settings';
import CompanyCategory from './components/CompanyCategory';
import ChatbotList from './components/ChatbotList';
import ChatInterface from './components/ChatInterface';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="container mx-auto pt-16 pb-14 text-gray-900 dark:text-white">
          <Routes>
            <Route path="/" element={<CompanyList />} />
            <Route path="/company/:id" element={<CompanyDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/company-categories/:categoryId" element={<CompanyCategory />} />
            <Route path="/chatbots" element={<ChatbotList />} />
            <Route path="/chatbot/:id" element={<ChatInterface />} />
          </Routes>
        </main>
        <MenuBar />
      </div>
    </Router>
  );
}

export default App;