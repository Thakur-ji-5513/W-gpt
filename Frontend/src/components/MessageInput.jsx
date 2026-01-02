import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import './MessageInput.css';

function MessageInput({ onSend, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      <form className="message-input" onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          disabled={disabled}
          rows="1"
        />
        <button 
          type="submit" 
          disabled={disabled || !input.trim()}
          className="send-button"
        >
          <FiSend size={20} />
        </button>
      </form>
      <p className="input-hint">Press Enter to send, Shift+Enter for new line</p>
    </div>
  );
}

export default MessageInput;