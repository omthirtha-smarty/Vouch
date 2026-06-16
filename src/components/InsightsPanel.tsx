import React, { useState } from 'react';
import { Info, ShieldCheck, AlertTriangle, RefreshCw, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

export default function InsightsPanel() {
  // Calculator values
  const [transparency, setTransparency] = useState<number>(90);
  const [satisfaction, setSatisfaction] = useState<number>(85);
  const [authenticity, setAuthenticity] = useState<number>(88);
  const [consistency, setConsistency] = useState<number>(92);
  const [community, setCommunity] = useState<number>(80);
  const [circle, setCircle] = useState<number>(85);
  const [maturity, setMaturity] = useState<number>(75);
  const [scamRisk, setScamRisk] = useState<string>('Low');

  // Math: Calculate overall score
  const wTrans = transparency * 0.15;
  const wSatis = satisfaction * 0.20;
  const wAuth = authenticity * 0.15;
  const wCons = consistency * 0.15;
  const wComm = community * 0.15;
  const wCirc = circle * 0.10;
  const wMat = maturity * 0.10;

  let penalty = 0;
  if (scamRisk === 'Very Low') penalty = 0;
  else if (scamRisk === 'Low') penalty = 0;
  else if (scamRisk === 'Moderate') penalty = -3;
  else if (scamRisk === 'High') penalty = -7;
  else if (scamRisk === 'Critical') penalty = -15;

  const rawScore = wTrans + wSatis + wAuth + wCons + wComm + wCirc + wMat + penalty;
  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  const handleReset = () => {
    setTransparency(90);
    setSatisfaction(85);
    setAuthenticity(88);
    setConsistency(92);
    setCommunity(80);
    setCircle(85);
    setMaturity(75);
    setScamRisk('Low');
  };

  const currentGrade = () => {
    if (finalScore >= 90) return { title: 'Elite AAA', desc: 'Maximum Trust, fully verified disclosures and peerless customer consistency.' };
    if (finalScore >= 80) return { title: 'Strong AA', desc: 'High Trust, stable operating parameters and organic consumer endorsement.' };
    if (finalScore >= 70) return { title: 'Investment Grade A', desc: 'Reputable, minor areas of review variance or support delays.' };
    if (finalScore >= 50) return { title: 'Speculative B', desc: 'Vulnerable feedback, elevated review fraud indicators or weak refund systems.' };
    return { title: 'Deficient C (Critical Risk)', desc: 'High risk of purchase dissatisfaction, critical scam signals active.' };
  };

  const grade = currentGrade();

  return (
    <div id="insights-panel-root" className="space-y-6">
      {/* Page intro */}
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold font-display text-gray-900 flex items-center gap-2">
          <TrendingUp className="text-black w-6 h-6" /> Trust Algorithm Insights
        </h2>
        <p className="text-sm text-gray-500 mt-1 font-sans">
          Learn how Vouch operates as "The Credit Score for Brands." Play with weights to see how trust grades are decided.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Algorithm Pillars Explanation */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 font-display">The 8 Pillars of Brand Trust</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-sans">
            Other sites rely on raw stars which can easily be bought or faked. Vouch computes scores through multiple factors, cross-verifying self-reported statements against user circles and logistics outcomes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              {
                title: 'Transparency (15%)',
                desc: 'Audited botanical formula percentages, public batch lists, clear corporate registration disclosures.'
              },
              {
                title: 'Customer Satisfaction (20%)',
                desc: 'Re-purchase likelihood indicators, customer service desk timings, and actual coupon validation success.'
              },
              {
                title: 'Review Authenticity (15%)',
                desc: 'Filtering out incentivized feedback, identifying repetitive bot phrases, and verifying paid campaigns.'
              },
              {
                title: 'Consistency (15%)',
                desc: 'History of product batch recalls, hardware failure occurrences, and stable material standards over years.'
              },
              {
                title: 'Community Trust (15%)',
                desc: 'Independent organic feedback across public digital spaces, removing official brand-sponsored channels.'
              },
              {
                title: 'Trusted Circle (10%)',
                desc: 'Personal networks. Positive peer, friend, family member, and industry mentor endorsement maps.'
              },
              {
                title: 'Brand Maturity (10%)',
                desc: 'Lifespan active premiums. Mitigates volatile spikes from brands under 12 months with no history.'
              },
              {
                title: 'Scam Risk Adjust',
                desc: 'Negative adjustments triggered by high refund grievances, lack of checkout security, or fake physical sites.'
              }
            ].map((p, idx) => (
              <div key={`p-exp-${idx}`} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-3xs hover:border-gray-300 transition-colors">
                <h4 className="text-xs font-bold text-gray-950 flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" /> {p.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed font-sans">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl">
            <h4 className="text-xs font-mono font-bold uppercase text-gray-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-black" /> Accountability Metric
            </h4>
            <p className="text-xs text-gray-650 mt-1.5 leading-relaxed font-sans">
              We track "promises vs. outcomes." When a brand claims to deliver "delivery in 24 hours" or "results in 3 weeks", Vouch audits actual customer poll replies over 30 and 180-day periods.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Score Playground */}
        <div id="score-simulator" className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-150 pb-3">
            <div>
              <h4 className="font-display font-bold text-gray-900 text-sm">Trust Score Calculator</h4>
              <span className="text-[10px] font-mono text-gray-400 font-bold">Algorithm Sandbox</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-gray-600 hover:text-black flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors shadow-3xs cursor-pointer font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Current Output Score Dial */}
          <div className="bg-slate-50 border border-gray-200 rounded-3xl p-5 text-center space-y-2 shadow-3xs">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block font-bold">Simulated Score</span>
            <div className="relative inline-flex items-center justify-center">
              <span className="text-5xl font-black font-display text-black tracking-tight">{finalScore}</span>
              <span className="text-xs text-gray-400 absolute -bottom-1 font-mono font-bold">/100</span>
            </div>
            <div className="pt-3">
              <span className="text-xs bg-black text-white px-3 py-1 rounded-xl font-bold inline-block shadow-3xs">
                Grade: {grade.title}
              </span>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed max-w-[280px] mx-auto font-sans">
                {grade.desc}
              </p>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3.5 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 font-medium">Transparency (15%)</span>
                <span className="font-mono text-black font-bold">{transparency}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={transparency}
                onChange={(e) => setTransparency(Number(e.target.value))}
                className="w-full accent-black bg-gray-200 h-1 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 font-medium">Customer Satisfaction (20%)</span>
                <span className="font-mono text-black font-bold">{satisfaction}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={satisfaction}
                onChange={(e) => setSatisfaction(Number(e.target.value))}
                className="w-full accent-black bg-gray-200 h-1 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 font-medium">Review Authenticity (15%)</span>
                <span className="font-mono text-black font-bold">{authenticity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={authenticity}
                onChange={(e) => setAuthenticity(Number(e.target.value))}
                className="w-full accent-black bg-gray-200 h-1 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 font-medium">Consistency Rating (15%)</span>
                <span className="font-mono text-black font-bold">{consistency}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={consistency}
                onChange={(e) => setConsistency(Number(e.target.value))}
                className="w-full accent-black bg-gray-200 h-1 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 font-medium">Community Trust (15%)</span>
                <span className="font-mono text-black font-bold">{community}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={community}
                onChange={(e) => setCommunity(Number(e.target.value))}
                className="w-full accent-black bg-gray-200 h-1 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 font-medium">Trusted Circle referrals (10%)</span>
                <span className="font-mono text-black font-bold">{circle}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={circle}
                onChange={(e) => setCircle(Number(e.target.value))}
                className="w-full accent-black bg-gray-200 h-1 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 font-medium">Brand Maturity (10%)</span>
                <span className="font-mono text-black font-bold">{maturity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={maturity}
                onChange={(e) => setMaturity(Number(e.target.value))}
                className="w-full accent-black bg-gray-200 h-1 rounded-lg cursor-pointer"
              />
            </div>

            <div className="pt-1 select-none">
              <label className="block text-xs text-gray-700 mb-1.5 font-semibold">Scam Risk Assessment (Adjustment Factor)</label>
              <div className="grid grid-cols-5 gap-1.5">
                {['Very Low', 'Low', 'Moderate', 'High', 'Critical'].map((level) => (
                  <button
                    key={`risk-${level}`}
                    onClick={() => setScamRisk(level)}
                    className={`text-[10px] font-semibold py-1.5 rounded-xl transition-all text-center cursor-pointer ${
                      scamRisk === level
                        ? level === 'Very Low' || level === 'Low'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-3xs'
                          : level === 'Moderate'
                          ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-3xs'
                          : 'bg-rose-50 text-rose-800 border border-rose-300 shadow-3xs'
                        : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              {penalty < 0 && (
                <div className="text-[10px] text-rose-600 mt-1.5 flex items-center gap-1 font-mono font-bold">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> Applies penalty of {penalty} points to cumulative trust.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
