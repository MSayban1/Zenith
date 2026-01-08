
import React, { useState } from 'react';
import { AppState, Exercise } from '../types';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const ExerciseRoutine: React.FC<Props> = ({ state, setState }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(10);
  const [reminder, setReminder] = useState('08:00');

  const addExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newEx: Exercise = {
      id: Date.now().toString(),
      name,
      duration,
      completed: false,
      reminderTime: reminder
    };
    setState(prev => ({ ...prev, exercises: [...prev.exercises, newEx] }));
    setName('');
  };

  const toggleExercise = (id: string) => {
    setState(prev => ({
      ...prev,
      exercises: prev.exercises.map(e => e.id === id ? { ...e, completed: !e.completed } : e)
    }));
  };

  const removeEx = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setState(prev => ({ 
      ...prev, 
      exercises: prev.exercises.filter(e => e.id !== id) 
    }));
  };

  const clearAllExercises = () => {
    try {
      if (window.confirm('PERMANENTLY DELETE ALL EXERCISES from your list?')) {
        setState(prev => ({ ...prev, exercises: [] }));
      }
    } catch (e) {
      setState(prev => ({ ...prev, exercises: [] }));
    }
  };

  return (
    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fit & Vital</h2>
          <p className="text-sm text-slate-500">Strong body, focused mind.</p>
        </div>
        <button 
          type="button"
          onClick={clearAllExercises} 
          className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full mt-1 active:bg-red-100 transition-colors border border-red-100"
        >
          Clear All
        </button>
      </header>

      <form onSubmit={addExercise} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <input 
          type="text" 
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New exercise routine..." 
          className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800 font-medium"
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minutes</label>
            <input 
              type="number" 
              value={duration}
              onChange={e => setDuration(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reminder</label>
            <input 
              type="time" 
              value={reminder}
              onChange={e => setReminder(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white transition-colors"
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-100 active:scale-95 transition-all">Add Exercise</button>
      </form>

      <div className="space-y-3">
        {state.exercises.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="text-slate-400 text-sm font-medium">No exercises listed yet.</p>
          </div>
        ) : (
          state.exercises.map(ex => (
            <div key={ex.id} className={`flex items-center p-4 rounded-3xl border transition-all ${ex.completed ? 'bg-orange-50/50 border-orange-100 shadow-inner' : 'bg-white border-slate-100 shadow-sm'}`}>
               <button 
                  type="button"
                  onClick={() => toggleExercise(ex.id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-all ${ex.completed ? 'bg-orange-500 text-white shadow-lg rotate-6' : 'bg-slate-50 text-slate-300 hover:text-orange-400'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 18h.01"/><path d="M12 6h.01"/><path d="M18 12h.01"/><path d="M6 12h.01"/></svg>
                </button>
                <div className="flex-1 cursor-pointer" onClick={() => toggleExercise(ex.id)}>
                  <h4 className={`font-bold transition-all ${ex.completed ? 'text-orange-900 line-through opacity-40' : 'text-slate-800'}`}>{ex.name}</h4>
                  <div className="flex gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                    <span>{ex.duration}m</span>
                    <span className="text-slate-200">•</span>
                    <span>{ex.reminderTime}</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={(e) => removeEx(e, ex.id)} 
                  className="p-2 text-slate-200 hover:text-red-500 transition-colors active:scale-125 z-10"
                  title="Remove exercise"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExerciseRoutine;
