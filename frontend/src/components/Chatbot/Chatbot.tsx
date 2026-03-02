// Chatbot.tsx - FIXED LANGUAGE SELECTOR
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import "./Chatbot.css";
import { chatTranslations, type ChatTranslation } from "./chatTranslations";
import iLm from '../../assets/Ask_iLM2.png'

// Define TypeScript interfaces
interface Message {
  role: "user" | "assistant";
  message: string;
  timestamp: Date;
}

interface UserInfo {
  name: string | null;
  email: string | null;
}

interface Suggestion {
  id: string;
  text: string;
}

interface ChatbotResponse {
  success: boolean;
  reply: string;
  step: string;
  infoComplete: boolean;
  showSuggestions: boolean;
  userInfo: UserInfo;
  conversation: Array<{
    role: "user" | "assistant";
    message: string;
    timestamp: Date;
    language?: string;
    isInfoCollection?: boolean;
  }>;
}

interface LanguageOption {
  code: string;
  name: string;
}

type LanguageCode = 'en' | 'hi' | 'sa' | 'fr' | 'de' | 'es' | 'ja';

const API = import.meta.env.VITE_API_BASE_URL;

// Language selection component - SIMPLIFIED WITHOUT EMOJIS
const LanguageSelector: React.FC<{
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}> = ({ currentLanguage, onLanguageChange }) => {
  const languages: LanguageOption[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'sa', name: 'Sanskrit' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
    { code: 'ja', name: 'Japanese' },
  ];

  return (
    <div className="language-selector">
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
        className="language-dropdown"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: null, email: null });
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const isSessionPage = location.pathname.startsWith("/session/");

  const [disabledBySession, setDisabledBySession] = useState(false);

  useEffect(() => {
    const onJoin = () => setDisabledBySession(true);
    const onLeave = () => setDisabledBySession(false);

    window.addEventListener("SESSION_JOINED", onJoin);
    window.addEventListener("SESSION_LEFT", onLeave);

    return () => {
      window.removeEventListener("SESSION_JOINED", onJoin);
      window.removeEventListener("SESSION_LEFT", onLeave);
    };
  }, []);


  const t = chatTranslations[currentLanguage] as ChatTranslation;
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Only show 3-4 suggestions
  const optimizedSuggestions = t.suggestions.slice(0, 4);

  /* ================= INITIALIZE CHAT ================= */
  const initializeChat = async () => {
    try {
      const response = await axios.post(`${API}/api/chatbot/start`, {
        language: currentLanguage
      });

      const data = response.data;
      setSessionId(data.sessionId);
      setMessages([
        {
          role: "assistant",
          message: data.reply,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      // Simple fallback
      setMessages([
        {
          role: "assistant",
          message: t.welcome + "\n\n" + t.intro + "\n" + t.points.map((p: any) => `• ${p}`).join('\n') + "\n\n" + t.question,
          timestamp: new Date()
        }
      ]);
    }
  };

  /* ================= HANDLE WINDOW OPEN/CLOSE ================= */
  useEffect(() => {
    if (!isOpen) return;

    if (!sessionId) {
      initializeChat();
    }
  }, [isOpen, currentLanguage]);

  // Reinitialize when language changes while chat is open
  useEffect(() => {
    if (isOpen && sessionId) {
      initializeChat();
    }
  }, [currentLanguage]);

  /* ================= AUTO-SCROLL TO BOTTOM ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= AUTO-FOCUS TEXTAREA ================= */
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  /* ================= ADJUST TEXTAREA HEIGHT ================= */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
    }
  }, [input]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async (msg: string) => {
    if (!msg.trim() || !sessionId || isLoading) return;

    const userMessage = msg.trim();

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      { role: "user", message: userMessage, timestamp: new Date() }
    ]);

    setInput("");
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await axios.post<ChatbotResponse>(`${API}/api/chatbot/message`, {
        sessionId,
        message: userMessage,
        language: currentLanguage
      });

      const data = response.data;

      // Update user info if available
      if (data.userInfo) {
        setUserInfo(data.userInfo);
      }

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: data.reply,
          timestamp: new Date()
        }
      ]);

      // Show suggestions if backend says to
      if (data.showSuggestions) {
        setTimeout(() => {
          setShowSuggestions(true);
        }, 300);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: "Sorry, I'm having trouble connecting. Please try again.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= HANDLE SUGGESTION CLICK ================= */
  const handleSuggestionClick = (suggestion: Suggestion) => {
    sendMessage(suggestion.text);
  };

  /* ================= HANDLE KEY PRESS ================= */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  /* ================= FORMAT MESSAGE TIME ================= */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /* ================= RENDER MESSAGES ================= */
  const renderMessages = () => {
    return messages.map((m, i) => (
      <div
        key={i}
        className={`message ${m.role === "user" ? "user-message" : "assistant-message"}`}
      >
        <div className="message-text">{m.message}</div>
        <div className="message-time">
          {formatTime(m.timestamp)}
        </div>
      </div>
    ));
  };

  /* ================= RENDER USER INFO SUMMARY ================= */
  const renderUserInfoSummary = () => {
    if (!userInfo.name && !userInfo.email) return null;

    return (
      <div className="user-info-summary">
        {userInfo.name && <span>👤 {userInfo.name}</span>}
        {userInfo.email && <span> • ✉️ {userInfo.email}</span>}
      </div>
    );
  };

  /* ================= RENDER SUGGESTIONS ================= */
  const renderSuggestions = () => {
    if (!showSuggestions || optimizedSuggestions.length === 0) return null;

    return (
      <div className="suggestions-container">
        <div className="suggestions-title">
          {t.suggestionsTitle}
        </div>
        <div className="suggestions-row">
          {optimizedSuggestions.map((suggestion: Suggestion) => (
            <button
              key={suggestion.id}
              className="suggestion-chip"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isLoading}
            >
              {suggestion.text}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (isSessionPage && disabledBySession) {
    return null;
  }


  /* ================= PORTAL RENDER ================= */
  return createPortal(
    <>
      {/* CHAT TOGGLE BUTTON */}
      <button
        className="chatbot-toggle chatbot-image-btn"
        onClick={() => setIsOpen((prev: boolean) => !prev)}
        aria-label="Open chat"
      >
        <img
          src={iLm}
          alt="Chat with iLM"
          className="chatbot-image"
        />
        {/* <span className="chat-text">Ask iLM</span> */}
      </button>

      {isOpen && (
        <div className="chatbot-modal">
          {/* HEADER WITH LANGUAGE SELECTOR */}
          <div className="chatbot-header">
            <div className="header-left">
              <h3>Ask iLM </h3>
              <span className="language-indicator">
                {currentLanguage.toUpperCase()}
              </span>
            </div>
            <div className="header-right">
              <LanguageSelector
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
              />
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          {/* CHAT BODY */}
          <div className="chatbot-body">
            {/* USER INFO SUMMARY */}
            {renderUserInfoSummary()}

            {/* MESSAGES CONTAINER */}
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="welcome-message">
                  <div className="message assistant-message">
                    <div className="message-text">
                      <strong>{t.welcome}</strong>
                      <br /><br />
                      {t.intro}
                      <ul>
                        {t.points.map((point: string, index: number) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                      <br />
                      {t.question}
                    </div>
                  </div>
                </div>
              ) : (
                renderMessages()
              )}
              <div ref={bottomRef} />
            </div>

            {/* SUGGESTIONS */}
            {renderSuggestions()}
          </div>

          {/* INPUT SECTION */}
          <div className="input-section">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              disabled={isLoading}
              rows={1}
            />
            <button
              className="send-button"
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <span className="send-icon">➤</span>
              )}
            </button>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};

export default Chatbot;