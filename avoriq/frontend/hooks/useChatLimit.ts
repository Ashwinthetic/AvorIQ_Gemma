"use client";

import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "./useLocalStorage";

export const GUEST_MESSAGE_LIMIT = 3;

export function useChatLimit() {
  const { user, loading } = useAuth();
  const [messageCount, setMessageCount] = useLocalStorage<number>("avoriq_guest_msg_count", 0);

  const isAuthenticated = !!user;
  // If session is loading, we assume they might be authenticated to avoid overlay flashes
  const isLimitReached = !loading && !isAuthenticated && messageCount >= GUEST_MESSAGE_LIMIT;

  const incrementMessageCount = () => {
    if (!loading && !isAuthenticated) {
      setMessageCount(messageCount + 1);
    }
  };

  return {
    isAuthenticated,
    isLimitReached,
    messageCount,
    incrementMessageCount,
    limit: GUEST_MESSAGE_LIMIT
  };
}
