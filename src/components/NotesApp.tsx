import React, { useState, useEffect } from 'react';
import { SecretNote } from '../types';
import { FileText, Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function NotesApp() {
  const [notes, setNotes] = useState<SecretNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<SecretNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Load from LocalStorage
  useEffect(() => {
    const raw = localStorage.getItem('adv_calc_vault_notes');
    if (raw) {
      try {
        setNotes(JSON.parse(raw));
      } catch (e) {
        // empty
      }
    } else {
      // Default mock notes
      const defaults: SecretNote[] = [
        {
          id: '1',
          title: 'Operation Omega Protocol',
          content: 'The primary passcode to the central terminal is configured to reset weekly. Maintain strict communication silence. Meet at coordinate delta after sunset.',
          createdAt: '2026-06-22 22:15'
        },
        {
          id: '2',
          title: 'Wife Birthday Gift List',
          content: '1. Platinum necklace with diamond studs\n2. Quiet weekend retreat reservation\n3. Elegant leather journal she saw last month.',
          createdAt: '2026-06-23 00:30'
        }
      ];
      setNotes(defaults);
      localStorage.setItem('adv_calc_vault_notes', JSON.stringify(defaults));
    }
  }, []);

  const saveToStorage = (updatedList: SecretNote[]) => {
    setNotes(updatedList);
    localStorage.setItem('adv_calc_vault_notes', JSON.stringify(updatedList));
  };

  const handleCreateNew = () => {
    setSelectedNote(null);
    setTitle('');
    setContent('');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    let updated: SecretNote[];
    if (selectedNote) {
      // Edit
      updated = notes.map(n => n.id === selectedNote.id ? {
        ...n,
        title: title || 'Untitled Note',
        content,
        createdAt: new Date().toLocaleString()
      } : n);
    } else {
      // Create
      const newNote: SecretNote = {
        id: Date.now().toString(),
        title: title || 'Untitled Note',
        content,
        createdAt: new Date().toLocaleString()
      };
      updated = [newNote, ...notes];
    }

    saveToStorage(updated);
    setIsEditing(false);
    setSelectedNote(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm && !window.confirm('Delete this secure note permanently?')) return;
    const updated = notes.filter(n => n.id !== id);
    saveToStorage(updated);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const handleSelect = (note: SecretNote) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans">
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-base tracking-tight">Ghost Notes Vault</span>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-xs bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-3 py-1 rounded"
            >
              Save Note
            </button>
          </div>
        ) : (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1 text-xs bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Note
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex-1 flex flex-col p-4 space-y-3 bg-slate-900 overflow-y-auto">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Secure Title..."
            className="w-full bg-transparent text-xl font-bold border-b border-slate-800 pb-2 focus:outline-none focus:border-yellow-500 placeholder-slate-600"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your encrypted thoughts here..."
            className="w-full flex-1 bg-transparent resize-none focus:outline-none focus:border-none placeholder-slate-600 text-sm leading-relaxed"
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-center px-4">
              <FileText className="w-12 h-12 stroke-1 mb-2 text-slate-600" />
              <p className="text-sm font-semibold">No Secure Notes Stored</p>
              <p className="text-xs text-slate-600 mt-1">Tap 'Add Note' to jot down private facts or security codes.</p>
            </div>
          ) : (
            notes.map(note => (
              <div
                key={note.id}
                onClick={() => handleSelect(note)}
                className="group relative bg-slate-950 hover:bg-slate-800 border border-slate-800 p-3 rounded-xl cursor-pointer transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-sm text-yellow-500 pr-6 truncate">{note.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-900/60 text-[10px] text-slate-500">
                  <span>{note.createdAt}</span>
                  <button
                    onClick={(e) => handleDelete(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 rounded transition-opacity"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
