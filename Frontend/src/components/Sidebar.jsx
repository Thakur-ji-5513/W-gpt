import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { deleteChat } from '../Services/api';
import './Sidebar.css';

function Sidebar({ chats, selectedChatId, onSelectChat, onNewChat, onChatDeleted, loading, isOpen, onClose }) {
  
  const handleDelete = async (chatId, e) => {
    e.stopPropagation();
    
    try {
      await deleteChat(chatId);
      onChatDeleted(chatId);
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat');
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Mobile header with close button */}
      <div className="sidebar-header">
        <span className="sidebar-title">Chats</span>
        <button className="close-btn" onClick={onClose}>
          <FiX size={24} />
        </button>
      </div>

      {/* New Chat Button */}
      <button className="new-chat-btn" onClick={onNewChat}>
        <FiPlus size={18} />
        <span>New Chat</span>
      </button>

      {/* Chat List */}
      <div className="chat-list">
        {loading ? (
          <div className="loading">Loading chats...</div>
        ) : chats.length === 0 ? (
          <div className="empty-state">
            <p>No chats yet.</p>
            <p>Start a new conversation!</p>
          </div>
        ) : (
          chats.map(chat => (
            <div 
              key={chat._id}
              className={`chat-item ${selectedChatId === chat._id ? 'selected' : ''}`}
              onClick={() => onSelectChat(chat._id)}
            >
              <span className="chat-title">{chat.title}</span>
              <button 
                className="delete-btn"
                onClick={(e) => handleDelete(chat._id, e)}
                title="Delete chat"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;