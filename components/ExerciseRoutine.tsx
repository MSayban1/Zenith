
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
  const [alarmEnabled, setAlarmEnabled] = useState(true);

  const addExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newEx: Exercise = {
      id: Date.now().toString(),
      name,
      duration,
      completed: false,
      reminderTime: reminder,
      alarmEnabled
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

  const toggleAlarm = (id: string) => {
    setState(prev => ({
      ...prev,
      exercises: prev.exercises.map(e => e.id === id ? { ...e, alarmEnabled: !e.alarmEnabled } : e)
    }));
  };

  const removeEx = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setState(prev => ({ ...prev, exercises: prev.exercises.filter(e => e.id !== id) }));
  };

  return (
    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Fit & Vital</h2>
        <p className="text-sm text-slate-500">Strong body, focused mind.</p>
      </header>

      <form onSubmit={addExercise} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <input 
          type="text" 
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New exercise..." 
          className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800 font-medium"
        />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="px-4 py-2 bg-slate-50 rounded-xl font-bold" />
          <input type="time" value={reminder} onChange={e => setReminder(e.target.value)} className="px-4 py-2 bg-slate-50 rounded-xl font-bold" />
        </div>
        <div className="flex justify-between items-center px-1">
          <button 
            type="button"
            onClick={() => setAlarmEnabled(!alarmEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${alarmEnabled ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
          >
            Alarm {alarmEnabled ? 'ON' : 'OFF'}
          </button>
          <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-orange-100 active:scale-95">Add</button>
        </div>
      </form>

      <div className="space-y-3">
        {state.exercises.map(ex => (
          <div key={ex.id} className={`flex items-center p-4 rounded-3xl border transition-all ${ex.completed ? 'bg-orange-50/50 border-orange-100 opacity-60' : 'bg-white border-slate-100 shadow-sm'}`}>
            <button 
              onClick={() => toggleExercise(ex.id)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-all ${ex.completed ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 18h.01"/><path d="M12 6h.01"/><path d="M18 12h.01"/><path d="M6 12h.01"/></svg>
            </button>
            <div className="flex-1 cursor-pointer" onClick={() => toggleExercise(ex.id)}>
              <h4 className="font-bold text-slate-800">{ex.name}</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{ex.duration}m • {ex.reminderTime}</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                type="button"
                onClick={() => toggleAlarm(ex.id)}
                className={`p-2 rounded-xl ${ex.alarmEnabled ? 'text-orange-500 bg-orange-50' : 'text-slate-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </button>
              <button onClick={(e) => removeEx(e, ex.id)} className="p-2 text-red-200 active:scale-125"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseRoutine;
