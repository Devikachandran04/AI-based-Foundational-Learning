import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id?: string;
  username: string;
  class: string;
  role: string;
  isLoggedIn: boolean;
}

interface AppState {
  user: User | null;
  currentLesson: string | null;
  score: number;

  login: (username: string, password: string, className: string) => Promise<any>;
  register: (name: string, email: string, password: string, className: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (email: string, resetToken: string, newPassword: string) => Promise<any>;

  logout: () => void;
  setLesson: (lesson: string) => void;
  setScore: (score: number) => void;
}

const BASE_URL = "https://ai-based-foundational-learning-production.up.railway.app";

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      currentLesson: null,
      score: 0,

      login: async (username: string, password: string, className: string) => {
        try {
          const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: username,
              password: password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            alert(data.error || "Login failed");
            return null;
          }

          localStorage.setItem("token", data.token);

          if (data.user.role === "teacher") {
            window.location.href =
              `https://ai-based-foundational-learning-admin.vercel.app/?token=${data.token}`;
            return data;
          }

          set({
            user: {
              id: data.user.id,
              username: data.user.name,
              class: data.user.class || className,
              role: data.user.role,
              isLoggedIn: true,
            },
          });

          return data;
        } catch (err) {
          console.error("Login failed", err);
          alert("Login failed");
          return null;
        }
      },

      register: async (name: string, email: string, password: string, className: string) => {
        try {
          const res = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              password,
              class: className,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            alert(data.error || "Registration failed");
            return null;
          }

          localStorage.setItem("token", data.token);

          set({
            user: {
              id: data.user.id,
              username: data.user.name,
              class: data.user.class || className,
              role: data.user.role,
              isLoggedIn: true,
            },
          });

          return data;
        } catch (err) {
          console.error("Registration failed", err);
          alert("Registration failed");
          return null;
        }
      },

      forgotPassword: async (email: string) => {
        try {
          const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await res.json();

          if (!res.ok) {
            alert(data.error || "Failed to send reset link");
            return null;
          }

          alert(data.message || "Reset link sent");
          return data;
        } catch (err) {
          console.error("Forgot password failed", err);
          alert("Forgot password failed");
          return null;
        }
      },

      resetPassword: async (email: string, resetToken: string, newPassword: string) => {
        try {
          const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              reset_token: resetToken,
              new_password: newPassword,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            alert(data.error || "Failed to reset password");
            return null;
          }

          alert(data.message || "Password reset successful");
          return data;
        } catch (err) {
          console.error("Reset password failed", err);
          alert("Reset password failed");
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