
import React from 'react';
import { AppTab, AppState } from '../types';

interface DashboardProps {
  state: AppState;
  onNav: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onNav }) => {
  const completedRoutine = state.routine.filter(t => t.completed).length;
  const totalRoutine = state.routine.length;
  const routinePct = totalRoutine > 0 ? Math.round((completedRoutine / totalRoutine) * 100) : 0;

  const activeGoals = state.goals.length;
  const completedExercise = state.exercises.filter(e => e.completed).length;

  return (
    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl font-extrabold text-slate-900">Good Day, Warrior.</h2>
        <p className="text-slate-500 text-sm mt-1">Discipline is the bridge between goals and accomplishment.</p>
      </header>

      {/* Daily Progress Card */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium">Daily Routine</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-4xl font-bold">{routinePct}%</h3>
            <span className="text-indigo-200 text-sm">{completedRoutine}/{totalRoutine} tasks</span>
          </div>
          <div className="w-full bg-indigo-800/50 rounded-full h-2 mt-4 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-700 ease-out" 
              style={{ width: `${routinePct}%` }}
            />
          </div>
        </div>
        {/* Background blobs for visual flair */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => onNav(AppTab.GOALS)} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-transform">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Goals</p>
          <p className="text-2xl font-bold text-slate-800">{activeGoals}</p>
        </div>
        <div onClick={() => onNav(AppTab.EXERCISE)} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-transform">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 12h.01"/><path d="M6 12h.01"/><path d="M12 18h.01"/><path d="M12 6h.01"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Exercises Done</p>
          <p className="text-2xl font-bold text-slate-800">{completedExercise}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Focus Sessions</h4>
        <div 
          onClick={() => onNav(AppTab.STUDY)}
          className="flex items-center p-4 bg-slate-900 text-white rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="flex-1">
            <h5 className="font-bold">Start Pomodoro</h5>
            <p className="text-xs text-slate-400">Total study: {state.studyStats.totalMinutes}m</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </section>

      {/* Motivation Tip */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
        <p className="text-amber-800 text-sm italic">
          "The best time to plant a tree was 20 years ago. The second best time is now."
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
