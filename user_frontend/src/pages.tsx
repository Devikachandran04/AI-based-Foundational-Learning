// src/pages/Dashboard.tsx
import React from 'react';
// You can import more things later, e.g.:
// import { Trophy } from 'lucide-react';   ← if you use lucide icons
// import { useStore } from '../store';      ← if you use zustand

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      {/* Header / Title */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          GrammarPal Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Your progress • Lessons • Achievements • Next challenges
        </p>

        {/* Quick stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Lessons Completed</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2">12</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Current Streak</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">7 days</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Grammar Score</h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">92%</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Trophies</h3>
            <p className="text-4xl font-bold text-yellow-600 mt-2">5 🏆</p>
          </div>
        </div>

        {/* Placeholder sections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <p className="text-gray-500">No recent activity yet. Complete your first lesson!</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">Next Challenge</h2>
          <p className="text-gray-500">Noun Battles – Advanced Level</p>
          <button className="mt-6 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}
