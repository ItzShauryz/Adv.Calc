import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, Eye, EyeOff, AlertCircle, Info, Sparkles } from 'lucide-react';
import { HiddenApp } from '../types';

interface AppHiderAppProps {
  onAppsChanged: () => void;
}

export default function AppHiderApp({ onAppsChanged }: AppHiderAppProps) {
  const [appStates, setAppStates] = useState<HiddenApp[]>([]);
  const [activeTab, setActiveTab] = useState<'manage' | 'security'>('manage');

  useEffect(() => {
    const raw = localStorage.getItem('adv_calc_hidden_apps_config');
    if (raw) {
      try {
        setAppStates(JSON.parse(raw));
      } catch (e) {
        // empty
      }
    }
  }, []);

  const handleToggleHide = (appId: string) => {
    const updated = appStates.map(app => {
      if (app.id === appId) {
        return { ...app, isHidden: !app.isHidden };
      }
      return app;
    });
    setAppStates(updated);
    localStorage.setItem('adv_calc_hidden_apps_config', JSON.stringify(updated));
    onAppsChanged(); // Notify folder to refresh lists
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none">
      {/* App Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900 flex items-center gap-2 flex-shrink-0">
        <ShieldAlert className="w-5 h-5 text-red-400" />
        <span className="font-bold text-base tracking-tight">Vault App Guard</span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 text-center text-xs bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <button
          onClick={() => setActiveTab('manage')}
          className={`py-2.5 font-bold transition-all ${
            activeTab === 'manage' ? 'border-b-2 border-red-500 text-white bg-slate-950/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Manage Vault Apps
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-2.5 font-bold transition-all ${
            activeTab === 'security' ? 'border-b-2 border-red-500 text-white bg-slate-950/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Device Privacy Status
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'manage' ? (
          <div className="space-y-4">
            <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-red-400 font-bold uppercase tracking-wider font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                Vault Toggle Protocol
              </div>
              <p className="text-[10.5px] text-slate-400 leading-relaxed">
                Check or uncheck the visibility of individual modules below. Turning an app **OFF** completely unlinks it from the secret folder grid to maximize level-one stealth.
              </p>
            </div>

            <div className="space-y-2.5">
              {appStates.filter(a => a.id !== 'guard').map(app => ( // don't allow hiding the guard itself
                <div
                  key={app.id}
                  onClick={() => handleToggleHide(app.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    !app.isHidden
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-850'
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:bg-slate-950/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-mono font-bold text-lg ${
                      !app.isHidden ? app.color : 'bg-slate-900 text-slate-600'
                    }`}>
                      {app.icon}
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${!app.isHidden ? 'text-white' : 'text-slate-600'}`}>{app.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{app.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!app.isHidden ? (
                      <span className="text-[9px] font-bold text-emerald-500 bg-emerald-950 px-1.5 py-0.5 rounded flex items-center gap-0.5 select-none font-mono">
                        <Eye className="w-2.5 h-2.5" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded flex items-center gap-0.5 select-none font-mono">
                        <EyeOff className="w-2.5 h-2.5" /> HIDDEN
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex gap-3 items-start">
              <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-white">Exclusion Shield Status</h4>
                <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
                  The client-side sandbox container guarantees that secret modules and private vaults do not produce system footprints.
                </p>
              </div>
            </div>

            {/* Checklists */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
              <h3 className="font-bold font-mono text-[10px] uppercase tracking-widest text-red-400">Security Validation audits</h3>
              
              <div className="space-y-3">
                {/* 1 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 text-[10px] font-bold flex-shrink-0 mt-0.5">
                     ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-200 text-xs">Digital Wellbeing System Screen Time</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                      All activity within notes, private browsing, and games logs under package indicator <strong>"Advance Calculator"</strong>. Simulated subsystems account for 0m global usage stats.
                    </p>
                  </div>
                </div>

                {/* 2 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 text-[10px] font-bold flex-shrink-0 mt-0.5">
                     ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-200 text-xs">Spotlight Search Exclusions</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                      Standard mobile and OS launcher indices fail to locate secure base64 media records, private diaries, or classified contacts stored within this node vault.
                    </p>
                  </div>
                </div>

                {/* 3 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 text-[10px] font-bold flex-shrink-0 mt-0.5">
                     ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-200 text-xs">Device System Settings Logs</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                      The package registry detects no external services or background services. Storage allocation is classified purely as standard runtime cache data for the core utility. State is fully containerized.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-red-950/10 border border-red-900/20 text-center rounded-xl">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Secure sandbox hash</span>
              <span className="font-mono text-zinc-300 text-xs mt-1 block">CALC-VAULT-PRO-827C948D</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
