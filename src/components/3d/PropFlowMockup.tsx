'use client';

import { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Sparkles, Check } from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  property: string;
  stage: 'new' | 'contacted' | 'viewing' | 'closed';
}

export default function PropFlowMockup() {
  const prefersReduced = useReducedMotion();
  
  const [deals, setDeals] = useState<Deal[]>([
    { id: '1', name: 'Maria Garcia', property: '2BR Cebu IT Park', stage: 'new' },
    { id: '2', name: 'Juan Santos', property: '3BR Mandaue', stage: 'contacted' },
    { id: '3', name: 'Rosita Reyes', property: '1BR Makati', stage: 'viewing' },
  ]);

  const [aiText, setAiText] = useState('');
  const [aiStatus, setAiStatus] = useState<'idle' | 'typing' | 'sent'>('idle');

  useEffect(() => {
    if (prefersReduced) return;

    let cycle = 0;
    const interval = setInterval(() => {
      cycle = (cycle + 1) % 4;

      if (cycle === 0) {
        // Reset to initial state
        setDeals([
          { id: '1', name: 'Maria Garcia', property: '2BR Cebu IT Park', stage: 'new' },
          { id: '2', name: 'Juan Santos', property: '3BR Mandaue', stage: 'contacted' },
          { id: '3', name: 'Rosita Reyes', property: '1BR Makati', stage: 'viewing' },
        ]);
        setAiText('');
        setAiStatus('idle');
      } else if (cycle === 1) {
        // Move Maria to contacted, trigger AI typing
        setDeals((prev) =>
          prev.map((d) => (d.id === '1' ? { ...d, stage: 'contacted' } : d))
        );
        setAiStatus('typing');
        
        // Type out AI text
        const text = "Hi Maria, just following up on the 2BR in Cebu IT Park! 😊";
        let currentText = '';
        let index = 0;
        const typingInterval = setInterval(() => {
          if (index < text.length) {
            currentText += text[index];
            setAiText(currentText);
            index++;
          } else {
            clearInterval(typingInterval);
            setAiStatus('sent');
            // After sending, move Maria to viewing
            setTimeout(() => {
              setDeals((prev) =>
                prev.map((d) => (d.id === '1' ? { ...d, stage: 'viewing' } : d))
              );
            }, 1200);
          }
        }, 30);
      } else if (cycle === 2) {
        // Move Juan to viewing, Rosita to closed
        setDeals((prev) =>
          prev.map((d) => {
            if (d.id === '2') return { ...d, stage: 'viewing' };
            if (d.id === '3') return { ...d, stage: 'closed' };
            return d;
          })
        );
      } else if (cycle === 3) {
        // Move Maria and Juan to closed! Deal win!
        setDeals((prev) =>
          prev.map((d) => ({ ...d, stage: 'closed' }))
        );
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [prefersReduced]);

  const stages = [
    { key: 'new', label: 'New Lead' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'viewing', label: 'Viewing' },
    { key: 'closed', label: 'Closed Deal' },
  ] as const;

  return (
    <div className="relative mx-auto w-full max-w-md md:max-w-xl">
      {/* Decorative backing glows */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-2xl blur-xl pointer-events-none" />
      
      <div className="relative bg-[#050508]/80 border border-white/[0.06] rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Header bar */}
        <div className="bg-white/[0.02] border-b border-white/[0.04] px-5 py-3.5 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white/[0.12]" />
            <div className="w-2 h-2 rounded-full bg-white/[0.12]" />
            <div className="w-2 h-2 rounded-full bg-white/[0.12]" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={11} className="text-blue-500 animate-pulse" />
            PropFlow Sandbox v1.0
          </span>
        </div>

        {/* Dashboard workspace */}
        <div className="p-5 space-y-5">
          {/* Kanban Columns */}
          <div className="grid grid-cols-4 gap-2">
            {stages.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage.key);
              return (
                <div key={stage.key} className="space-y-2">
                  <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                    {stage.label}
                  </div>
                  
                  <div className="bg-white/[0.01] border border-dashed border-white/[0.04] rounded-lg p-1.5 min-h-[160px] space-y-2 relative">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 shadow-sm"
                        style={{
                          transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        }}
                      >
                        <p className="text-[10px] font-bold text-white tracking-tight">{deal.name}</p>
                        <p className="text-[8px] text-slate-400 mt-0.5">{deal.property}</p>
                        
                        {deal.stage === 'closed' && (
                          <span className="inline-flex mt-1 items-center gap-0.5 px-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[7px] font-bold text-emerald-400">
                            Won
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Drafting Assistant simulation */}
          <div className="bg-blue-500/[0.03] border border-blue-500/10 rounded-xl p-3.5 relative overflow-hidden">
            {/* Spotlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={11} />
                AI Assistant Draft
              </span>
              
              {aiStatus === 'typing' && (
                <span className="text-[8px] text-slate-500 font-mono italic">
                  Writing...
                </span>
              )}
              {aiStatus === 'sent' && (
                <span className="text-[8px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check size={9} /> Auto-Copied
                </span>
              )}
            </div>

            <div className="min-h-[46px] bg-[#050508]/80 border border-white/[0.04] rounded-lg p-2.5 flex items-center">
              {aiText ? (
                <p className="text-[10px] text-slate-300 font-mono leading-relaxed break-words w-full">
                  {aiText}
                  {aiStatus === 'typing' && <span className="w-1 h-3 bg-blue-400 inline-block animate-pulse ml-0.5" />}
                </p>
              ) : (
                <p className="text-[10px] text-slate-600 font-mono italic">
                  Waiting for lead follow-up trigger...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
