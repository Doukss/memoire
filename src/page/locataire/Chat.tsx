import { useState, useRef, useEffect } from "react";
import TenantLayout from "../../components/common/layout/TenantLayout";

interface Message {
  id: number;
  sender: "tenant" | "agency";
  content: string;
  timestamp: string;
  read: boolean;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "agency",
      content: "Bonjour, comment puis-je vous aider ?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    {
      id: 2,
      sender: "tenant",
      content: "J'ai une question concernant mon contrat de location.",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      read: true,
    },
    {
      id: 3,
      sender: "agency",
      content: "Je vous écoute, pouvez-vous préciser votre demande ?",
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      read: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      sender: "tenant",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulation réponse agence après 2 secondes
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        sender: "agency",
        content: "Merci pour votre message. Nous allons traiter votre demande dans les plus brefs délais.",
        timestamp: new Date().toISOString(),
        read: true,
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  }

  const unreadCount = messages.filter((m) => !m.read && m.sender === "agency").length;

  return (
    <TenantLayout tenantName="Locataire">
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        {/* Liste conversations (simplifiée) */}
        <div className="w-80 rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-bold text-slate-950">Messages</h2>
            <p className="mt-1 text-sm text-slate-500">Conversation avec l'agence</p>
          </div>
          <div className="flex-1 p-4">
            <div className="rounded-lg bg-indigo-50 p-3 border border-indigo-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                  DP
                </div>
                <div>
                  <p className="font-bold text-slate-950">Dakar Prestige Immobilier</p>
                  <p className="text-sm text-slate-500">En ligne</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone de chat */}
        <div className="flex-1 rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col">
          {/* Header */}
          <div className="border-b border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                DP
              </div>
              <div>
                <p className="font-bold text-slate-950">Dakar Prestige Immobilier</p>
                <p className="text-sm text-slate-500">Gestionnaire immobilier</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
              const isTenant = message.sender === "tenant";
              return (
                <div
                  key={message.id}
                  className={`flex ${isTenant ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isTenant
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-950"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`mt-1 text-xs ${isTenant ? "text-indigo-100" : "text-slate-500"}`}>
                      {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="border-t border-slate-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </TenantLayout>
  );
}

export default Chat;
