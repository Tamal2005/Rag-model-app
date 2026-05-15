import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import heroImage from "../assets/logo.png";

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  date: string;
  active?: boolean;
}

interface SidebarProps {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onNavigateHome: () => void;
}

const NAV_ITEMS = [
  {
    label: "Home",
    page: "home",
  },
  {
    label: "Chats",
    page: "chat",
  },
];

export default function Sidebar({
  onNewChat,
  onNavigateHome,
}: SidebarProps) {

  const [activePage, setActivePage] =
    useState<"home" | "chat">("chat");

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button className={`mobile-menu-btn ${open ? "menu-open" : ""}`} onClick={() => setOpen(!open)}>
        {open ? (<XMarkIcon />) : (<Bars3Icon/>)}
      </button>

      {/* Overlay */}
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)}/>
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>

        {/* Logo */}
        <div className="sb-logo">
          <span className="sb-logo-name" onClick={() => { onNewChat(); setOpen(false);}}><img src={heroImage} height={40} width={40} alt="Logo" /></span>
        </div>

        {/* Navigation */}
        <nav className="sb-nav">
          {NAV_ITEMS.map((item) => (
            <button key={item.page} className={`sb-nav-item ${ activePage === item.page ? "active" : ""}`} onClick={() => { setActivePage(item.page as "home" | "chat");
                if (item.page === "home") {
                  onNavigateHome();
                } else {
                  onNewChat();
                } setOpen(false);}}>
              {item.label}
            </button>
          ))}
        </nav>

        {/* New Chat */}
        <button className="sb-new-btn" onClick={() => { onNewChat(); setOpen(false);}}>
          New Chat
        </button>

        {/* KB Status */}
        <div className="sb-kb">
          <div className="sb-kb-head">
            Knowledge Base
          </div>

          <div className="sb-kb-row">
            <span>Documents</span>
            <span>2 PDFs</span>
          </div>

          <div className="sb-kb-row">
            <span>Retrieval</span>
            <span>BM25</span>
          </div>

          <div className="sb-kb-row">
            <span>RAG Type</span>
            <span>Vectorless</span>
          </div>

          <div className="sb-kb-row">
            <span>Status</span>
            <span>✓ Ready</span>
          </div>
        </div>

      </aside>
    </>
  );
}