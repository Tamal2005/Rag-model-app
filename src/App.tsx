import { useState, useCallback } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Chat from "./components/Chat";

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  date: string;
  active?: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

type Page = "home" | "chat";

const getInitialMessages = (): Message[] => [
  {
    id: crypto.randomUUID(),
    role: "assistant",
    text: "Hi! I'm NoVec RAG, your vectorless retrieval assistant. Ask me anything from machine learning or statistics — I’ll search and answer with reliable sources.",
  },
];

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: "session-001",
    title: "Product FAQ lookup",
    preview: "What does the warranty cover?",
    date: "Today",
    active: true,
  },
  {
    id: "session-002",
    title: "Onboarding docs",
    preview: "Summarize the onboarding steps",
    date: "Yesterday",
  },
  {
    id: "session-003",
    title: "Policy review",
    preview: "Refund policy for digital goods",
    date: "Mar 20",
  },
];

const seedInitialMessages = (): Record<string, Message[]> => {
  const seed: Record<string, Message[]> = {};
  INITIAL_SESSIONS.forEach((s) => {
    seed[s.id] = getInitialMessages();
  });
  return seed;
};

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState("session-001");
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>(seedInitialMessages);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    setSessions((prev) => [
      {
        id: newId,
        title: "New Chat",
        preview: "Start a conversation…",
        date: "Just now",
        active: true,
      },
      ...prev.map((s) => ({ ...s, active: false })),
    ]);
    setActiveSessionId(newId);
    setChatMessages((prev) => ({
      ...prev,
      [newId]: getInitialMessages(),
    }));
    setPage("chat");
  };

  const handleSelectSession = (id: string) => {
    setSessions((prev) => prev.map((s) => ({ ...s, active: s.id === id })));
    setActiveSessionId(id);
    setPage("chat");
  };

  const setMessagesForSession = useCallback(
    (msgs: Message[] | ((prev: Message[]) => Message[])) => {
      setChatMessages((prev) => ({
        ...prev,
        [activeSessionId]:
          typeof msgs === "function"
            ? msgs(prev[activeSessionId] ?? [])
            : msgs,
      }));
    },
    [activeSessionId]
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <div className="app-shell">
      <Sidebar
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={handleSelectSession}
        onNewChat={handleNewChat}
        onNavigateHome={() => setPage("home")}
      />

      {page === "home" ? (
        <Home onStartChat={handleNewChat} />
      ) : (
        <Chat
          sessionId={activeSessionId}
          messages={chatMessages[activeSessionId] || []}
          setMessages={setMessagesForSession}
          onToggleTheme={toggleTheme}
          theme={theme}
        />
      )}
    </div>
  );
}