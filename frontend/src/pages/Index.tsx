import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { MessageSquare } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState<"short" | "long">("short");
  const [lastIntent, setLastIntent] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response after a short delay
    // Send message to backend -> Rasa
    setDepth("short");
    fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ message: text, depth, sender: "web" }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Save intent coming from backend
        if (data.intent) {
          setLastIntent(data.intent);
        }

        // Reset depth back to short after a normal response
        setDepth("short");

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply || "No response from server.",
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      })
      .catch((err) => {
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: "Server error: " + err.message,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      });
  };
  const handleShowMore = () => {
    setDepth("long");

    fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        message: "__DETAILS__", // special trigger understood by backend
        depth: "long",
        sender: "web",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.intent) setLastIntent(data.intent);

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply || "No response from server.",
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      })
      .catch((err) => {
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: "Server error: " + err.message,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">VITgpt</h1>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message, index) => (
            <div key={message.id}>
              <ChatMessage
                message={message.text}
                isBot={message.isBot}
                timestamp={message.timestamp}
              />

              {/* Show More button ONLY for last bot message */}
              {message.isBot && index === messages.length - 1 && lastIntent && (
                <button
                  onClick={handleShowMore}
                  className="text-xs text-blue-500 hover:underline mt-1 ml-12"
                >
                  Show more
                </button>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Index;
