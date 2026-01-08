
import React, { useState } from 'react';
import { AppState, Note } from '../types';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const NotesSection: React.FC<Props> = ({ state, setState }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const saveNote = () => {
    if (!title.trim() && !content.trim()) {
      setIsAdding(false);
      return;
    }
    const newNote: Note = {
      id: Date.now().toString(),
      title: title || 'Untitled Reflection',
      content,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setState(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  const deleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setState(prev => ({ 
      ...prev, 
      notes: prev.notes.filter(n => n.id !== id) 
    }));
  };

  const clearAllNotes = () => {
    try {
      if (window.confirm('DANGER: This will permanently delete your entire history of reflections. Are you absolutely sure?')) {
        setState(prev => ({ ...prev, notes: [] }));
      }
    } catch (e) {
      setState(prev => ({ ...prev, notes: [] }));
    }
  };

  return (
    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reflections</h2>
          <p className="text-sm text-slate-500">Your journey of discipline.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
            type="button"
            onClick={clearAllNotes}
            className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full active:bg-red-100 transition-colors border border-red-100"
          >
            Clear All
          </button>
          <button 
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all hover:bg-slate-800"
            title="New Reflection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          </button>
        </div>
      </header>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-2xl space-y-4 animate-in zoom-in-95 duration-300 z-20 sticky top-0">
          <input 
            autoFocus
            type="text" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Focus Topic..." 
            className="w-full text-xl font-black text-slate-800 placeholder:text-slate-200 outline-none"
          />
          <textarea 
            rows={5}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Lessons learned today? Tomorrow's strategy?" 
            className="w-full text-sm text-slate-600 placeholder:text-slate-300 outline-none resize-none leading-relaxed font-medium"
          />
          <div className="flex gap-3 pt-2">
            <button onClick={saveNote} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Reflection</button>
            <button onClick={() => setIsAdding(false)} className="px-6 bg-slate-50 text-slate-400 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {state.notes.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">Your journal is ready for your story.</p>
          </div>
        ) : (
          state.notes.map(note => (
            <div key={note.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-50">
              <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{note.date}</p>
                <button 
                  type="button"
                  onClick={(e) => deleteNote(e, note.id)} 
                  className="text-slate-200 hover:text-red-500 transition-colors p-1 active:scale-125 z-10"
                  title="Delete Entry"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">{note.title}</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed whitespace-pre-wrap font-medium">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesSection;
