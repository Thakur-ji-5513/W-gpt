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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
    setSidebarOpen(false); // Closes sidebar on mobile after selection
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    setSidebarOpen(false); // Closes sidebar on mobile after selection
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
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">
      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onChatDeleted={handleChatDeleted}
        loading={loading}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <ChatWindow
        userId={userId}
        chatId={selectedChatId}
        onChatCreated={handleChatCreated}
        onMessageSent={handleMessageSent}
        onMenuClick={toggleSidebar}
      />
    </div>
  );
}

export default App