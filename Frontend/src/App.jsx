import { useState,useEffect } from 'react'
import Sidebar from '../src/components/Sidebar'
import ChatWindow from '../src/components/ChatWindow'
import { getUserChats } from '../src/Services/api'
import './App.css'

function App() {

  const userId = '507f1f77bcf86cd799439011'; //hardcoded userId for now 

  //statess
  const [ chats , setChats ] = useState([]);
  const [ selectedChatId , setSelectedChatId ] = useState(null);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    loadUserChats();
  }, []);

  const loadUserChats = async () =>{
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

// New chats handeling:
const handleNewChat = () => {
  setSelectedChatId(null); //deselects the current chat and sets it to null
};

//selecting chat from sidebar
const handleSelectChat = (chatId) => {
  setSelectedChatId(chatId);
};

//handeling of new chat creation
const handleChatCreated = (newChat) => {
  setChats([newChat, ...chats]);
  setSelectedChatId(newChat._id);
};

//handeling messae sent to a chat
const handleMessageSent = () => {
  loadUserChats();
};

//handle Chat deletion
const handleChatDeleted = (deletedChatId) =>{
  setChats(chats.filter(chat => chat._id !== deletedChatId));
  if( selectedChatId === deletedChatId){
    setSelectedChatId(null);
  }
}

return (
    <div className="app">
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onChatDeleted={handleChatDeleted}
        loading={loading}
      />
      <ChatWindow
        userId={userId}
        chatId={selectedChatId}
        onChatCreated={handleChatCreated}
        onMessageSent={handleMessageSent}
      />
    </div>
);}

export default App

