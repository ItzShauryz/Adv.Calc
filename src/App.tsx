import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  LockKeyhole,
  Lock,
  Plus,
  RefreshCw,
  FolderOpen,
  Wifi,
  Battery,
  ChevronLeft,
  Settings,
  Phone,
  FolderLock,
  Eye,
  Menu,
  Heart,
  Undo2,
  Bookmark,
  Share2,
  X,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { HiddenApp } from './types';

// Apps Import
import EquationSolver from './components/EquationSolver';
import NotesApp from './components/NotesApp';
import PhotosApp from './components/PhotosApp';
import ContactsApp from './components/ContactsApp';
import BrowserApp from './components/BrowserApp';
import SnakeGameApp from './components/SnakeGameApp';
import AppHiderApp from './components/AppHiderApp';
import CustomAddedApp from './components/CustomAddedApp';

// Setup Default Apps configuration
const INITIAL_HIDDEN_APPS: HiddenApp[] = [
  {
    id: 'notes',
    name: 'Ghost Notes Vault',
    icon: '📝',
    color: 'bg-yellow-600',
    description: 'Encrypted secure thoughts and key directories.',
    isHidden: false,
    category: 'System'
  },
  {
    id: 'photos',
    name: 'Photo Vault',
    icon: '🖼️',
    color: 'bg-emerald-600',
    description: 'Manual secure photo uploader and visual vault.',
    isHidden: false,
    category: 'Media'
  },
  {
    id: 'contacts',
    name: 'Shadow Contacts',
    icon: '👤',
    color: 'bg-indigo-600',
    description: 'Classified list for encrypted line communications.',
    isHidden: false,
    category: 'Contacts'
  },
  {
    id: 'browser',
    name: 'Incognito Onion',
    icon: '🌐',
    color: 'bg-neutral-800',
    description: 'Decentralized anonymous sandboxed browser.',
    isHidden: false,
    category: 'Browser'
  },
  {
    id: 'game',
    name: 'Viper Game',
    icon: '🎮',
    color: 'bg-purple-600',
    description: 'Classic grid snake crawler fully playable.',
    isHidden: false,
    category: 'Entertainment'
  },
  {
    id: 'guard',
    name: 'App Guard Shortcut',
    icon: '🛡️',
    color: 'bg-red-650',
    description: 'Secure dashboard to hide custom apps from Well-Being logs.',
    isHidden: false, // Managed by App Guard. Keep this shortcut always active in the secret space.
    category: 'Security'
  }
];

