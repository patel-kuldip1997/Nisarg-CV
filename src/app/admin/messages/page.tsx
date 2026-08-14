"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Trash, Edit2, Plus, Mail } from "lucide-react";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Message deleted");
        fetchMessages();
      }
    } catch (err) {
      toast.error("Error deleting message");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><Mail /> Messages</h1>
        <p className="text-text-muted">Read and manage contact form submissions.</p>
      </div>

      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="glass-card p-6 border border-border relative">
            <button 
              onClick={() => handleDelete(msg.id)}
              className="absolute top-6 right-6 text-error hover:bg-error/10 p-2 rounded-full transition-colors"
            >
              <Trash size={18} />
            </button>
            <h3 className="text-xl font-bold text-white">{msg.name}</h3>
            <p className="text-primary text-sm mb-4">{msg.email}</p>
            <div className="bg-surface p-4 rounded-lg border border-border/50 text-text-muted">
              {msg.message}
            </div>
            <p className="text-xs text-text-muted mt-4">Received: {new Date(msg.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="glass-card p-12 text-center text-text-muted">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
