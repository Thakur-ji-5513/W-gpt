import { useState, useEffect, useRef } from 'react';
import { FiMenu } from 'react-icons/fi';
import MessageInput from './MessageInput';
import Message from './Message';
import { getChatById, createNewChat, sendMessage } from '../Services/api';
import './ChatWindow.css';

function ChatWindow({ userId, chatId, onChatCreated, onMessageSent, onMenuClick }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const lastScrollTop = useRef(0);

  const scrollToBottom = (behavior = 'smooth') => {
    if (!isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }
  };

  // Detect user scrolling
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    // If user scrolled up, mark as user scrolling
    if (scrollTop < lastScrollTop.current) {
      setIsUserScrolling(true);
    }

    // If user scrolled to bottom, allow auto-scroll again
    if (isAtBottom) {
      setIsUserScrolling(false);
    }

    lastScrollTop.current = scrollTop;
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      loadChat();
    } else {
      setMessages([]);
    }
    setIsUserScrolling(false); // Reset scroll state when switching chats
  }, [chatId]);

  const loadChat = async () => {
    try {
      setLoading(true);
      const chat = await getChatById(chatId);
      setMessages(chat.messages);
      // Scroll instantly when loading chat
      setTimeout(() => scrollToBottom('auto'), 100);
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
      setIsUserScrolling(false); // Reset scroll state when sending new message

      if (!chatId) {
        const newChat = await createNewChat(userId, messageText);
        
        await simulateTyping(newChat.messages[newChat.messages.length - 1].content, (text) => {
          setMessages([
            newChat.messages[0],
            { role: 'assistant', content: text }
          ]);
        });
        
        onChatCreated(newChat);
        setMessages(newChat.messages);

      } else {
        const userMessage = { role: 'user', content: messageText };
        setMessages([...messages, userMessage]);

        const updatedChat = await sendMessage(chatId, messageText);
        const newAiMessage = updatedChat.messages[updatedChat.messages.length - 1].content;
        
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
      }, 50);
    });
  };

  const currentChatTitle = chatId ? "Chat" : "W-GPT";

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="menu-btn" onClick={onMenuClick}>
          <FiMenu size={24} />
        </button>
        <span className="chat-header-title">{currentChatTitle}</span>
      </div>

      <div className="messages-container" ref={messagesContainerRef}>
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