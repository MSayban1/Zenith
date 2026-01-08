
import React, { useState } from 'react';
import { AppState, Goal } from '../types';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const GoalTracker: React.FC<Props> = ({ state, setState }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Goal['type']>('short');
  const [targetDate, setTargetDate] = useState('');

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      type,
      progress: 0,
      targetDate
    };
    setState(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
    setTitle('');
  };

  const updateProgress = (id: string, val: number) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, progress: Math.max(0, Math.min(100, val)) } : g)
    }));
  };

  const deleteGoal = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setState(prev => ({ 
      ...prev, 
      goals: prev.goals.filter(g => g.id !== id) 
    }));
  };

  const clearAllGoals = () => {
    try {
      if (window.confirm('PERMANENTLY DELETE ALL GOALS? This will erase your entire roadmap.')) {
        setState(prev => ({ ...prev, goals: [] }));
      }
    } catch (e) {
      setState(prev => ({ ...prev, goals: [] }));
    }
  };

  return (
    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Master Goals</h2>
          <p className="text-sm text-slate-500">Track your life's milestones.</p>
        </div>
        <button 
          type="button"
          onClick={clearAllGoals} 
          className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full mt-1 active:bg-red-100 transition-colors border border-red-100"
        >
          Clear All
        </button>
      </header>

      <form onSubmit={addGoal} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <input 
          type="text" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New goal..." 
          className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 font-medium"
        />
        <div className="flex gap-2">
          {(['short', 'mid', 'long'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${type === t ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
           <input 
            type="date" 
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 rounded-2xl text-xs text-slate-500 font-bold outline-none"
          />
          <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold active:scale-95 transition-all shadow-md">Create</button>
        </div>
      </form>

      <div className="space-y-4">
        {state.goals.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="text-slate-400 text-sm font-medium">No goals yet. Dream big.</p>
          </div>
        ) : (
          state.goals.map(goal => (
            <div key={goal.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group hover:border-indigo-100 transition-colors">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${
                    goal.type === 'short' ? 'bg-blue-50 text-blue-600' : 
                    goal.type === 'mid' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {goal.type} Term
                  </span>
                  <h3 className="text-lg font-black text-slate-800 mt-1 leading-tight">{goal.title}</h3>
                  <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-wider">Target: {goal.targetDate || 'Unscheduled'}</p>
                </div>
                <button 
                  type="button"
                  onClick={(e) => deleteGoal(e, goal.id)} 
                  className="text-slate-200 hover:text-red-500 p-2 transition-colors active:scale-125 z-10"
                  title="Delete Goal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
              
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Progress</span>
                  <span className="text-indigo-600">{goal.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${goal.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={goal.progress}
                  onChange={e => updateProgress(goal.id, parseInt(e.target.value))}
                  className="w-full h-1 bg-transparent accent-indigo-600 appearance-none cursor-pointer"
                />
              </div>
              <div className={`absolute top-0 left-0 w-1 h-full ${
                goal.type === 'short' ? 'bg-blue-500' : 
                goal.type === 'mid' ? 'bg-purple-500' : 'bg-orange-500'
              }`} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GoalTracker;
