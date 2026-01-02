import './Message.css';

function Message({ role, content }) {
  return (
    <div className={`message-wrapper ${role}`}>
      <div className="message">
        <div className="message-role">
          {role === 'user' ? 'You' : 'AI'}
        </div>
        <div className="message-content">
          {content}
        </div>
      </div>
    </div>
  );
}

export default Message;