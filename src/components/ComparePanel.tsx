import React, { useState } from 'react';
import { BRANDS, Brand } from '../data/brands.js';
import { Scale, ArrowLeftRight, Check, X, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ComparePanel({ onSelectBrand }: { onSelectBrand: (brand: Brand) => void }) {
  const [brandAId, setBrandAId] = useState<string>('minimalist');
  const [brandBId, setBrandBId] = useState<string>('mamaearth');

  const brandA = BRANDS.find((b) => b.id === brandAId) || BRANDS[0];
  const brandB = BRANDS.find((b) => b.id === brandBId) || BRANDS[1];

  const handleSwap = () => {
    const temp = brandAId;
    setBrandAId(brandBId);
    setBrandBId(temp);
  };

  const getWinner = () => {
    if (brandA.score > brandB.score) {
      return {
        name: brandA.name,
        diff: brandA.score - brandB.score,
        reason: `${brandA.name} scores significantly higher in Transparency (${brandA.breakdown.transparency}%) and has '${brandA.scamRisk}' scam risk compared to ${brandB.name}.`
      };
    } else if (brandB.score > brandA.score) {
      return {
        name: brandB.name,
        diff: brandB.score - brandA.score,
        reason: `${brandB.name} displays better operational consistency (${brandB.breakdown.consistency}%) and higher customer validation than ${brandA.name}.`
      };
    }
    return null;
  };

  const winner = getWinner();

  return (
    <div id="compare-panel-root" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-900 flex items-center gap-2">
            <Scale className="text-black w-6 h-6" /> Brand Comparison Bench
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Compare two brands side-by-side to review true corporate trust and customer satisfaction metrics.
          </p>
        </div>
      </div>

      {/* Selectors card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4">
          <div className="md:col-span-5">
            <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase tracking-wider font-bold">Primary Brand</label>
            <select
              value={brandAId}
              onChange={(e) => setBrandAId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-gray-900 focus:outline-none focus:border-black text-sm font-sans cursor-pointer"
            >
              {BRANDS.map((b) => (
                <option key={`opt-a-${b.id}`} value={b.id} disabled={b.id === brandBId}>
                  {b.name} ({b.score}) — {b.category}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 flex justify-center pt-4 md:pt-0">
            <button
              onClick={handleSwap}
              title="Swap Brands"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-full transition-all border border-gray-200 shrink-0 cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase tracking-wider font-bold">Comparison Target</label>
            <select
              value={brandBId}
              onChange={(e) => setBrandBId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-gray-900 focus:outline-none focus:border-black text-sm font-sans cursor-pointer"
            >
              {BRANDS.map((b) => (
                <option key={`opt-b-${b.id}`} value={b.id} disabled={b.id === brandAId}>
                  {b.name} ({b.score}) — {b.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {winner && (
          <div className="mt-5 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 shadow-3xs">
            <ShieldCheck className="text-emerald-600 w-5 h-5 mt-1 shrink-0" />
            <div>
              <span className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider">Vouch Recommendation Verdict</span>
              <p className="text-sm text-gray-700 mt-1">
                <strong>{winner.name}</strong> is globally recommended over the alternative, with a <strong>+{winner.diff} higher</strong> Overall Trust Score. {winner.reason}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand A Column */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-3xl overflow-hidden shadow-sm transition-all">
          <div className="p-6 bg-slate-50 border-b border-gray-205 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-600 uppercase tracking-widest bg-white px-2.5 py-0.5 rounded-md border border-gray-250 shadow-3xs font-semibold">
                  {brandA.category}
                </span>
                {brandA.verifiedStatus && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-bold">
                    Certified
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold font-display text-gray-900 mt-2">{brandA.name}</h3>
              <p className="text-xs text-gray-400 mt-1">Active for {brandA.yearsActive} years</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-gray-500 block uppercase font-bold">Trust Score</span>
              <span className="text-4xl font-extrabold font-display text-gray-900 tracking-tight">{brandA.score}</span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2 font-bold">Scam Risk Assessment</h4>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                brandA.scamRisk === 'Very Low' || brandA.scamRisk === 'Low'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : brandA.scamRisk === 'Moderate'
                  ? 'bg-amber-50 text-amber-700 border-amber-100'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {brandA.scamRisk === 'Very Low' || brandA.scamRisk === 'Low' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
                {brandA.scamRisk} Risk
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider font-bold">Metrics Comparison</h4>
              <div className="space-y-2">
                {[
                  { label: 'Transparency', val: brandA.breakdown.transparency },
                  { label: 'Customer Satisfaction', val: brandA.breakdown.customerSatisfaction },
                  { label: 'Review Authenticity', val: brandA.breakdown.reviewAuthenticity },
                  { label: 'Consistency Rating', val: brandA.breakdown.consistency },
                  { label: 'Trusted Circle Score', val: brandA.trustedCircle.score }
                ].map((item) => (
                  <div key={`m-a-${item.label}`} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-mono font-bold text-gray-900">{item.val}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2 font-bold">Core Advantages</h4>
              <ul className="space-y-1.5">
                {brandA.advantages.map((adv, idx) => (
                  <li key={`adv-a-${idx}`} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <Check className="text-emerald-500 w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2 font-bold select-none">Disadvantages</h4>
              <ul className="space-y-1.5">
                {brandA.disadvantages.map((dis, idx) => (
                  <li key={`dis-a-${idx}`} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <X className="text-rose-500 w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onSelectBrand(brandA)}
              className="w-full bg-black text-white hover:bg-gray-850 text-sm font-semibold py-2.5 rounded-xl border border-gray-200 shadow-3xs transition-colors mt-2 cursor-pointer"
            >
              Analyze {brandA.name} Deeply
            </button>
          </div>
        </div>

        {/* Brand B Column */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-3xl overflow-hidden shadow-sm transition-all">
          <div className="p-6 bg-slate-50 border-b border-gray-205 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-600 uppercase tracking-widest bg-white px-2.5 py-0.5 rounded-md border border-gray-250 shadow-3xs font-semibold">
                  {brandB.category}
                </span>
                {brandB.verifiedStatus && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-bold">
                    Certified
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold font-display text-gray-900 mt-2">{brandB.name}</h3>
              <p className="text-xs text-gray-400 mt-1">Active for {brandB.yearsActive} years</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-gray-500 block uppercase font-bold">Trust Score</span>
              <span className="text-4xl font-extrabold font-display text-gray-900 tracking-tight">{brandB.score}</span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2 font-bold">Scam Risk Assessment</h4>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                brandB.scamRisk === 'Very Low' || brandB.scamRisk === 'Low'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : brandB.scamRisk === 'Moderate'
                  ? 'bg-amber-50 text-amber-700 border-amber-100'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {brandB.scamRisk === 'Very Low' || brandB.scamRisk === 'Low' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
                {brandB.scamRisk} Risk
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider font-bold">Metrics Comparison</h4>
              <div className="space-y-2">
                {[
                  { label: 'Transparency', val: brandB.breakdown.transparency },
                  { label: 'Customer Satisfaction', val: brandB.breakdown.customerSatisfaction },
                  { label: 'Review Authenticity', val: brandB.breakdown.reviewAuthenticity },
                  { label: 'Consistency Rating', val: brandB.breakdown.consistency },
                  { label: 'Trusted Circle Score', val: brandB.trustedCircle.score }
                ].map((item) => (
                  <div key={`m-b-${item.label}`} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-mono font-bold text-gray-900">{item.val}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2 font-bold">Core Advantages</h4>
              <ul className="space-y-1.5">
                {brandB.advantages.map((adv, idx) => (
                  <li key={`adv-b-${idx}`} className="text-xs text-gray-650 flex items-start gap-1.5">
                    <Check className="text-emerald-555 w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2 font-bold">Disadvantages</h4>
              <ul className="space-y-1.5">
                {brandB.disadvantages.map((dis, idx) => (
                  <li key={`dis-b-${idx}`} className="text-xs text-gray-650 flex items-start gap-1.5">
                    <X className="text-rose-500 w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onSelectBrand(brandB)}
              className="w-full bg-black text-white hover:bg-gray-850 text-sm font-semibold py-2.5 rounded-xl border border-gray-200 shadow-3xs transition-colors mt-2 cursor-pointer"
            >
              Analyze {brandB.name} Deeply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
