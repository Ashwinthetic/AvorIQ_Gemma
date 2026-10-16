"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { fetchChatHistory, syncChatHistory, clearChatHistory } from "../lib/api";
import { Scholarship } from "../types/scholarship";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  results?: Scholarship[];
  isStreaming?: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

interface ChatContextType {
  threads: ChatThread[];
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  createThread: () => string;
  deleteThread: (id: string) => Promise<void>;
  updateThreadMessages: (id: string, messages: ChatMessage[]) => void;
  loading: boolean;
  clearAllThreads: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

function generateTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find((m) => m.sender === "user");
  if (firstUserMessage) {
    const text = firstUserMessage.text.replace(/\[Attached File:.*\]/g, "").trim();
    if (text.length > 28) {
      return text.slice(0, 25) + "...";
    }
    return text || "New Chat";
  }
  return "New Chat";
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("default");
  const [loading, setLoading] = useState<boolean>(true);

  // Load chats
  useEffect(() => {
    async function loadChats() {
      setLoading(true);
      if (user) {
        try {
          const rawMessages = await fetchChatHistory(user.uid);
          if (rawMessages && rawMessages.length > 0) {
            // Group by chatId
            const groups: Record<string, ChatMessage[]> = {};
            rawMessages.forEach((msg: any) => {
              if (msg.id === "1") return; // Skip welcome message stored in DB
              const chatId = msg.chatId || "default";
              if (!groups[chatId]) {
                groups[chatId] = [];
              }
              groups[chatId].push({
                id: msg.id,
                sender: msg.sender as "user" | "ai",
                text: msg.text,
                results: msg.results || [],
              });
            });

            const loadedThreads: ChatThread[] = Object.keys(groups).map((chatId) => {
              const messages = groups[chatId];
              return {
                id: chatId,
                title: generateTitle(messages),
                messages,
                updatedAt: Date.now(), // Fallback
              };
            });

            // Ensure "default" is created if not loaded
            if (!groups["default"]) {
              loadedThreads.unshift({
                id: "default",
                title: "New Chat",
                messages: [],
                updatedAt: Date.now(),
              });
            }

            setThreads(loadedThreads);
            
            // Set active thread to the most recently active or default
            const savedActiveId = window.localStorage.getItem(`avoriq_active_chat_${user.uid}`);
            if (savedActiveId && loadedThreads.some((t) => t.id === savedActiveId)) {
              setActiveThreadId(savedActiveId);
            } else {
              setActiveThreadId(loadedThreads[0]?.id || "default");
            }
          } else {
            // No history in DB, start fresh
            const defaultThread: ChatThread = {
              id: "default",
              title: "New Chat",
              messages: [],
              updatedAt: Date.now(),
            };
            setThreads([defaultThread]);
            setActiveThreadId("default");
          }
        } catch (e) {
          console.error("Error loading user chat history:", e);
        }
      } else {
        // Guest mode: load threads from local storage
        const stored = window.localStorage.getItem("avoriq_guest_chats");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setThreads(parsed);
              const savedActiveId = window.localStorage.getItem("avoriq_active_chat_guest");
              if (savedActiveId && parsed.some((t: any) => t.id === savedActiveId)) {
                setActiveThreadId(savedActiveId);
              } else {
                setActiveThreadId(parsed[0].id);
              }
            } else {
              setThreads([{ id: "default", title: "New Chat", messages: [], updatedAt: Date.now() }]);
              setActiveThreadId("default");
            }
          } catch {
            setThreads([{ id: "default", title: "New Chat", messages: [], updatedAt: Date.now() }]);
            setActiveThreadId("default");
          }
        } else {
          setThreads([{ id: "default", title: "New Chat", messages: [], updatedAt: Date.now() }]);
          setActiveThreadId("default");
        }
      }
      setLoading(false);
    }

    loadChats();
  }, [user]);

  // Persist guest chats to localStorage
  useEffect(() => {
    if (!user && !loading && threads.length > 0) {
      window.localStorage.setItem("avoriq_guest_chats", JSON.stringify(threads));
    }
  }, [threads, user, loading]);

  // Save active thread ID
  useEffect(() => {
    if (!loading) {
      if (user) {
        window.localStorage.setItem(`avoriq_active_chat_${user.uid}`, activeThreadId);
      } else {
        window.localStorage.setItem("avoriq_active_chat_guest", activeThreadId);
      }
    }
  }, [activeThreadId, user, loading]);

  const createThread = useCallback(() => {
    const newId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newThread: ChatThread = {
      id: newId,
      title: "New Chat",
      messages: [],
      updatedAt: Date.now(),
    };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newId);
    return newId;
  }, []);

  const deleteThread = useCallback(async (id: string) => {
    // If logged in, clear in PostgreSQL database
    if (user) {
      try {
        await clearChatHistory(user.uid, id);
      } catch (e) {
        console.error("Failed to delete chat thread from DB:", e);
      }
    }

    setThreads((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      // Ensure we always have at least one thread
      if (filtered.length === 0) {
        const defaultThread = {
          id: "default",
          title: "New Chat",
          messages: [],
          updatedAt: Date.now(),
        };
        setActiveThreadId("default");
        return [defaultThread];
      }
      
      // If deleted active thread, switch to the first available one
      if (activeThreadId === id) {
        setActiveThreadId(filtered[0].id);
      }
      
      return filtered;
    });
  }, [user, activeThreadId]);

  const clearAllThreads = useCallback(async () => {
    if (user) {
      try {
        await clearChatHistory(user.uid);
      } catch (e) {
        console.error("Failed to clear all threads from DB:", e);
      }
    }
    const defaultThread = {
      id: "default",
      title: "New Chat",
      messages: [],
      updatedAt: Date.now(),
    };
    setThreads([defaultThread]);
    setActiveThreadId("default");
  }, [user]);

  const updateThreadMessages = useCallback((id: string, newMessages: ChatMessage[]) => {
    let hadRealMessages = false;

    setThreads((prev) => {
      const existingThread = prev.find((t) => t.id === id);
      hadRealMessages = existingThread ? existingThread.messages.some((m) => m.sender === "user") : false;

      const updated = prev.map((t) => {
        if (t.id === id) {
          const sanitized = newMessages.map((m) =>
            m.isStreaming ? { ...m, isStreaming: false } : m
          );
          return {
            ...t,
            title: generateTitle(newMessages),
            messages: sanitized,
            updatedAt: Date.now(),
          };
        }
        return t;
      });
      return updated;
    });

    // Synchronize with database in the background if logged in
    const hasRealMessages = newMessages.some((m) => m.sender === "user");
    if (user) {
      if (hasRealMessages) {
        // Filter out welcome message (id === "1") and streaming messages
        const toSync = newMessages.filter((m) => !m.isStreaming && m.id !== "1");
        syncChatHistory(user.uid, toSync, id);
      } else if (hadRealMessages) {
        // Only clear from DB if it previously had real messages (i.e. user cleared it)
        clearChatHistory(user.uid, id);
      }
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        threads,
        activeThreadId,
        setActiveThreadId,
        createThread,
        deleteThread,
        updateThreadMessages,
        loading,
        clearAllThreads,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
