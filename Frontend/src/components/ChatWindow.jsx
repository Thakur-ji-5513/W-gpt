import { useState, useEffect, useRef } from 'react';
import MessageInput from './MessageInput';
import Message from './Message';
import { getChatById, createNewChat, sendMessage } from '../Services/api';
import './ChatWindow.css';

function ChatWindow({ userId, chatId, onChatCreated, onMessageSent }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat when chatId changes
  useEffect(() => {
    if (chatId) {
      loadChat();
    } else {
      setMessages([]); // Clear messages for new chat
    }
  }, [chatId]);

  const loadChat = async () => {
    try {
      setLoading(true);
      const chat = await getChatById(chatId);
      setMessages(chat.messages);
    } catch (error) {
      console.error('Error loading chat:', error);
      alert('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageText) => {
  if (!messageText.trim()) return;

  try {
    setLoading(true);

    if (!chatId) {
      // Creating new chat
      const newChat = await createNewChat(userId, messageText);
      
      // Simulating streaming by displaying word by word
      await simulateTyping(newChat.messages[newChat.messages.length - 1].content, (text) => {
        setMessages([
          newChat.messages[0], // User message
          { role: 'assistant', content: text } // Partial AI message
        ]);
      });
      
      onChatCreated(newChat);
      setMessages(newChat.messages);

    } else {
      // Send to existing chat
      const userMessage = { role: 'user', content: messageText };
      setMessages([...messages, userMessage]);

      const updatedChat = await sendMessage(chatId, messageText);
      
      // Get the new AI message
      const newAiMessage = updatedChat.messages[updatedChat.messages.length - 1].content;
      
      // Simulate typing
      await simulateTyping(newAiMessage, (text) => {
        setMessages([
          ...messages,
          userMessage,
          { role: 'assistant', content: text }
        ]);
      });
      
      setMessages(updatedChat.messages);
      onMessageSent();
    }

  } catch (error) {
    console.error('Error sending message:', error);
    alert('Failed to send message');
    if (chatId) loadChat();
  } finally {
    setLoading(false);
  }
};

//  helper function for  ChatWindow.jsx
const simulateTyping = (fullText, onUpdate) => {
  return new Promise((resolve) => {
    const words = fullText.split(' ');
    let currentText = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index < words.length) {
        currentText += (index > 0 ? ' ' : '') + words[index];
        onUpdate(currentText);
        index++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 50); // 50ms delay between words
  });
};

  return (
    <div className="chat-window">
      <div className="messages-container">
        {chatId === null && messages.length === 0 ? (
          <div className="welcome">
            <h1>W-GPT</h1>
            <p>How can I help you today?</p>
          </div>
        ) : loading && messages.length === 0 ? (
          <div className="loading">Loading messages...</div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <Message 
                key={index}
                role={msg.role}
                content={msg.content}
              />
            ))}
            {loading && (
        <div className="message-wrapper assistant">
          <div className="message">
            <div className="message-role">AI</div>
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <MessageInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
}

export default ChatWindow;