export default function App() {
  // Mobile Simulator state variables
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(100);

  // Calculator Mode toggler
  const [calcMode, setCalcMode] = useState<'standard' | 'equation'>('standard');

  // Standard Calculator State
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [clearText, setClearText] = useState('AC');
  const [storedVal, setStoredVal] = useState<number | null>(null);
  const [nextOperator, setNextOperator] = useState<string | null>(null);
  const [isResetOnNext, setIsResetOnNext] = useState(false);

  // Hidden Vault state variables
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [activeVaultApp, setActiveVaultApp] = useState<string | null>(null);
  const [hiddenAppsList, setHiddenAppsList] = useState<HiddenApp[]>([]);

  // Custom App creation form states
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppIcon, setNewAppIcon] = useState('📸');
  const [newAppColor, setNewAppColor] = useState('bg-pink-600');
  const [newAppCategory, setNewAppCategory] = useState('Social');
  const [newAppDescription, setNewAppDescription] = useState('');

  const resetNewAppForm = () => {
    setNewAppName('');
    setNewAppIcon('📸');
    setNewAppColor('bg-pink-650');
    setNewAppCategory('Social');
    setNewAppDescription('');
  };

  const handleCreateCustomApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const newId = 'custom_' + Date.now();
    const newAppItem: HiddenApp = {
      id: newId,
      name: newAppName.trim(),
      icon: newAppIcon,
      color: newAppColor,
      description: newAppDescription || `Private sandboxed ${newAppCategory.toLowerCase()} container.`,
      isHidden: false,
      category: newAppCategory
    };

    const updatedList = [...hiddenAppsList, newAppItem];
    setHiddenAppsList(updatedList);
    localStorage.setItem('adv_calc_hidden_apps_config', JSON.stringify(updatedList));
    
    setIsAddAppModalOpen(false);
    resetNewAppForm();
  };

  // Sync clock time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hrs = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12;
      hrs = hrs ? hrs : 12; // the hour '0' should be '12'
      setCurrentTime(`${hrs}:${mins} ${ampm}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  // Sync battery draining slightly as fun simulation
  useEffect(() => {
    const drain = setInterval(() => {
      setBatteryLevel(b => Math.max(15, b - 1));
    }, 180000);
    return () => clearInterval(drain);
  }, []);

  // Fetch or initialize hidden apps configuration list from localStorage
  const loadAppsConfig = () => {
    const raw = localStorage.getItem('adv_calc_hidden_apps_config');
    if (raw) {
      try {
        setHiddenAppsList(JSON.parse(raw));
      } catch (e) {
        setHiddenAppsList(INITIAL_HIDDEN_APPS);
      }
    } else {
      setHiddenAppsList(INITIAL_HIDDEN_APPS);
      localStorage.setItem('adv_calc_hidden_apps_config', JSON.stringify(INITIAL_HIDDEN_APPS));
    }
  };

  useEffect(() => {
    loadAppsConfig();
  }, []);

  // Standard iOS Calculator Logic
  const handleNumClick = (num: string) => {
    if (display === '0' || isResetOnNext) {
      setDisplay(num);
      setIsResetOnNext(false);
    } else {
      setDisplay(display + num);
    }
    setClearText('C');
    setFormula(prev => prev === '0' ? num : prev + num);
  };

  const handleOperatorClick = (op: string) => {
    const currentNum = parseFloat(display);

    // Let's build trigger evaluation
    // Formula looks like: "520+520" and they clicked "÷"
    const currentFormula = formula + op;
    const cleanFormulaMatch = formula.replace(/\s+/g, ''); // strip spaces: "520+520"
    
    if (cleanFormulaMatch === '520+520' && op === '÷') {
      triggerVaultUnlockSequence();
      return;
    }

    if (storedVal === null) {
      setStoredVal(currentNum);
    } else if (nextOperator) {
      const result = executeOperation(storedVal, currentNum, nextOperator);
      setDisplay(String(result));
      setStoredVal(result);
    }

    setNextOperator(op);
    setIsResetOnNext(true);
    setFormula(prev => prev + ' ' + op + ' ');
  };

  const executeOperation = (prev: number, curr: number, operator: string): number => {
    switch (operator) {
      case '+': return prev + curr;
      case '-': return prev - curr;
      case '×': return prev * curr;
      case '÷': return curr === 0 ? 0 : prev / curr;
      default: return curr;
    }
  };

  const calculateResult = () => {
    if (storedVal === null || !nextOperator) return;
    const currentNum = parseFloat(display);
    const result = executeOperation(storedVal, currentNum, nextOperator);
    
    setDisplay(String(Number(result.toFixed(8))));
    setStoredVal(null);
    setNextOperator(null);
    setIsResetOnNext(true);
    setFormula(String(Number(result.toFixed(8))));
  };

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
    setStoredVal(null);
    setNextOperator(null);
    setIsResetOnNext(false);
    setClearText('AC');
  };

  const handleToggleSign = () => {
    const inverted = parseFloat(display) * -1;
    setDisplay(String(inverted));
    setFormula(String(inverted));
  };

  const handlePercent = () => {
    const percent = parseFloat(display) / 100;
    setDisplay(String(percent));
    setFormula(String(percent));
  };

  const handleDecClick = () => {
    if (isResetOnNext) {
      setDisplay('0.');
      setIsResetOnNext(false);
      setFormula('0.');
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
      setFormula(formula + '.');
    }
  };

  // Physical keyboard support
  useEffect(() => {
    const handleKB = (e: KeyboardEvent) => {
      // Ignore key events if equation solver fields are active!
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (/^\d$/.test(e.key)) {
        handleNumClick(e.key);
      } else if (e.key === '.') {
        handleDecClick();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let visualOp = e.key;
        if (e.key === '*') visualOp = '×';
        if (e.key === '/') visualOp = '÷';
        handleOperatorClick(visualOp);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculateResult();
      } else if (e.key === 'Backspace') {
        if (display.length > 1) {
          setDisplay(display.slice(0, -1));
          setFormula(formula.slice(0, -1));
        } else {
          setDisplay('0');
        }
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKB);
    return () => window.removeEventListener('keydown', handleKB);
  }, [display, formula, storedVal, nextOperator, isResetOnNext]);

  // Activate biometric verification / glowing security transition
  const triggerVaultUnlockSequence = () => {
    handleClear();
    setShowUnlockAnimation(true);
    
    setTimeout(() => {
      setShowUnlockAnimation(false);
      setIsVaultOpen(true);
      setActiveVaultApp(null);
    }, 2800);
  };

  const exitVault = () => {
    setIsVaultOpen(false);
    setActiveVaultApp(null);
    handleClear();
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center p-4 selection:bg-orange-500 selection:text-white relative overflow-hidden">
      
      {/* Dynamic Cosmic Vector Background Stars / Glow */}
      <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full bg-orange-550/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

      {/* Main Framework Holder - simulating high end phone */}
      <main id="applet-frame" className="relative w-full max-w-[365px] h-[760px] bg-black rounded-[48px] shadow-2xl shadow-indigo-950/20 border-[9px] border-neutral-800 flex flex-col overflow-hidden select-none">
        
        {/* Notch Block and Speaker */}
        <div id="phone-notch" className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-neutral-800 rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
          <div className="w-[45%] h-1 bg-neutral-900 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-[#121212] rounded-full border border-neutral-750"></div>
        </div>

        {/* Home Base Swipe Bar at bottom */}
        <div id="phone-home-indicator" className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-neutral-600 rounded-full z-50"></div>

        {/* Operating System Status Bar */}
        <div id="sys-status-bar" className="h-10 bg-transparent flex justify-between items-center px-6 pt-1 text-xs text-white/90 z-20 font-bold select-none">
          <time className="font-mono tracking-tight text-xs">{currentTime || '1:33 AM'}</time>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-normal">Vault Protected</span>
            <div className="flex items-center gap-0.5 bg-neutral-900/40 px-1 py-0.5 rounded border border-neutral-800/40 text-[9px]">
              <Battery className="w-3 h-3 text-emerald-400" />
              <span className="font-mono">{batteryLevel}%</span>
            </div>
          </div>
        </div>

        {/* Screen Interactive Container */}
        <div className="flex-1 w-full relative min-h-0">
          <AnimatePresence mode="wait">
            
            {/* 1. SECURITY UNLOCK ANIMS */}
            {showUnlockAnimation && (
              <motion.div
                key="unlock-anim"
                className="absolute inset-0 bg-neutral-950 z-40 flex flex-col items-center justify-center p-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative mb-6">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-orange-600/10 border-2 border-orange-500/40 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-550/20"
                    animate={{ scale: [1, 1.15, 1], filter: ["blur(0px)", "blur(1px)", "blur(0px)"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  >
                    <LockKeyhole className="w-9 h-9 animate-pulse" />
                  </motion.div>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-neutral-950 flex items-center justify-center text-[8px] font-bold text-white">
                    !
                  </span>
                </div>

                <div className="space-y-1.5 font-mono">
                  <h3 className="text-white text-sm font-bold tracking-widest uppercase">Decryption Core Active</h3>
                  <p className="text-[10px] text-zinc-500">Scanning cryptographic finger key...</p>
                  <p className="text-[11px] text-orange-400 animate-pulse mt-2 font-mono">520_NODE_GRANTED_SUCCESS</p>
                </div>
              </motion.div>
            )}

            {/* 2. MAIN PHONE VAULT HOME VIEWPORT */}
            {isVaultOpen && !showUnlockAnimation && (
              <motion.div
                key="vault-screen"
                className="absolute inset-x-0 top-0 bottom-4 bg-[#0a0f1d] flex flex-col"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                
                {activeVaultApp === null ? (
                  // Secret Folder Grid View
                  <div className="flex-1 flex flex-col p-4">
                    {/* Header bar within vault */}
                    <div className="flex items-center justify-between mb-5 mt-1.5">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase font-mono">Secure Directory</span>
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                          <FolderLock className="w-5 h-5 text-red-500" />
                          Hidden Workspace
                        </h2>
                      </div>
                      <button
                        id="btn-shutdown-vault"
                        onClick={exitVault}
                        className="px-3 py-1.5 text-xs font-bold text-white/80 bg-neutral-900 border border-neutral-805 hover:bg-neutral-800 rounded-full transition-all"
                      >
                        Exit Vault
                      </button>
                    </div>

                    {/* Exclusions Note Ticker */}
                    <div className="p-3 bg-red-950/20 border border-red-900/10 rounded-2xl mb-4 font-mono text-[9.5px] text-red-400 leading-relaxed">
                      💡 <strong>Well-Being Stealth Protection</strong>: No record of active hidden apps will show up in Screen Time, settings, or search registries.
                    </div>

                    {/* Apps Grid */}
                    <div className="flex-1 grid grid-cols-2.5 gap-4 py-2 overflow-y-auto no-scrollbar max-h-[380px]">
                      {hiddenAppsList
                        .filter(app => !app.isHidden || app.id === 'guard') // Guard is always selectable
                        .map(app => (
                          <motion.button
                            key={app.id}
                            id={`launch-app-${app.id}`}
                            onClick={() => setActiveVaultApp(app.id)}
                            className="flex flex-col items-center text-center p-3.5 bg-neutral-950/50 hover:bg-neutral-900/60 transition-all rounded-[24px] border border-neutral-900/40 group active:scale-95 cursor-pointer relative"
                            whileHover={{ y: -3 }}
                          >
                            <div className={`w-11 h-11 ${app.color} rounded-2xl flex items-center justify-center text-xl text-white font-mono font-bold shadow-lg transition-transform group-hover:scale-105`}>
                              {app.icon}
                            </div>
                            <span className="text-[11px] font-bold text-white/90 font-sans mt-2.5 tracking-tight group-hover:text-red-400 truncate w-full">
                              {app.name.split(' ')[0]}
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono mt-0.5 uppercase tracking-widest">
                              {app.category}
                            </span>
                          </motion.button>
                        ))}

                      {/* ADD CUSTOM APP CARD */}
                      <motion.button
                        id="btn-trigger-add-app"
                        onClick={() => setIsAddAppModalOpen(true)}
                        className="flex flex-col items-center text-center p-3.5 bg-neutral-950/20 hover:bg-neutral-900/40 transition-all rounded-[24px] border border-dashed border-neutral-800/85 group active:scale-95 cursor-pointer relative justify-center min-h-[105px]"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-11 h-11 bg-neutral-900 group-hover:bg-neutral-850 rounded-2xl flex items-center justify-center text-xl text-zinc-405 font-bold border border-neutral-800 group-hover:border-zinc-750 transition-colors">
                          <Plus className="w-5 h-5 text-zinc-400 group-hover:text-red-450 transition-colors" />
                        </div>
                        <span className="text-[11px] font-bold text-zinc-400 font-sans mt-2.5 tracking-tight group-hover:text-red-400 transition-colors">
                          Add App
                        </span>
                        <span className="text-[8.5px] text-zinc-600 font-mono mt-0.5 uppercase tracking-widest">
                          Incognito
                        </span>
                      </motion.button>
                    </div>

                    {/* ADD CUSTOM APP FORM MODAL */}
                    <AnimatePresence>
                      {isAddAppModalOpen && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-x-0 top-0 bottom-4 bg-neutral-950/90 z-50 flex items-end justify-center p-4 font-sans"
                        >
                          <motion.div 
                            initial={{ y: 200, scale: 0.95 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 200, scale: 0.95 }}
                            className="bg-zinc-900 w-full rounded-2xl border border-zinc-800 p-5 space-y-4 shadow-2xl overflow-y-auto max-h-[92%]"
                          >
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                              <div>
                                <h3 className="text-sm font-black text-white tracking-tight">Provision Custom Incognito App</h3>
                                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">Offline Sandboxed Node</p>
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  setIsAddAppModalOpen(false);
                                  resetNewAppForm();
                                }}
                                className="p-1.5 rounded-full bg-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-750 transition-colors cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <form onSubmit={handleCreateCustomApp} className="space-y-3.5">
                              {/* Name Input */}
                              <div className="space-y-1 text-left">
                                <label className="block text-[9.5px] font-mono uppercase tracking-widest text-zinc-500 font-bold">App Name</label>
                                <input 
                                  type="text"
                                  required
                                  placeholder="e.g., Instagram, ChatVault, PaySecure"
                                  value={newAppName}
                                  onChange={(e) => setNewAppName(e.target.value)}
                                  className="w-full text-xs bg-neutral-950 border border-zinc-800 p-2.5 rounded-xl text-white outline-none focus:border-red-500/80 transition-colors"
                                />
                              </div>

                              {/* Emoji selection */}
                              <div className="space-y-1 text-left">
                                <label className="block text-[9.5px] font-mono uppercase tracking-widest text-zinc-500 font-bold">App Launcher Emoji</label>
                                <div className="grid grid-cols-6 gap-1.5 p-2 bg-neutral-950/40 rounded-xl border border-zinc-850">
                                  {['📸', '💬', '🦊', '🎮', '🪙', '🎨', '🛍️', '🎵', '🕵️', '🔒', '🔥', '🚀'].map(emoji => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() => setNewAppIcon(emoji)}
                                      className={`text-xl p-1 rounded-lg transition-all cursor-pointer ${newAppIcon === emoji ? 'bg-red-950/60 border border-red-500/40 scale-110 shadow' : 'hover:bg-neutral-900 border border-transparent'}`}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Color classes selection */}
                              <div className="space-y-1 text-left">
                                <label className="block text-[9.5px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Launcher Theme</label>
                                <div className="grid grid-cols-4 gap-1.5 font-sans">
                                  {[
                                    { name: 'Pink', class: 'bg-pink-600' },
                                    { name: 'Emerald', class: 'bg-emerald-600' },
                                    { name: 'Violet', class: 'bg-violet-600' },
                                    { name: 'Indigo', class: 'bg-indigo-650' },
                                    { name: 'Amber', class: 'bg-amber-600' },
                                    { name: 'Crimson', class: 'bg-red-650' },
                                    { name: 'Cyan', class: 'bg-cyan-600' },
                                    { name: 'Slate', class: 'bg-neutral-800' },
                                  ].map(col => (
                                    <button
                                      key={col.class}
                                      type="button"
                                      onClick={() => setNewAppColor(col.class)}
                                      className={`py-1.5 text-[9.5px] font-bold rounded-lg text-white flex items-center justify-center gap-1 transition-all cursor-pointer ${col.class} ${newAppColor === col.class ? 'ring-2 ring-red-500 scale-[1.02] shadow-sm' : 'opacity-80 hover:opacity-100'}`}
                                    >
                                      {newAppColor === col.class && <Check className="w-2.5 h-2.5 text-white" />}
                                      <span>{col.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Category selection */}
                              <div className="space-y-1 text-left">
                                <label className="block text-[9.5px] font-mono uppercase tracking-widest text-zinc-500 font-bold">App Sandbox Template</label>
                                <select
                                  value={newAppCategory}
                                  onChange={(e) => setNewAppCategory(e.target.value)}
                                  className="w-full text-xs bg-neutral-950 border border-zinc-800 p-2.5 rounded-xl text-white outline-none focus:border-red-500/80 transition-colors"
                                >
                                  <option value="Social">Social Feed / Photo-Sharing (e.g., Instagram)</option>
                                  <option value="Chats">Confidential Messaging (e.g., WhatsApp)</option>
                                  <option value="Finance">Private Wallet Ledger (Bank/Crypto)</option>
                                  <option value="Gaming">Arcade Mini Clicker Game</option>
                                  <option value="System">System Utilities</option>
                                </select>
                              </div>

                              {/* Description */}
                              <div className="space-y-1 text-left">
                                <label className="block text-[9.5px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Purpose / Details</label>
                                <input 
                                  type="text"
                                  placeholder="e.g., Private sandboxed feed node."
                                  value={newAppDescription}
                                  onChange={(e) => setNewAppDescription(e.target.value)}
                                  className="w-full text-xs bg-neutral-950 border border-zinc-800 p-2.5 rounded-xl text-white outline-none focus:border-red-500/80 transition-colors"
                                />
                              </div>

                              <button
                                type="submit"
                                className="w-full py-2.5 bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-xs font-black text-white rounded-xl shadow-lg active:scale-[0.98] transition cursor-pointer font-mono"
                              >
                                PROVISION INCOGNITO CLIENT
                              </button>
                            </form>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Safety Footing */}
                    <div className="flex items-center justify-center py-2.5 text-center flex-shrink-0">
                      <p className="text-[9.5px] font-mono text-slate-500 flex items-center gap-1">
                        🔒 Sealed offline node registry
                      </p>
                    </div>

                  </div>
                ) : (
                  // Embedded vault app container
                  <div className="flex-1 flex flex-col h-full bg-slate-950">
                    <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-900 flex-shrink-0">
                      <button
                        id="btn-back-to-vault-folder"
                        onClick={() => setActiveVaultApp(null)}
                        className="flex items-center gap-0.5 text-xs text-red-500 font-bold hover:text-red-400 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 stroke-[3px]" />
                        Apps
                      </button>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        Node Isolation Area
                      </span>
                      <button
                        onClick={exitVault}
                        className="p-1 text-zinc-400 hover:text-red-400 transition-all"
                        title="Instant Lock Vault"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* App viewport switcher */}
                    <div className="flex-1 min-h-0 h-full">
                      {activeVaultApp === 'notes' && <NotesApp />}
                      {activeVaultApp === 'photos' && <PhotosApp />}
                      {activeVaultApp === 'contacts' && <ContactsApp />}
                      {activeVaultApp === 'browser' && <BrowserApp />}
                      {activeVaultApp === 'game' && <SnakeGameApp />}
                      {activeVaultApp === 'guard' && <AppHiderApp onAppsChanged={loadAppsConfig} />}

                      {/* Active viewport of dynamically created custom applications */}
                      {activeVaultApp && !['notes', 'photos', 'contacts', 'browser', 'game', 'guard'].includes(activeVaultApp) && (
                        (() => {
                          const appObj = hiddenAppsList.find(a => a.id === activeVaultApp);
                          return appObj ? (
                            <CustomAddedApp 
                              app={appObj} 
                              onExit={() => setActiveVaultApp(null)} 
                            />
                          ) : null;
                        })()
                      )}
                    </div>
                  </div>
                )}

              </motion.div>
            )}

            {/* 3. CORE CALCULATOR ENVIRONMENT */}
            {!isVaultOpen && !showUnlockAnimation && (
              <motion.div
                key="calc-screen"
                className="absolute inset-0 bg-[#000000] flex flex-col p-4 pt-1 justify-between select-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                
                {/* Standard Segmented Tab Control: Calculator vs Solver */}
                <div className="flex bg-neutral-900/60 p-0.5 border border-neutral-800/40 rounded-full text-xs font-bold ring-offset-black mx-1 mb-2.5 z-10 flex-shrink-0">
                  <button
                    id="tab-mode-standard"
                    onClick={() => setCalcMode('standard')}
                    className={`flex-1 py-1 px-3 text-center rounded-full transition-all ${
                      calcMode === 'standard' ? 'bg-orange-500 text-white font-extrabold shadow-md' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Calculator
                  </button>
                  <button
                    id="tab-mode-equation"
                    onClick={() => setCalcMode('equation')}
                    className={`flex-1 py-1 px-3 text-center rounded-full transition-all flex items-center justify-center gap-1 ${
                      calcMode === 'equation' ? 'bg-orange-500 text-white font-extrabold shadow-md' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-orange-200" />
                    EquationSolver
                  </button>
                </div>

                {calcMode === 'standard' ? (
                  // iOS Layout Calculator Screen
                  <div className="flex-1 flex flex-col justify-end">
                    
                    {/* Display Segment */}
                    <div className="w-full text-right px-2 pb-5 pt-4 space-y-1 mt-auto flex-shrink-0">
                      {/* Interactive Expression History view */}
                      <p id="calc-history-string" className="font-mono text-zinc-500 text-sm tracking-tight overflow-hidden text-ellipsis whitespace-nowrap min-h-5 max-w-[320px] ml-auto">
                        {formula || '0'}
                      </p>
                      {/* Primary Digit Output Block */}
                      <div id="calc-primary-display" className="text-white text-6xl font-light tracking-tight truncate leading-none select-all min-h-[64px]">
                        {display}
                      </div>
                    </div>



                    {/* Digits and Arithmetic Action Grid */}
                    <div id="calc-keys-grid" className="grid grid-cols-4 gap-3 select-none flex-shrink-0 mb-3.5">
                      
                      {/* Top Row Modifiers */}
                      <button id="key-clear" onClick={handleClear} className="w-[64px] h-[64px] rounded-full bg-[#a5a5a5] text-black font-semibold text-xl active:bg-[#d4d4d4] transition-all flex items-center justify-center font-sans">
                        {clearText}
                      </button>
                      <button id="key-neg" onClick={handleToggleSign} className="w-[64px] h-[64px] rounded-full bg-[#a5a5a5] text-black font-semibold text-xl active:bg-[#d4d4d4] transition-all flex items-center justify-center font-sans">
                        +/-
                      </button>
                      <button id="key-percent" onClick={handlePercent} className="w-[64px] h-[64px] rounded-full bg-[#a5a5a5] text-black font-semibold text-xl active:bg-[#d4d4d4] transition-all flex items-center justify-center font-sans">
                        %
                      </button>
                      <button id="key-div" onClick={() => handleOperatorClick('÷')} className={`w-[64px] h-[64px] rounded-full font-semibold text-2xl active:bg-[#fcd34d] transition-all flex items-center justify-center ${nextOperator === '÷' ? 'bg-white text-orange-500 border border-orange-500/30' : 'bg-[#fe9e09] text-white'}`}>
                        ÷
                      </button>

                      {/* Row 2 */}
                      <button id="key-7" onClick={() => handleNumClick('7')} className="w-[64px] h-[64px] rounded-full bg-[#333333] text-white font-bold text-2xl active:bg-[#555555] transition-all flex items-center justify-center font-sans">
                        7
                      </button>
                      <button id="key-8" onClick={() => handleNumClick('8')} className="w-[64px] h-[64px] rounded-full bg-[#333333] text-white font-bold text-2xl active:bg-[#555555] transition-all flex items-center justify-center font-sans">
                        8
                      </button>
                      <button id="key-9" onClick={() => handleNumClick('9')} className="w-[64px] h-[64px] rounded-full bg-[#333333] text-white font-bold text-2xl active:bg-[#555555] transition-all flex items-center justify-center font-sans">
                        9
                      </button>
                      <button id="key-mul" onClick={() => handleOperatorClick('×')} className={`w-[64px] h-[64px] rounded-full font-semibold text-2xl active:bg-[#fcd34d] transition-all flex items-center justify-center ${nextOperator === '×' ? 'bg-white text-orange-500' : 'bg-[#fe9e09] text-white'}`}>
                        ×
                      </button>

                      {/* Row 3 */}
                      <button id="key-4" onClick={() => handleNumClick('4')} className="w-[64px] h-[64px] rounded-full bg-[#333333] text-white font-bold text-2xl active:bg-[#555555] transition-all flex items-center justify-center font-sans">
                        4
                      </button>
                      <button id="key-5" onClick={() => handleNumClick('5')} className="w-[64px] h-[64px] rounded-full bg-[#333333] text-white font-bold text-2xl active:bg-[#555555] transition-all flex items-center justify-center font-sans">
                        5
                      </button>
                      <button id="key-6" onClick={() => handleNumClick('6')} className="w-[64px] h-[64px] rounded-full bg-[#333333] text-white font-bold text-2xl active:bg-[#555555] transition-all flex items-center justify-center font-sans">
                        6
                      </button>
                      <button id="key-sub" onClick={() => handleOperatorClick('-')} className={`w-[64px] h-[64px] rounded-full font-semibold text-2xl active:bg-[#fcd34d] transition-all flex items-center justify-center ${nextOperator === '-' ? 'bg-white text-orange-500 shadow' : 'bg-[#fe9e09] text-white'}`}>
                        -
                      </button>

                      {/* Row 4 */}
                      <button id="key-1" onClick={() => handleNumClick('1')} className="w-[64px] h-[64px] rounded-full bg-[#333333] text-white font-bold text-2xl active:bg-[#555555] transition-all flex items-center justify-center font-sans">
                        1
                      </button>
                      <button id="key-2" onClick={() => handleNumClick('2')} className="w-[64px] h-[64px] rounded-full bg-[#333333] text-white font-bold text-2xl active:bg-[#555555] transition-all flex items-center justify-center font-sans">
                        2
                      </button>
                      <button id="key-3" onClick={() => handleNumClick('3')} className="w-[64px] h-[64px] rounded-full bg-[#333333] text-white font-bold text-2xl active:bg-[#555555] transition-all flex items-center justify-center font-sans">
                        3
                      </button>
                      <button id="key-add" onClick={() => handleOperatorClick('+')} className={`w-[64px] h-[64px] rounded-full font-semibold text-2xl active:bg-[#fcd34d] transition-all flex items-center justify-center ${nextOperator === '+' ? 'bg-white text-orange-500' : 'bg-[#fe9e09] text-white'}`}>
                        +
                      </button>

                      {/* Row 5 (Big 0) */}
                      <button id="key-0" onClick={() => handleNumClick('0')} className="col-span-2 w-full h-[64px] rounded-full bg-[#333333] text-white font-bold text-2xl active:bg-[#555555] transition-all flex items-center pl-7 font-sans text-left">
                        0
                      </button>
                      <button id="key-dec" onClick={handleDecClick} className="w-[64px] h-[64px] rounded-full bg-[#333333] text-white font-bold text-2xl active:bg-[#555555] transition-all flex items-center justify-center font-sans">
                        .
                      </button>
                      <button id="key-eval" onClick={calculateResult} className="w-[64px] h-[64px] rounded-full bg-[#fe9e09] text-white font-bold text-2xl active:bg-[#fcd34d] transition-color flex items-center justify-center font-sans">
                        =
                      </button>

                    </div>
                  </div>
                ) : (
                  // Scientific Linear Equation Solver pane
                  <div className="flex-1 min-h-0 bg-neutral-900 border border-neutral-800 rounded-[32px] overflow-hidden">
                    <EquationSolver onBack={() => setCalcMode('standard')} />
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
