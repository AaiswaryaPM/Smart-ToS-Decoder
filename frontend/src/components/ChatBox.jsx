import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import Message from "./Message";
import SourceCard from "./SourceCard";

function ChatBox({ documentId, documentName }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const askQuestion = async () => {
    if (!question.trim()) return;

    // Add user message
    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = question;
    setQuestion("");

    try {
      setLoading(true);

      const res = await API.post("/rag/chat", {
        documentId,
        question: currentQuestion,
      });

      const botMessage = {
        role: "assistant",
        content: res.data.answer,
        sources: res.data.retrievedChunks,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Failed to get response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      askQuestion();
    }
  };

  return (
    <div className="chat-container">

      <div className="chat-header">
        <h3>💬 Chat with Document</h3>

        <p>
          <strong>Document:</strong> {documentName}
        </p>
      </div>

      <div className="chat-messages">

        {messages.length === 0 && (
          <p className="empty-chat">
            Ask anything about the uploaded document.
          </p>
        )}

        {messages.map((msg, index) => (
          <div key={index}>
            <Message message={msg} />

            {msg.role === "assistant" && (
              <SourceCard
                sources={msg.sources}
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="typing">
            🤖 Thinking...
          </div>
        )}

        {/* Auto-scroll target */}
        <div ref={messagesEndRef}></div>

      </div>

      <div className="chat-input">

        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button
          onClick={askQuestion}
          disabled={loading}
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatBox;