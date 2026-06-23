import React, { useState } from 'react';
import { Globe, Search, ArrowLeft, ArrowRight, RefreshCw, ShieldAlert, Heart } from 'lucide-react';

export default function BrowserApp() {
  const [url, setUrl] = useState('https://ghost.crawl.onion');
  const [activeUrl, setActiveUrl] = useState('https://ghost.crawl.onion');
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<string[]>(['https://ghost.crawl.onion']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Preset fake hidden web resources to explore
  const hiddenOnionPages: Record<string, { title: string, subtitle: string, body: string, links?: string[] }> = {
    'https://ghost.crawl.onion': {
      title: '👻 Ghost Portal | Decentralized Secure Directory',
      subtitle: 'The private landing nexus for onion-routing proxies.',
      body: 'Welcome to Ghost Portal, a sandboxed incognito browser environment. In this space, all browsing, searches, and cookies are isolated and strictly cleared upon closing the calculator wrapper. No ISP caching, no DNS leaks.',
      links: [
        'https://classified.leaks.onion',
        'https://quantum-net.intel.onion',
        'https://alien-archives.x.onion'
      ]
    },
    'https://classified.leaks.onion': {
      title: '📂 Classified leaks & Intel repository',
      subtitle: 'Secure drop point for international agencies whistleblower files.',
      body: 'REDACTED - File #29388 "Apollo-18 Lunar Debris analysis": The physical logs retrieve chemical alloys matching no known periodic classifications on earth. Re-indexed to Sector 4. Warning: External intercept protocols are active.',
      links: ['https://ghost.crawl.onion']
    },
    'https://quantum-net.intel.onion': {
      title: '⚛️ Quantum Computing Net',
      subtitle: 'Simulating multi-node prime factorization algorithms.',
      body: 'The cryptographic barrier to Bitcoin and general public-key infrastructure (RSA-2048) is closing. Node 18 has achieved 4800 stable logical qubits. Decryption tests are authorized for block height 928341 only.',
      links: ['https://classified.leaks.onion', 'https://ghost.crawl.onion']
    },
    'https://alien-archives.x.onion': {
      title: '🛰️ Extraterrestrial Telemetry Logs',
      subtitle: 'Decoded signal packets from Kepler-186f constellation.',
      body: 'Signal format matches standard mathematical Fibonacci pattern. Packets represent three-dimensional raster renders of a heavy-density gas atmosphere. Deep Space Network is continuing real-time recording.',
      links: ['https://ghost.crawl.onion']
    }
  };

  const currentResult = hiddenOnionPages[activeUrl];

  const handleGoUrl = (targetUrl: string) => {
    let cleanUrl = targetUrl;
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    setUrl(cleanUrl);
    setActiveUrl(cleanUrl);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(cleanUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Simulate search
    const cleanSearchQuery = searchQuery.trim().toLowerCase();
    const mockUrl = `https://decypher-search.com/q?=${encodeURIComponent(cleanSearchQuery)}`;
    
    setUrl(mockUrl);
    setActiveUrl(mockUrl);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(mockUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSearchQuery('');
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const prevUrl = history[historyIndex - 1];
      setUrl(prevUrl);
      setActiveUrl(prevUrl);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextUrl = history[historyIndex + 1];
      setUrl(nextUrl);
      setActiveUrl(nextUrl);
    }
  };

  // Generate dynamic search output based on queries
  const getSearchContent = (urlQuery: string) => {
    const searchTerms = urlQuery.split('q?=')[1] || '';
    const decoded = decodeURIComponent(searchTerms).replace(/\+/g, ' ');

    let heading = `Decypher Search Results for: "${decoded}"`;
    let responseText = `Our deep indexing sandbox crawls 840,000 decentralized nodes. We found various private documents matching "${decoded}".`;
    let items = [
      { t: `Secure Document 482B`, b: `Cryptographic keys matched "${decoded}". File contains encrypted coordinates.` },
      { t: `Underground Net Thread`, b: `Discussion on "${decoded}" protocol updates and offline mesh network setups.` },
      { t: `Spotlight Exclusion Registry`, b: `No records of "${decoded}" are reported in global central search engines due to zero tracking hashes.` }
    ];

    if (decoded.includes('alien') || decoded.includes('ufo') || decoded.includes('roswell')) {
      heading = `🛸 Subject: Anomalous Telemetry`;
      responseText = `Classified signal trackers have flagged multi-spectral telemetry vectors matching Roswell coordinates. Files retrieved represent real encrypted military transcripts.`;
      items = [
        { t: `Project Blue Book Supplement`, b: `Details on uncatalogued electromagnetic pulses recorded at 14,000m altitude.` },
        { t: `Anomalous Meta-Materials`, b: `Scanning results of isotopic-engineered alloys. Zero carbon impurities noted.` }
      ];
    } else if (decoded.includes('cryptoGrid') || decoded.includes('bitcoin') || decoded.includes('coin') || decoded.includes('money')) {
      heading = `₿ Crypto Ledger Hub`;
      responseText = `Secure block monitors tracking multi-sig transactions. Direct ledger synchronization is active.`;
      items = [
        { t: `Vault Balance Node`, b: `984 BTC holds are routed to cold custody storage multi-sig #10293.` },
        { t: `Decoded Transaction Block`, b: `Anonymized block transfers flagged for quantum key exchange trial.` }
      ];
    } else if (decoded.includes('secret') || decoded.includes('agent') || decoded.includes('fbi') || decoded.includes('cia')) {
      heading = `👁️ Intelligence Directory Override`;
      responseText = `Proxy logs show several centralized intelligence servers referencing this node. Digital tracking bypassed successfully.`;
      items = [
        { t: `Spotlight Firewall bypass`, b: `Secure sandbox isolation prevents external device fingerprinting.` },
        { t: `Screen Time Spoof`, b: `Reported screen time stats show 0 minutes (Exempt background package).` }
      ];
    }

    return (
      <div className="space-y-4 font-sans text-xs">
        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-emerald-400 font-bold font-mono">
          {heading}
        </div>
        <p className="text-zinc-400 leading-relaxed font-sans">{responseText}</p>

        <div className="space-y-2 pt-2">
          {items.map((item, idx) => (
            <div key={idx} className="bg-zinc-900 hover:bg-zinc-850 p-2.5 rounded-lg border border-zinc-800 transition-colors">
              <h4 className="font-bold text-zinc-200 mb-1">{item.t}</h4>
              <p className="text-[10px] text-zinc-500 leading-relaxed">{item.b}</p>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => handleGoUrl('https://ghost.crawl.onion')}
          className="text-[10px] text-zinc-400 bg-zinc-900 hover:bg-zinc-850 px-3 py-1.5 rounded border border-zinc-800 font-semibold"
        >
          ← Return to Ghost Directory
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 font-sans select-none">
      {/* App Header (Omnibox address bar) */}
      <div className="p-2 border-b border-zinc-850 bg-zinc-900 space-y-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={historyIndex === 0}
            className={`p-1 rounded ${historyIndex > 0 ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600'}`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          {/* Forward Button */}
          <button
            onClick={handleForward}
            disabled={historyIndex === history.length - 1}
            className={`p-1 rounded ${historyIndex < history.length - 1 ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600'}`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Actual Address Bar */}
          <div className="flex-1 flex items-center bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800 text-xs gap-1.5 overflow-hidden">
            <span className="text-emerald-500 text-[10px] bg-emerald-950 px-1 py-0.5 rounded font-mono font-bold tracking-widest uppercase">SECURE</span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGoUrl(url)}
              className="w-full bg-transparent border-none text-zinc-300 font-mono focus:outline-none truncate text-xs"
            />
          </div>

          <button onClick={() => handleGoUrl(activeUrl)} className="p-1 text-zinc-400 hover:text-white rounded">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search Header */}
        <form onSubmit={handleSearch} className="flex gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3 text-zinc-500 absolute left-2 top-2.5" />
            <input
              type="text"
              placeholder="Search decoy-crawler indices or terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 rounded-lg pl-7 pr-3 py-1.5 text-[10.5px] border border-zinc-850 focus:outline-none focus:border-zinc-700 text-zinc-300 placeholder-zinc-650"
            />
          </div>
          <button
            type="submit"
            className="px-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10.5px] font-bold text-zinc-300"
          >
            Search
          </button>
        </form>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 overflow-y-auto p-4 bg-zinc-950">
        {activeUrl.includes('decypher-search.com') ? (
          getSearchContent(activeUrl)
        ) : currentResult ? (
          <div className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-zinc-100">{currentResult.title}</h2>
              <p className="text-[10px] text-emerald-500 font-mono">{currentResult.subtitle}</p>
            </div>
            
            <p className="text-zinc-400 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-850 font-mono whitespace-pre-wrap">
              {currentResult.body}
            </p>

            {currentResult.links && currentResult.links.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Verified Node Endpoints:</h4>
                <div className="flex flex-col gap-1.5">
                  {currentResult.links.map((link) => (
                    <button
                      key={link}
                      onClick={() => handleGoUrl(link)}
                      className="text-left text-[11px] text-sky-400 hover:underline hover:text-sky-300 font-mono truncate"
                    >
                      🔗 {link}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4 font-sans space-y-4">
            <ShieldAlert className="w-12 h-12 stroke-1 text-red-500" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-red-400">DNS Resolution Intercepted</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                No direct internet DNS resolving found for <code className="text-white font-mono bg-zinc-900 border border-zinc-850 px-1 py-0.5 rounded text-[10px]">{activeUrl}</code>. Secure isolation mode is engaged.
              </p>
            </div>
            <button
              onClick={() => handleGoUrl('https://ghost.crawl.onion')}
              className="text-[10.5px] bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 font-bold"
            >
              Back to Ghost Directory
            </button>
          </div>
        )}
      </div>

      {/* Browser Footer */}
      <div className="px-4 py-2 border-t border-zinc-900 bg-zinc-950 flex justify-between items-center text-[10px] text-zinc-650 flex-shrink-0 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          TOR Sandbox Mode Active
        </span>
        <span>Isolated Session Node #4092b</span>
      </div>
    </div>
  );
}
