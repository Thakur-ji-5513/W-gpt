import { useState, useEffect } from 'react'
import Sidebar from '../src/components/Sidebar'
import ChatWindow from '../src/components/ChatWindow'
import { getUserChats } from '../src/Services/api'
import './App.css'

function App() {
  const userId = '507f1f77bcf86cd799439011';

  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  useEffect(() => {
    loadUserChats();
  }, []);

  const loadUserChats = async () => {
    try {
      setLoading(true);
      const userChats = await getUserChats(userId);
      setChats(userChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    setIsSidebarOpen(false); // Close sidebar on mobile after action
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting chat
  };

  const handleChatCreated = (newChat) => {
    setChats([newChat, ...chats]);
    setSelectedChatId(newChat._id);
  };

  const handleMessageSent = () => {
    loadUserChats();
  };

  const handleChatDeleted = (deletedChatId) => {
    setChats(chats.filter(chat => chat._id !== deletedChatId));
    if (selectedChatId === deletedChatId) {
      setSelectedChatId(null);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app">
      {/* Sidebar overlay for mobile */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onChatDeleted={handleChatDeleted}
        loading={loading}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      
      <ChatWindow
        userId={userId}
        chatId={selectedChatId}
        onChatCreated={handleChatCreated}
        onMessageSent={handleMessageSent}
        onMenuClick={toggleSidebar}
      />
    </div>
  )
}

export default App