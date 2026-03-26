import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  class: string;
  isLoggedIn: boolean;
}

interface AppState {
  user: User | null;
  currentLesson: string | null;
  score: number;
  login: (username: string, password: string, className: string) => Promise<void>;
  logout: () => void;
  setLesson: (lesson: string) => void;
  setScore: (score: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      currentLesson: null,
      score: 0,
      login: async (username: string, password: string, className: string) => {
  try {
    const res = await fetch(
      "https://ai-based-foundational-learning-production.up.railway.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);
    if (!res.ok) {
  alert(data.message || "Login failed");
  return;
}

    // store token
    localStorage.setItem("token", data.token);

    // update Zustand state
    set({
      user: {
        username,
        class: className,
        isLoggedIn: true,
      },
    });

  } catch (err) {
    console.error("Login failed", err);
  }
},
      logout: () => set({ user: null, currentLesson: null, score: 0 }),
      setLesson: (lesson) => set({ currentLesson: lesson }),
      setScore: (newScore) => set((state) => ({ score: state.score + newScore })),
    }),
    {
      name: 'grammar-pal-storage',
    }
  )
);
