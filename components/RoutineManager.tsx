
import React, { useState } from 'react';
import { AppState, Task } from '../types';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const RoutineManager: React.FC<Props> = ({ state, setState }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('08:00');
  const [alarmEnabled, setAlarmEnabled] = useState(true);

  const toggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      routine: prev.routine.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const toggleAlarm = (id: string) => {
    setState(prev => ({
      ...prev,
      routine: prev.routine.map(t => t.id === id ? { ...t, alarmEnabled: !t.alarmEnabled } : t)
    }));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      time: newTaskTime,
      alarmEnabled
    };
    setState(prev => ({ ...prev, routine: [...prev.routine, newTask] }));
    setNewTaskText('');
  };

  const deleteTask = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, routine: prev.routine.filter(t => t.id !== id) }));
  };

  const sortedRoutine = [...state.routine].sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  return (
    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daily Routine</h2>
          <p className="text-sm text-slate-500">Master your day with precision.</p>
        </div>
      </div>

      <form onSubmit={addTask} className="space-y-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <input 
          type="text" 
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          placeholder="New task..." 
          className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 font-medium"
        />
        <div className="flex items-center justify-between px-1">
          <div className="flex gap-2 items-center">
            <input type="time" value={newTaskTime} onChange={e => setNewTaskTime(e.target.value)} className="bg-slate-50 rounded-xl px-3 py-2 font-bold text-slate-600 outline-none" />
          </div>
          <button 
            type="button"
            onClick={() => setAlarmEnabled(!alarmEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${alarmEnabled ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Alarm {alarmEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all">Add to Routine</button>
      </form>

      <div className="space-y-3">
        {sortedRoutine.map(task => (
          <div key={task.id} className={`flex items-center p-4 bg-white border ${task.completed ? 'border-indigo-100 opacity-60' : 'border-slate-100'} rounded-3xl shadow-sm transition-all`}>
            <button 
              type="button"
              onClick={() => toggleTask(task.id)}
              className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}
            >
              {task.completed && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </button>
            <div className="flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
              <p className={`font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.text}</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{task.time}</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                type="button" 
                onClick={() => toggleAlarm(task.id)}
                className={`p-2 rounded-xl transition-all ${task.alarmEnabled ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </button>
              <button 
                type="button"
                onClick={(e) => deleteTask(e, task.id)} 
                className="text-red-200 hover:text-red-500 p-2 active:scale-125"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutineManager;
