import React, { useState, useEffect } from 'react';
import { SecretContact } from '../types';
import { Phone, Plus, Trash2, Search, User } from 'lucide-react';

export default function ContactsApp() {
  const [contacts, setContacts] = useState<SecretContact[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | 'Personal' | 'Work' | 'Classified'>('All');
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [contactCat, setContactCat] = useState<'Personal' | 'Work' | 'Classified'>('Classified');

  useEffect(() => {
    const raw = localStorage.getItem('adv_calc_vault_contacts');
    if (raw) {
      try {
        setContacts(JSON.parse(raw));
      } catch (e) {
        // empty
      }
    } else {
      const defaults: SecretContact[] = [
        {
          id: 'c1',
          name: 'Handler James (Agency)',
          phone: '+1 (555) 019-2834',
          email: 'james.009@overwatch.secure',
          notes: 'Only dial via encrypted burner line. Weekly debriefs are Thursday 14:00.',
          category: 'Classified'
        },
        {
          id: 'c2',
          name: 'Dr. Evelyn Sterling',
          phone: '+44 20 7946 0912',
          email: 'evelyn.sterling@quant.res',
          notes: 'Chief quantum computation advisor. Knows about Project Omega.',
          category: 'Work'
        }
      ];
      setContacts(defaults);
      localStorage.setItem('adv_calc_vault_contacts', JSON.stringify(defaults));
    }
  }, []);

  const saveToStorage = (updatedList: SecretContact[]) => {
    setContacts(updatedList);
    localStorage.setItem('adv_calc_vault_contacts', JSON.stringify(updatedList));
  };

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) return;
    const newC: SecretContact = {
      id: Date.now().toString(),
      name,
      phone,
      email,
      notes,
      category: contactCat
    };
    const updated = [...contacts, newC];
    saveToStorage(updated);
    setIsAdding(false);
    // Reset fields
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setContactCat('Classified');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm && !window.confirm('Erase this classified contact registry?')) return;
    const updated = contacts.filter(c => c.id !== id);
    saveToStorage(updated);
  };

  const filtered = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.phone.includes(search) ||
                          c.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' ? true : c.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none">
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-base tracking-tight">Shadow Contacts</span>
        </div>
        {isAdding ? (
          <button
            onClick={() => setIsAdding(false)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded"
          >
            Back
          </button>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Contact
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="flex-1 p-4 bg-slate-950 overflow-y-auto space-y-3">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest font-mono">Create Secure Contact</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">Security Identifier (Name)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Agent / Name"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">Burner Line Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (xxx) xxx-xxxx"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">Secure Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="covert@overwatch.secure"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">Security Classification</label>
              <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-905 border border-slate-800 rounded-lg">
                {(['Personal', 'Work', 'Classified'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setContactCat(cat)}
                    className={`py-1.5 text-xs rounded transition-all ${
                      contactCat === cat
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">Security Briefing (Memo)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Confidential files, drop schedules, or keys..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white h-20 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!name.trim() || !phone.trim()}
            className={`w-full py-2.5 rounded-xl font-bold text-center text-xs mt-4 transition-all ${
              name.trim() && phone.trim()
                ? 'bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white shadow-lg shadow-indigo-950/40'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            Seal Contact Identity
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
          {/* Sub Filters */}
          <div className="p-3 bg-slate-900/60 border-b border-slate-850 space-y-2">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search covert contacts..."
                className="w-full bg-slate-950 text-xs rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Quick Categories */}
            <div className="flex gap-1.5 overflow-x-auto py-0.5">
              {(['All', 'Personal', 'Work', 'Classified'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 text-[10px] rounded-full transition-all flex-shrink-0 ${
                    category === cat
                      ? 'bg-slate-200 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-850'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-neutral-500 text-center">
                <p className="text-xs font-semibold">No contacts found</p>
                <p className="text-[10px] text-neutral-600 mt-0.5">Toggle filter chips or add a new classified node.</p>
              </div>
            ) : (
              filtered.map(contact => (
                <div
                  key={contact.id}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-3 rounded-xl transition-all relative group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-900 flex items-center justify-center text-indigo-400 text-xs font-bold uppercase">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5 flex-wrap">
                          {contact.name}
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full ${
                            contact.category === 'Classified' ? 'bg-red-950 border border-red-900 text-red-400' :
                            contact.category === 'Work' ? 'bg-indigo-950 border border-indigo-900 text-indigo-400' :
                            'bg-slate-950 text-slate-400 border border-slate-800'
                          }`}>
                            {contact.category}
                          </span>
                        </h4>
                        <p className="text-xs font-mono text-slate-400 mt-1 select-all">{contact.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(contact.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {contact.email && (
                    <p className="text-[10px] text-indigo-400 font-mono mt-1.5 pl-10 select-all">
                      ✉ {contact.email}
                    </p>
                  )}
                  {contact.notes && (
                    <p className="text-[10.5px] text-slate-500 leading-relaxed mt-2 p-2 bg-slate-950 rounded-lg border border-slate-850/40 select-text">
                      {contact.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
