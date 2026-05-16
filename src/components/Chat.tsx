import { useState, useRef, useEffect } from "react";
import { TrashIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";

interface Message {
    id: string;
    role: "user" | "assistant";
    text: string;
}

function TypingIndicator() {
    return (
        <div className="typing-dots">
            <span /><span /><span />
        </div>
    );
}

function MessageBubble({ msg, animate }: { msg: Message; animate: boolean }) {
    const isUser = msg.role === "user";
    return (
        <div className={`msg-row ${isUser ? "msg-user" : "msg-assistant"} ${animate ? "msg-animate" : ""}`}>
            {!isUser && (
                <div className="avatar bot-avatar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}

            <div className={`bubble ${isUser ? "bubble-user" : "bubble-bot"}`}>
                <p style={{ textAlign: "left", width: "100%" }}>{msg.text}</p>

            </div>

            {isUser && (
                <div className="avatar user-avatar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </div>
            )}
        </div>
    );
}

interface ChatProps {
    sessionId: string;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    onToggleTheme: () => void;
    theme: "dark" | "light";
}

export default function Chat({ sessionId, messages, setMessages, onToggleTheme, theme }: ChatProps) {
    // ✅ FIX 2: Use the factory function for initial state
    const [input, setInput] = useState("");
    const [thinking, setThinking] = useState(false);
    const [latestId, setLatestId] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const controllerRef = useRef<AbortController | null>(null);

    // ✅ FIX 3: Track the previous sessionId so we only reset when it
    // genuinely changes — not on every render
    const prevSessionIdRef = useRef<string>(sessionId);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, thinking]);

    // ✅ FIX 4: Only reset when sessionId actually changes value
    useEffect(() => {
        if (prevSessionIdRef.current !== sessionId) {
            prevSessionIdRef.current = sessionId;
            setInput("");
            setThinking(false);
            setLatestId(null);
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
            // Abort any in-flight request from the previous session
            if (controllerRef.current) {
                controllerRef.current.abort();
                controllerRef.current = null;
            }
        }
    }, [sessionId]);

    const sendMessage = async () => {
        if (!input.trim() || thinking) return;

        const userText = input.trim();

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: "user",
            text: userText,
        };

        // ✅ FIX 5: Use functional update to always append to latest state,
        // avoiding stale closure bugs
        setMessages(prev => [...prev, userMsg]);
        setLatestId(userMsg.id);
        setInput("");
        setThinking(true);

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const apiUrl = import.meta.env.VITE_RAG_MODEL_API_URL;
            const response = await fetch(`${apiUrl}/rag-model-api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userText }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            const botMsg: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                text: data.answer || "No response from model.",
            };

            setMessages(prev => [...prev, botMsg]);
            setLatestId(botMsg.id);

        } catch (err: any) {
            if (err.name === "AbortError") {
                console.log("Request cancelled");
                setMessages(prev => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        role: "assistant",
                        text: "⛔ Response stopped by user.",
                    },
                ]);
            } else {
                console.error(err);
                setMessages(prev => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        role: "assistant",
                        text: `❌ Something went wrong: ${err.message}`,
                    },
                ]);
            }
        } finally {
            setThinking(false);
            controllerRef.current = null;
        }
    };

    const stopResponse = () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
    };

    const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        const el = e.target;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 130) + "px";
    };

    const clearChat = () => {
        setMessages([]);
        setLatestId(null);
    };

    return (
        <>
            <div className="chat-page">
                {/* Header */}
                <header className="chat-header">
                    <div className="chat-header-info">
                        <div className="chat-header-title">NoVec RAG</div>
                    </div>
                    <div className="hdr-status">Connected</div>
                    <button className="hdr-btn" title="Clear chat" onClick={clearChat}>
                        <TrashIcon width={14} height={14} />
                    </button>
                    <button className="hdr-btn" title="Toggle theme" onClick={onToggleTheme}>
                        {theme === "dark" ? (
                            <SunIcon width={14} height={14} />
                        ) : (
                            <MoonIcon width={14} height={14} />
                        )}
                    </button>
                </header>

                {/* Messages */}
                <div className="messages-scroll">
                    <div className="messages-inner pt-3">
                        {(messages ?? []).map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                msg={msg}
                                animate={msg.id === latestId}
                            />
                        ))}

                        {thinking && (
                            <div className="typing-row">
                                <div className="avatar bot-avatar">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="typing-bubble"><TypingIndicator /></div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="input-zone">
                    <div className="input-zone-inner">
                        <div className="input-box">
                            <textarea ref={textareaRef} rows={1} placeholder="Ask anything from your knowledge base…" value={input} onChange={handleInput} onKeyDown={handleKey} />
                            <button className="send-btn" onClick={thinking ? stopResponse : sendMessage} disabled={!input.trim() && !thinking}>
                                {thinking ? (
                                    // STOP ICON
                                    <svg width="15" height="15" viewBox="0 0 24 24">
                                        <rect x="6" y="6" width="12" height="12" fill="currentColor" />
                                    </svg>
                                ) : (
                                    // SEND ICON
                                    <svg width="15" height="15" viewBox="0 0 24 24">
                                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                                            stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="input-hint">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" strokeWidth="2" />
                                <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            Grounded in your indexed documents · Enter to send · Shift+Enter for newline
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}