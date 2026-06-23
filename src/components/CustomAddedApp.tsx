import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageSquare, 
  Send, 
  Plus, 
  User, 
  ArrowLeft, 
  ShieldAlert, 
  Activity, 
  TrendingUp, 
  Coins, 
  Flame,
  CheckCircle,
  HelpCircle,
  X,
  CreditCard,
  PlusCircle,
  Check
} from 'lucide-react';
import { HiddenApp } from '../types';

interface CustomAddedAppProps {
  app: HiddenApp;
  onExit: () => void;
}

// Default Unsplash placeholder structures to prevent broken links
const MOCK_PICS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60'
];

export default function CustomAddedApp({ app, onExit }: CustomAddedAppProps) {
  // Common states
  const [activeTab, setActiveTab] = useState('home');

  // ---------- 1. SOCIAL TEMPLATE STATES ----------
  const [socialFeed, setSocialFeed] = useState<any[]>([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostImage, setNewPostImage] = useState(MOCK_PICS[0]);
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});

  // ---------- 2. CHATS TEMPLATE STATES ----------
  const [chats, setChats] = useState<any[]>([
    {
      id: 'agent_x',
      name: 'Agent Blackwood',
      avatar: '🎩',
      online: true,
      messages: [
        { sender: 'them', text: 'Channel secure. Status report?', time: '10:42 AM' },
        { sender: 'me', text: 'Operational. No leak vectors detected.', time: '10:43 AM' },
        { sender: 'them', text: 'Outstanding. Maintain radio silence.', time: '10:44 AM' }
      ]
    },
    {
      id: 'ghost_node',
      name: 'Ghost Node Core',
      avatar: '🧬',
      online: false,
      messages: [
        { sender: 'them', text: 'Auto-sync initialized with client hash.', time: '09:12 AM' }
      ]
    }
  ]);
  const [activeChatId, setActiveChatId] = useState('agent_x');
  const [chatMessageText, setChatMessageText] = useState('');

  // ---------- 3. FINANCE TEMPLATE STATES ----------
  const [balance, setBalance] = useState(132450.00);
  const [transactions, setTransactions] = useState<any[]>([
    { id: 'tx_1', title: 'Secure Offshore Dividend', amount: 8400.00, type: 'inflow', date: 'June 22' },
    { id: 'tx_2', title: 'Unlisted Hardware Server Node', amount: -1250.00, type: 'outflow', date: 'June 18' },
    { id: 'tx_3', title: 'Incognito Travel Provision', amount: -600.00, type: 'outflow', date: 'June 14' }
  ]);
  const [showAddTx, setShowAddTx] = useState(false);
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'inflow' | 'outflow'>('outflow');

  // ---------- 4. GAMING TEMPLATE STATES ----------
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Determine subsegment type based on user config
  // Standard categories: system, media, contacts, browser, entertainment, security, plus custom ones!
  const determinedType = React.useMemo(() => {
    const normName = app.name.toLowerCase();
    const cat = app.category.toLowerCase();
    
    if (normName.includes('insta') || normName.includes('gram') || normName.includes('face') || normName.includes('social') || cat.includes('media') || cat.includes('social')) {
      return 'social';
    }
    if (normName.includes('chat') || normName.includes('whatsapp') || normName.includes('tele') || normName.includes('mess') || normName.includes('signal') || cat.includes('chat') || cat.includes('contact')) {
      return 'chats';
    }
    if (normName.includes('pay') || normName.includes('bank') || normName.includes('wallet') || normName.includes('coin') || normName.includes('trade') || cat.includes('finance') || cat.includes('budget')) {
      return 'finance';
    }
    if (normName.includes('game') || normName.includes('play') || normName.includes('arcade') || normName.includes('viper') || cat.includes('entertainment') || cat.includes('game')) {
      return 'gaming';
    }
    // Default fallback to social feed because it is extremely beautiful and dynamic
    return 'social';
  }, [app]);

  // Load custom content from local storage or set defaults
  useEffect(() => {
    // 1. Social Init
    const savedFeed = localStorage.getItem(`custom_app_feed_${app.id}`);
    if (savedFeed) {
      setSocialFeed(JSON.parse(savedFeed));
    } else {
      const initialFeed = [
        {
          id: 'post_1',
          author: 'Alex Carter',
          avatar: '🕶️',
          image: MOCK_PICS[0],
          caption: 'Neon horizons call once again 🌌 #IncognitoLiving',
          likes: 52,
          hasLiked: false,
          comments: [
            { id: 'c1', author: 'CyberP', text: 'Beautiful aesthetic!' },
            { id: 'c2', author: 'Nitefall', text: 'Indeed, off-grid.' }
          ],
          timestamp: '2 hours ago'
        },
        {
          id: 'post_2',
          author: 'Sarah Jenkins',
          avatar: '🌸',
          image: MOCK_PICS[3],
          caption: 'Minimalist desk views. Perfect setup for sandboxed compilation. 💻🚀',
          likes: 124,
          hasLiked: true,
          comments: [
            { id: 'c3', author: 'CodeSlinger', text: 'Is that a mechanical layout?' }
          ],
          timestamp: '5 hours ago'
        }
      ];
      setSocialFeed(initialFeed);
      localStorage.setItem(`custom_app_feed_${app.id}`, JSON.stringify(initialFeed));
    }

    // 2. Finance Init
    const savedFinances = localStorage.getItem(`custom_app_fin_${app.id}`);
    if (savedFinances) {
      const data = JSON.parse(savedFinances);
      setBalance(data.balance);
      setTransactions(data.transactions);
    }

    // 3. Game Init
    const savedHi = localStorage.getItem(`custom_app_game_hi_${app.id}`);
    if (savedHi) setHighScore(parseInt(savedHi));
  }, [app.id]);

  // ---------- SOCIAL CONTROLS ----------
  const saveSocialFeed = (feed: any[]) => {
    setSocialFeed(feed);
    localStorage.setItem(`custom_app_feed_${app.id}`, JSON.stringify(feed));
  };

  const handleLike = (postId: string) => {
    const updated = socialFeed.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          hasLiked: !post.hasLiked,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });
    saveSocialFeed(updated);
  };

  const handleAddComment = (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    const updated = socialFeed.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { id: 'c_user_' + Date.now(), author: 'You (Vault)', text }]
        };
      }
      return post;
    });
    saveSocialFeed(updated);
    setNewCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostCaption.trim()) return;

    const randPic = MOCK_PICS[Math.floor(Math.random() * MOCK_PICS.length)];
    const newPost = {
      id: 'post_user_' + Date.now(),
      author: 'You (Sandbox)',
      avatar: '👻',
      image: newPostImage || randPic,
      caption: newPostCaption,
      likes: 0,
      hasLiked: false,
      comments: [],
      timestamp: 'Just now'
    };

    const updated = [newPost, ...socialFeed];
    saveSocialFeed(updated);
    setNewPostCaption('');
    setShowAddPost(false);
  };

  // ---------- CHATS CONTROLS ----------
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;

    const currentActive = chats.find(c => c.id === activeChatId);
    if (!currentActive) return;

    const myMsg = { sender: 'me', text: chatMessageText, time: 'Just now' };
    const updatedMsgs = [...currentActive.messages, myMsg];

    // Auto response list
    const answers = [
      "Secured response incoming. Status unchanged.",
      "Roger that. Standing down until 03:00 hours.",
      "Analyzing. Data matches predicted hashes.",
      "The vault remains sealed on our side. Understood.",
      "Please re-verify parameters before execution.",
      "Affirmative. Echo server operating normally."
    ];
    const triggerReply = () => {
      setTimeout(() => {
        const reply = {
          sender: 'them',
          text: answers[Math.floor(Math.random() * answers.length)],
          time: 'Just now'
        };
        const replyUpdated = chats.map(c => {
          if (c.id === activeChatId) {
            return { ...c, messages: [...c.messages, myMsg, reply] };
          }
          return c;
        });
        setChats(replyUpdated);
      }, 1000);
    };

    const updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: updatedMsgs };
      }
      return c;
    });

    setChats(updatedChats);
    setChatMessageText('');
    triggerReply();
  };

  // ---------- FINANCE CONTROLS ----------
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(txAmount);
    if (!txTitle.trim() || isNaN(amountNum)) return;

    const finalAmount = txType === 'outflow' ? -Math.abs(amountNum) : Math.abs(amountNum);
    const newTx = {
      id: 'tx_usr_' + Date.now(),
      title: txTitle,
      amount: finalAmount,
      type: txType,
      date: 'Today'
    };

    const updatedTxs = [newTx, ...transactions];
    const updatedBal = balance + finalAmount;

    setTransactions(updatedTxs);
    setBalance(updatedBal);
    setShowAddTx(false);
    setTxTitle('');
    setTxAmount('');

    localStorage.setItem(`custom_app_fin_${app.id}`, JSON.stringify({
      balance: updatedBal,
      transactions: updatedTxs
    }));
  };

  // ---------- GAME CONTROLS ----------
  const handleGameTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Increment score
    const bonus = multiplier;
    const newScore = score + bonus;
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem(`custom_app_game_hi_${app.id}`, String(newScore));
    }

    // Spawn subtle particle clicks
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pId = Date.now();
    setParticles(prev => [...prev, { id: pId, x, y }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== pId));
    }, 1000);

    // Multiplier increment mechanics
    if (newScore > 0 && newScore % 15 === 0) {
      setMultiplier(m => m + 1);
    }
  };

  const resetGame = () => {
    setScore(0);
    setMultiplier(1);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-slate-100 font-sans">
      {/* Dynamic Header */}
      <div className="px-4 py-3 bg-neutral-900 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm text-white ${app.color}`}>
            {app.icon}
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white">{app.name}</h1>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Custom Vault Module</p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="text-xs font-semibold px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 hover:text-white text-zinc-400 transition"
        >
          Exit App
        </button>
      </div>

      {/* RENDER DETERMINED MODULE */}
      <div className="flex-1 overflow-y-auto relative min-h-0">
        
        {/* ==================== A. SOCIAL MEDIA FEED (INSTAGRAM/FACEBOOK STYLE) ==================== */}
        {determinedType === 'social' && (
          <div className="space-y-4 pb-20">
            {/* Horizontal Stories Tray */}
            <div className="px-3 py-2 bg-neutral-950 border-b border-zinc-900 flex gap-3 overflow-x-auto select-none no-scrollbar flex-shrink-0">
              <div className="flex flex-col items-center flex-shrink-0 relative">
                <div 
                  onClick={() => setShowAddPost(true)}
                  className="w-12 h-12 rounded-full border-2 border-red-500/80 p-0.5 flex items-center justify-center bg-zinc-900 cursor-pointer text-base"
                >
                  ➕
                </div>
                <span className="text-[9px] text-zinc-400 mt-1">Add Post</span>
              </div>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-12 h-12 rounded-full border-2 border-orange-500 p-0.5 flex items-center justify-center bg-zinc-900 text-base">
                  🦊
                </div>
                <span className="text-[9px] text-zinc-400 mt-1">pixel_fox</span>
              </div>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-12 h-12 rounded-full border-2 border-pink-500 p-0.5 flex items-center justify-center bg-zinc-900 text-base">
                  🍔
                </div>
                <span className="text-[9px] text-zinc-400 mt-1">gourmet_map</span>
              </div>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500 p-0.5 flex items-center justify-center bg-zinc-900 text-base">
                  🌊
                </div>
                <span className="text-[9px] text-zinc-400 mt-1">surf_glide</span>
              </div>
            </div>

            {/* Stories Modal Addition UI */}
            <AnimatePresence>
              {showAddPost && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="mx-3.5 p-4 bg-neutral-900 border border-zinc-800 rounded-2xl relative"
                >
                  <button 
                    onClick={() => setShowAddPost(false)}
                    className="absolute top-2 right-2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="text-xs font-bold text-white mb-2 ml-1 flex items-center gap-1.5 font-mono">
                    <Plus className="w-3.5 h-3.5 text-red-500" /> PROVISION SECURE POST
                  </h3>
                  <form onSubmit={handleCreatePost} className="space-y-3">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-zinc-500 font-bold mb-1 col-span-2">Caption Text</label>
                      <textarea
                        required
                        placeholder="Write dynamic caption details..."
                        value={newPostCaption}
                        onChange={(e) => setNewPostCaption(e.target.value)}
                        className="w-full text-xs bg-neutral-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Select Theme Visual</label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {MOCK_PICS.map((url, idx) => (
                          <div 
                            key={idx}
                            onClick={() => setNewPostImage(url)}
                            className={`h-10 rounded-lg cursor-pointer border overflow-hidden transition-all ${newPostImage === url ? 'border-red-500 scale-105 shadow' : 'border-zinc-800 opacity-60'}`}
                          >
                            <img src={url} alt="option" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-red-600 to-pink-600 text-[11px] font-bold text-white rounded-xl active:scale-95 transition cursor-pointer"
                    >
                      Publish to Isolated Gallery
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Posts Stream */}
            <div className="space-y-4 px-3">
              {socialFeed.map(post => (
                <div key={post.id} className="bg-neutral-900 border border-zinc-900 rounded-2xl overflow-hidden shadow-sm">
                  {/* Author Header */}
                  <div className="p-3 flex items-center justify-between border-b border-zinc-900 bg-neutral-900/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-neutral-950 flex items-center justify-center text-sm border border-zinc-800">
                        {post.avatar}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white leading-none">{post.author}</h4>
                        <span className="text-[8.5px] text-zinc-500 leading-none">{post.timestamp}</span>
                      </div>
                    </div>
                    <span className="text-[8.5px] text-emerald-500/80 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/10 font-mono">
                      SECURED NODE
                    </span>
                  </div>

                  {/* Post Image */}
                  <div className="aspect-square bg-zinc-950 border-b border-zinc-950 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src={post.image} 
                      alt="Secret feed image" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Operational Controls */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-90 ${post.hasLiked ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-200'}`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                        <span>{post.likes}</span>
                      </button>
                      <div className="flex items-center gap-1 text-xs text-zinc-400 font-semibold select-none ml-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length}</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      <span className="font-extrabold text-white mr-1 text-xs">{post.author.toLowerCase()}</span>
                      {post.caption}
                    </p>

                    {/* Comments Loop */}
                    {post.comments.length > 0 && (
                      <div className="pt-2 border-t border-zinc-900/60 space-y-1 bg-neutral-950/20 p-2 rounded-xl">
                        {post.comments.map((c: any) => (
                          <p key={c.id} className="text-[10.5px] leading-relaxed text-zinc-400">
                            <strong className="text-zinc-200 mr-1.5">{c.author}:</strong>
                            {c.text}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Comment Form */}
                    <div className="flex items-center gap-1.5 pt-1.5">
                      <input 
                        type="text"
                        placeholder="Add secret reply..."
                        value={newCommentText[post.id] || ''}
                        onChange={(e) => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        className="flex-1 text-[11px] bg-neutral-950 border border-zinc-800/80 rounded-xl px-3 py-1.5 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
                      />
                      <button 
                        onClick={() => handleAddComment(post.id)}
                        className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-red-500 transition-colors cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== B. CHATS & CONFIDENTIAL LOGS (WHATSAPP STYLE) ==================== */}
        {determinedType === 'chats' && (
          <div className="h-full flex flex-col bg-neutral-950">
            {/* Conversation list & Chat view splitter */}
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* Chat Core View (If Selected) */}
              <div className="flex-1 flex flex-col min-h-0 bg-neutral-900/40">
                {/* Peer Bar Info */}
                <div className="px-3.5 py-2 bg-neutral-900 border-b border-zinc-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center text-base border border-zinc-800 relative">
                      {chats.find(c => c.id === activeChatId)?.avatar || '👤'}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-neutral-900"></span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-none">
                        {chats.find(c => c.id === activeChatId)?.name || 'Direct Channel'}
                      </h4>
                      <p className="text-[8.5px] text-emerald-500/90 font-mono tracking-wider mt-0.5 uppercase">LINK ACTIVE // ENCRYPTED</p>
                    </div>
                  </div>
                  
                  {/* Dropdown to change chats */}
                  <select 
                    value={activeChatId} 
                    onChange={(e) => setActiveChatId(e.target.value)}
                    className="text-[9.5px] bg-neutral-950 text-zinc-400 border border-zinc-800 p-1 rounded font-mono focus:outline-none"
                  >
                    {chats.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Messages stream */}
                <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 flex flex-col">
                  {chats.find(c => c.id === activeChatId)?.messages.map((m: any, i: number) => {
                    const isSelf = m.sender === 'me';
                    return (
                      <div 
                        key={i} 
                        className={`max-w-[80%] px-3 py-2 rounded-2xl flex flex-col gap-0.5 text-xs text-sans font-medium line-relaxed shadow ${
                          isSelf 
                            ? 'bg-red-900/40 border border-red-900/10 text-white self-end rounded-tr-none' 
                            : 'bg-zinc-800 border border-zinc-750 text-zinc-200 self-start rounded-tl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{m.text}</p>
                        <span className="text-[8px] text-zinc-500 font-mono text-right mt-0.5 leading-none">{m.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Secure input block */}
                <form onSubmit={handleSendMessage} className="p-3 bg-neutral-900/90 border-t border-zinc-800.5 flex gap-2">
                  <input
                    type="text"
                    placeholder="Transmit secured message..."
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    className="flex-1 text-xs bg-neutral-950 border border-zinc-800/80 rounded-xl px-3 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
                  />
                  <button 
                    type="submit" 
                    className="p-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl active:scale-95 transition-all text-xs cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ==================== C. PRIVATE BALANCE LEDGER (FINANCE STYLE) ==================== */}
        {determinedType === 'finance' && (
          <div className="p-3.5 space-y-4 pb-16">
            {/* Elegant balance dashboard */}
            <div className="bg-gradient-to-br from-zinc-900 to-neutral-950 border border-zinc-800/60 p-5 rounded-2xl relative shadow overflow-hidden">
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-900/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10 space-y-1.5 flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-800/30 flex items-center justify-center text-emerald-400 mb-1 leading-none">
                  <CreditCard className="w-4.5 h-4.5" />
                </div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Unlinked Ledger Balance</span>
                <span className="text-2xl font-light font-sans tracking-tight text-white block mt-0.5">
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[8.5px] font-mono text-emerald-500 bg-emerald-950/40 border border-emerald-700/20 px-2 py-0.5 rounded-full inline-block mt-1">
                  ✓ SECURE PROTOCOL ACTIVE
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <button 
              onClick={() => setShowAddTx(!showAddTx)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-zinc-800 text-xs text-zinc-300 bg-neutral-950/20 active:bg-neutral-950/50 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Log Offline Transaction Record</span>
            </button>

            {/* Account ledger transaction list */}
            <AnimatePresence>
              {showAddTx && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-neutral-900 border border-zinc-800/80 rounded-2xl p-4 overflow-hidden"
                >
                  <h3 className="text-xs font-bold text-white mb-3 ml-0.5 uppercase tracking-wide font-mono">Provision Ledger Entry</h3>
                  <form onSubmit={handleAddTransaction} className="space-y-3 font-sans">
                    <div>
                      <label className="block text-[9.5px] text-zinc-500 font-bold mb-1 col-span-2">TRANSACTION HEADER</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Server Allocation Fees"
                        value={txTitle}
                        onChange={(e) => setTxTitle(e.target.value)}
                        className="w-full text-xs bg-neutral-950 border border-zinc-850 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9.5px] text-zinc-500 font-bold mb-1">AMOUNT ($)</label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={txAmount}
                          onChange={(e) => setTxAmount(e.target.value)}
                          className="w-full text-xs bg-neutral-950 border border-zinc-850 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-zinc-500 font-bold mb-1">RECORD TYPE</label>
                        <div className="grid grid-cols-2 gap-1">
                          <button
                            type="button"
                            onClick={() => setTxType('inflow')}
                            className={`py-1.5 text-[9.5px] font-bold rounded-lg ${txType === 'inflow' ? 'bg-emerald-950 border border-emerald-500 text-emerald-400' : 'bg-neutral-950 border border-zinc-850 text-zinc-400'}`}
                          >
                            Inflow
                          </button>
                          <button
                            type="button"
                            onClick={() => setTxType('outflow')}
                            className={`py-1.5 text-[9.5px] font-bold rounded-lg ${txType === 'outflow' ? 'bg-red-950 border border-red-500 text-red-500' : 'bg-neutral-950 border border-zinc-850 text-zinc-400'}`}
                          >
                            Outflow
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-[11px] font-bold text-white rounded-xl active:scale-95 transition-all cursor-pointer font-mono"
                    >
                      COMMIT RECORD TO ARCHIVE
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transactions stream */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-bold mb-1.5 flex items-center justify-between">
                <span>Recent Secured Audits</span>
                <span>List total: {transactions.length}</span>
              </h4>
              {transactions.map(tx => (
                <div key={tx.id} className="p-3 bg-neutral-900 border border-zinc-900 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white pr-2 leading-tight">{tx.title}</p>
                    <span className="text-[8.5px] text-zinc-500 font-mono tracking-wider uppercase leading-none">{tx.date}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold col-shrink-0 ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== D. RETRO CASUAL ARCADE CLICKER (GAMING STYLE) ==================== */}
        {determinedType === 'gaming' && (
          <div className="p-4 space-y-4 font-sans text-center flex flex-col justify-center min-h-[440px]">
            <div className="space-y-1">
              <p className="text-[9.5px] font-mono uppercase tracking-widest text-zinc-400">Sandbox Mini Arcade</p>
              <h2 className="text-xl font-black text-rose-500 select-none flex items-center justify-center gap-1.5">
                <Coins className="w-5 h-5 text-yellow-500 animate-bounce" /> CORE CLICKER
              </h2>
            </div>

            {/* Score HUD */}
            <div className="grid grid-cols-2 gap-2 text-center bg-neutral-900 rounded-2xl border border-zinc-800/85 p-3">
              <div>
                <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none">SCORE</p>
                <span className="text-lg font-bold text-white block mt-1">{score}</span>
              </div>
              <div>
                <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none">MULTIPLIER</p>
                <div className="text-lg font-bold text-yellow-400 mt-1 flex items-center justify-center gap-0.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>x{multiplier}</span>
                </div>
              </div>
            </div>

            {/* Interactive Stage */}
            <div className="relative flex justify-center py-5">
              <button
                onClick={handleGameTap}
                className="w-28 h-28 rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-yellow-500 text-white font-extrabold text-2xl shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center relative select-none cursor-pointer border-4 border-neutral-900 outline-none"
              >
                <span>🔥</span>
                {/* Floating particle animations */}
                <AnimatePresence>
                  {particles.map(p => (
                    <motion.span 
                      key={p.id}
                      initial={{ opacity: 1, y: 0, scale: 0.8 }}
                      animate={{ opacity: 0, y: -45, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      className="absolute font-mono text-yellow-300 text-xs font-bold pointer-events-none select-none drop-shadow"
                      style={{ left: p.x, top: p.y - 40 }}
                    >
                      +{multiplier}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </button>
            </div>

            {/* Reset / Achievements */}
            <div className="space-y-2 max-w-[280px] mx-auto">
              <div className="bg-neutral-950 p-2.5 rounded-xl border border-zinc-900 flex items-center justify-between text-left text-[10px] leading-relaxed">
                <div>
                  <span className="text-zinc-500 uppercase font-mono tracking-widest block leading-none">High Score</span>
                  <span className="text-sm font-bold text-zinc-100 block mt-1">{highScore} pts</span>
                </div>
                <button
                  onClick={resetGame}
                  className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded"
                >
                  Reset Score
                </button>
              </div>

              <div className="text-[9px] text-zinc-500 font-mono text-left bg-neutral-900/40 p-2 border border-zinc-900/60 rounded-xl leading-relaxed">
                🎯 <strong>Rulebook</strong>: Every 15 click increments raise your global multiplier multiplier metric by +1. Complete level challenges to verify node security.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
