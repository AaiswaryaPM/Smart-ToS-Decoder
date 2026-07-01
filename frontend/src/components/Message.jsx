function Message({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`message ${isUser ? "user-message" : "bot-message"}`}>

      <div className="message-header">
        {isUser ? "👤 You" : "🤖 Smart ToS AI"}
      </div>

      <div className="message-content">
        {message.content}
      </div>

    </div>
  );
}

export default Message;