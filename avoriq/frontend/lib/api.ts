/**
 * AvorIQ Frontend — API Client
 * Handles communication with the FastAPI backend.
 * Falls back to local mock data if the backend is unreachable.
 */

import { Scholarship } from "../types/scholarship";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Health Check ──

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Scholarships ──

export async function fetchScholarships(filters?: {
  category?: string;
  educationLevel?: string;
  state?: string;
  status?: string;
}): Promise<Scholarship[] | null> {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.set("category", filters.category);
    if (filters?.educationLevel) params.set("education_level", filters.educationLevel);
    if (filters?.state) params.set("state", filters.state);
    if (filters?.status) params.set("status", filters.status);

    const url = `${API_BASE}/api/scholarships${params.toString() ? "?" + params.toString() : ""}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // Fallback to local data
  }
}

export async function searchScholarships(
  query: string,
  limit = 5,
  profile?: {
    gender?: string;
    educationLevel?: string;
    familyIncomeMax?: number;
    state?: string;
    caste?: string;
  }
): Promise<Array<{ scholarship: Scholarship; similarity_score: number }> | null> {
  try {
    const params = new URLSearchParams({ query, limit: String(limit) });
    if (profile?.gender) params.set("gender", profile.gender);
    if (profile?.educationLevel) params.set("education_level", profile.educationLevel);
    if (profile?.familyIncomeMax !== undefined) params.set("family_income", String(profile.familyIncomeMax));
    if (profile?.state) params.set("state", profile.state);
    if (profile?.caste) params.set("caste", profile.caste);

    const res = await fetch(`${API_BASE}/api/scholarships/search?${params.toString()}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ── Chat ──

export interface ChatStreamCallbacks {
  onScholarships: (scholarships: Scholarship[]) => void;
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}
export async function sendChatMessage(
  message: string,
  profile: {
    educationLevel?: string;
    gender?: string;
    familyIncomeMax?: number;
    state?: string;
    caste?: string;
  } | null,
  callbacks: ChatStreamCallbacks,
  activeScholarships?: Scholarship[] | null,
  history?: any[] | null,
  fileBase64?: string | null,
  fileName?: string | null,
  fileType?: string | null,
  systemPrompt?: string | null
): Promise<void> {
  try {
    const body: Record<string, unknown> = {
      message,
      stream: true,
    };

    if (systemPrompt) {
      body.system_prompt = systemPrompt;
    }

    if (profile) {
      body.profile = {
        educationLevel: profile.educationLevel || null,
        gender: profile.gender || null,
        familyIncomeMax: profile.familyIncomeMax ?? null,
        state: profile.state || null,
        caste: profile.caste || null,
      };
    }

    if (activeScholarships) {
      body.active_scholarships = activeScholarships;
    }

    if (history) {
      // Filter out welcome message (id === "1") and only take last 10 messages for LLM context
      const filtered = history.filter((h) => h.id !== "1" && !h.isStreaming).slice(-10);
      body.history = filtered.map((h) => {
        if (h && typeof h === "object" && "role" in h && "content" in h) {
          return {
            role: h.role,
            content: h.content || "",
          };
        }
        return {
          role: h.sender === "user" ? "user" : "assistant",
          content: h.text || "",
        };
      });
    }

    if (fileBase64) {
      body.file_base64 = fileBase64;
      body.file_name = fileName || null;
      body.file_type = fileType || null;
    }

    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      callbacks.onError(`API error: ${res.status}`);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      callbacks.onError("No response body");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            switch (event.type) {
              case "scholarships":
                callbacks.onScholarships(event.data || []);
                break;
              case "token":
                callbacks.onToken(event.data || "");
                break;
              case "done":
                callbacks.onDone();
                break;
              case "error":
                callbacks.onError(event.data || "Unknown error");
                break;
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }

    // Process any remaining buffer
    if (buffer.startsWith("data: ")) {
      try {
        const event = JSON.parse(buffer.slice(6).trim());
        if (event.type === "done") callbacks.onDone();
      } catch {
        // Ignore
      }
    }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Network error";
    callbacks.onError(errMsg);
  }
}

/**
 * Non-streaming chat (fallback for simpler use cases).
 */
export async function sendChatMessageBatch(
  message: string,
  profile: Record<string, unknown> | null
): Promise<{ response: string; scholarships: Scholarship[] } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        stream: false,
        profile: profile || undefined,
      }),
      signal: AbortSignal.timeout(60000), // CPU inference can be slow
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ── User Profiles ──

/**
 * Fetch user profile from backend.
 * Returns:
 *   - profile object on success (200)
 *   - null if profile not found (404)
 *   - undefined if backend is unreachable or returned a server error
 */
export async function fetchUserProfile(uid: string): Promise<any | null | undefined> {
  try {
    const res = await fetch(`${API_BASE}/api/users/${uid}/profile`, { signal: AbortSignal.timeout(5000) });
    if (res.status === 404) return null; // Profile genuinely doesn't exist
    if (!res.ok) return undefined; // Server error — don't assume no profile
    return await res.json();
  } catch {
    return undefined; // Network error — backend unreachable
  }
}

export async function saveUserProfile(
  uid: string,
  email: string,
  profileData: any
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/users/${uid}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profileData.name,
        email,
        educationLevel: profileData.educationLevel,
        gender: profileData.gender,
        familyIncomeMax: profileData.familyIncomeMax,
        state: profileData.state,
        caste: profileData.caste,
        collegeName: profileData.collegeName,
        enrollmentNumber: profileData.enrollmentNumber,
        targetExam: profileData.targetExam,
        careerInterest: profileData.careerInterest,
        enableAutofill: profileData.enableAutofill,
        calibrationAnswers: profileData.calibrationAnswers,
        calibrationCsv: profileData.calibrationCsv,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── User Chat Histories ──

export async function fetchChatHistory(uid: string): Promise<any[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/users/${uid}/chat`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function syncChatHistory(uid: string, messages: any[], chatId: string = "default"): Promise<boolean> {
  try {
    // Sanitize messages so we only sync completed (non-streaming) items
    const sanitized = messages
      .filter((m) => !m.isStreaming)
      .map((m) => ({
        id: String(m.id),
        sender: m.sender,
        text: m.text,
        results: m.results || [],
      }));

    const res = await fetch(`${API_BASE}/api/users/${uid}/chat?chatId=${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: sanitized }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function clearChatHistory(uid: string, chatId?: string): Promise<boolean> {
  try {
    const url = chatId 
      ? `${API_BASE}/api/users/${uid}/chat?chatId=${chatId}`
      : `${API_BASE}/api/users/${uid}/chat`;
    const res = await fetch(url, {
      method: "DELETE",
    });
    return res.ok;
  } catch {
    return false;
  }
}

