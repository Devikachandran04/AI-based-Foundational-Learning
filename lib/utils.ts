import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function calculateScore(correct: number, total: number): number {
  return Math.round((correct / total) * 100);
}

export function getEncouragingMessage(score: number): string {
  if (score >= 90) return "Amazing! You're a preposition superstar! 🌟";
  if (score >= 70) return "Awesome job! You're doing great! 🎉";
  if (score >= 50) return "Good try! Keep practicing! 💪";
  return "Don't worry! Let's learn together! 🌈";
}
