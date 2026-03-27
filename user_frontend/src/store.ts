import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  class: string;
  role: string;   // ✅ added
  isLoggedIn: boolean;
}

interface AppState {
  user: User | null;
  currentLesson: string | null;
  score: number;

  // ✅ ONLY TYPE HERE
  login: (username: string, password: string, className: string) => Promise<any>;

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

      // ✅ ACTUAL FUNCTION HERE
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
          email: username,
          password: password,
        }),
      }
    );

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (!res.ok) {
      alert(data.error || "Login failed");
      return null;
    }

    // ✅ ALWAYS STORE TOKEN
    localStorage.setItem("token", data.token);

    // ✅ 🔥 IMPORTANT FIX
    if (data.user.role === "teacher") {
      // ❌ DO NOT store in Zustand
      // 👉 directly go to admin
      window.location.href =
        `https://ai-based-foundational-learning-admin.vercel.app/?token=${data.token}`;

      return data;
    }

    // ✅ ONLY STUDENTS STORED
    set({
      user: {
        username,
        class: className,
        role: data.user.role,
        isLoggedIn: true,
      },
    });

    return data;

  } catch (err) {
    console.error("Login failed", err);
    return null;
  }
},

      logout: () => {
  localStorage.removeItem("token");
  localStorage.removeItem("grammar-pal-storage");

  set({ user: null, currentLesson: null, score: 0 });
},

      setLesson: (lesson) => set({ currentLesson: lesson }),

      setScore: (newScore) =>
        set((state) => ({ score: state.score + newScore })),
    }),
    {
      name: 'grammar-pal-storage',
    }
  )
);