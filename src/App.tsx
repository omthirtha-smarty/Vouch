import React, { useState, useMemo } from 'react';
import { BRANDS, Brand, CATEGORY_MAP } from './data/brands.js';
import ComparePanel from './components/ComparePanel.js';
import AskVouchPanel from './components/AskVouchPanel.js';
import InsightsPanel from './components/InsightsPanel.js';
import {
  ShieldCheck,
  AlertTriangle,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Scale,
  HelpCircle,
  Home,
  Briefcase,
  ArrowRight,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
  Clock,
  Award,
  Menu,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'gems' | 'compare' | 'insights' | 'ask' | 'business'>('home');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Search logic states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    type: 'brand' | 'category' | 'need' | 'none';
    matchTerm: string;
    brands: Brand[];
  } | null>(null);

  // Filters for Discover Brands
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minTrustScore, setMinTrustScore] = useState<number>(0);
  const [filterScamRisk, setFilterScamRisk] = useState<string>('All');
  const [filterVerified, setFilterVerified] = useState<boolean>(false);

  // Business evaluation application mock
  const [bizSubmitting, setBizSubmitting] = useState(false);
  const [bizSubmitted, setBizSubmitted] = useState(false);
  const [bizName, setBizName] = useState('');
  const [bizWebsite, setBizWebsite] = useState('');

  // Handle global search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const q = searchQuery.toLowerCase().trim();

    // 1. Check exact/partial Brand Name match
    const matchedBrand = BRANDS.find((b) => b.name.toLowerCase() === q);
    if (matchedBrand) {
      setSearchResults({
        type: 'brand',
        matchTerm: matchedBrand.name,
        brands: [matchedBrand]
      });
      setSelectedBrand(matchedBrand); // Open directly
      return;
    }

    const matchedBrandsPartial = BRANDS.filter((b) => b.name.toLowerCase().includes(q));
    if (matchedBrandsPartial.length === 1) {
      setSearchResults({
        type: 'brand',
        matchTerm: matchedBrandsPartial[0].name,
        brands: matchedBrandsPartial
      });
      setSelectedBrand(matchedBrandsPartial[0]); // Open directly
      return;
    }

    // 2. Check Product Category Match
    const categories = Object.keys(CATEGORY_MAP);
    const matchedCategory = categories.find(
      (cat) => cat.toLowerCase() === q || q.includes(cat.toLowerCase()) || cat.toLowerCase().includes(q)
    );

    if (matchedCategory) {
      const brandIds = CATEGORY_MAP[matchedCategory as keyof typeof CATEGORY_MAP] || [];
      const categoryBrands = BRANDS.filter((b) => brandIds.includes(b.id));
      setSearchResults({
        type: 'category',
        matchTerm: matchedCategory,
        brands: categoryBrands
      });
      setActiveTab('discover'); // redirect
      return;
    }

    // Direct mapping synonym checks for category: "hair cream", "beauty", etc.
    if (q.includes('hair cream') || q.includes('shampoo') || q.includes('hair styling')) {
      const hairBrands = BRANDS.filter((b) => CATEGORY_MAP['Hair Care'].includes(b.id));
      setSearchResults({
        type: 'category',
        matchTerm: 'Hair Styling & Creams',
        brands: hairBrands
      });
      setActiveTab('discover');
      return;
    }

    // 3. Check Consumer Needs (Fuzzy check in b.needs or b.subcategories)
    const needyBrands = BRANDS.filter(
      (b) =>
        b.needs.some((need) => need.toLowerCase().includes(q) || q.includes(need.toLowerCase())) ||
        b.subcategories.some((sub) => sub.toLowerCase().includes(q) || q.includes(sub.toLowerCase()))
    );

    if (needyBrands.length > 0) {
      setSearchResults({
        type: 'need',
        matchTerm: searchQuery,
        brands: needyBrands
      });
      setActiveTab('discover');
      return;
    }

    // No direct matches
    setSearchResults({
      type: 'none',
      matchTerm: searchQuery,
      brands: []
    });
    setActiveTab('discover');
  };

  // Preloaded Search clicks
  const triggerPreloadedSearch = (term: string) => {
    setSearchQuery(term);
    // Simulate submit
    const q = term.toLowerCase().trim();
    const matchedBrand = BRANDS.find((b) => b.name.toLowerCase() === q || b.id === q);
    if (matchedBrand) {
      setSelectedBrand(matchedBrand);
      setSearchResults({ type: 'brand', matchTerm: matchedBrand.name, brands: [matchedBrand] });
      return;
    }

    // Category / concerns logic
    if (q === 'hair cream' || q === 'hair styling' || q === 'hair fall') {
      const brands = BRANDS.filter((b) => b.category === 'Hair Care' || b.needs.includes('Dry Hair') || b.needs.includes('Hair Fall'));
      setSearchResults({ type: 'need', matchTerm: term, brands });
      setActiveTab('discover');
      return;
    }

    if (q === 'skincare' || q === 'sensitive skin') {
      const brands = BRANDS.filter((b) => b.category === 'Skincare' || b.needs.includes('Sensitive Skin'));
      setSearchResults({ type: 'need', matchTerm: term, brands });
      setActiveTab('discover');
      return;
    }

    if (q === 'running shoes' || q === 'shoes') {
      const brands = BRANDS.filter((b) => b.needs.includes('Running Shoes') || b.category === 'Fashion');
      setSearchResults({ type: 'need', matchTerm: term, brands });
      setActiveTab('discover');
      return;
    }

    // General search fallback
    setSearchQuery(term);
    const matchedBrandsPartial = BRANDS.filter((b) => b.name.toLowerCase().includes(q));
    setSearchResults({ type: 'brand', matchTerm: term, brands: matchedBrandsPartial });
    setActiveTab('discover');
  };

  // Reset search filter
  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  // Filtered Brands for Discover Tab
  const discoveredBrands = useMemo(() => {
    let sourceList = searchResults && searchResults.type !== 'brand' ? searchResults.brands : BRANDS;

    return sourceList.filter((b) => {
      // Category match
      if (selectedCategory !== 'All' && b.category !== selectedCategory) {
        // Double check subcategory mapping as fallback
        if (!b.subcategories.includes(selectedCategory)) {
          return false;
        }
      }
      // Score match
      if (b.score < minTrustScore) return false;
      // Scam risk match
      if (filterScamRisk !== 'All' && b.scamRisk !== filterScamRisk) return false;
      // Verification status match
      if (filterVerified && !b.verifiedStatus) return false;

      return true;
    });
  }, [searchResults, selectedCategory, minTrustScore, filterScamRisk, filterVerified]);

  // Fictional Hidden Gems list
  const hiddenGems = useMemo(() => {
    return BRANDS.filter((b) => b.score >= 85 && b.scamRisk === 'Very Low' && b.yearsActive <= 10);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7F9] text-[#1A1A1A] flex flex-col md:flex-row">
      
      {/* 1. MASTER NAVBAR SIDEBAR (Clean Utility / Minimal aesthetic, light crisp) */}
      <nav className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between shrink-0 font-sans">
        <div>
          {/* Brand Header Logo */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-black p-2 rounded-xl shadow-sm">
                <ShieldCheck className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold font-display text-gray-900 tracking-widest uppercase">
                  VOUCH
                </h1>
                <span className="text-[9px] font-mono tracking-widest text-gray-500 block uppercase">
                  Trust Intelligence
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'discover', label: 'Discover Brands', icon: Search },
              { id: 'gems', label: 'Hidden Gems 💎', icon: Award },
              { id: 'compare', label: 'Compare Brands', icon: Scale },
              { id: 'insights', label: 'Trust Insights', icon: TrendingUp },
              { id: 'ask', label: 'Ask Vouch 🤖', icon: Sparkles },
              { id: 'business', label: 'Business Hub', icon: Briefcase }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                     setActiveTab(tab.id as any);
                     setSelectedBrand(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id && !selectedBrand
                      ? 'bg-gray-100 text-gray-900 border border-gray-200 shadow-2xs font-semibold'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand statement footer */}
        <div className="p-6 border-t border-gray-200 text-[10px] text-gray-500 space-y-1">
          <p>© 2026 Vouch Inc.</p>
          <p>Trust before transaction.</p>
          <p className="font-mono text-[9px] text-gray-400">BUILD_VER: 2.1.0-TS</p>
        </div>
      </nav>

      {/* 2. MAIN SCROLLABLE DASHBOARD VIEW */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F5F7F9]">
        
        {/* Global Banner: Non-manipulated trust pledge */}
        <div className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between text-xs text-gray-600 select-none">
          <span className="flex items-center gap-1.5 text-gray-800 font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Independent Trust Verification Active
          </span>
          <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Brands cannot buy or edit ratings
          </span>
        </div>

        {/* Brand profile details Drawer (Renders if selected) */}
        {selectedBrand ? (
          <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
            
            {/* Header / Back */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
              <button
                onClick={() => setSelectedBrand(null)}
                className="flex items-center gap-1.5 text-xs text-gray-800 hover:text-black bg-white hover:bg-gray-50 py-2.5 px-4 rounded-xl border border-gray-200 shadow-2xs font-semibold transition-all cursor-pointer"
              >
                ← Back to brand list
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Assessment Profile</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Factual Verdict</span>
              </div>
            </div>

            {/* Main Brand header card layout */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-gray-800">
              
              {/* Core Header Stats Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 font-display">
                      {selectedBrand.name}
                    </span>
                    {selectedBrand.verifiedStatus && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono tracking-wider font-bold uppercase border border-emerald-100 px-2.5 py-0.5 rounded-md">
                        Vouch Certified
                      </span>
                    )}
                    {selectedBrand.isFictional && (
                      <span className="bg-gray-100 text-gray-700 text-[10px] border border-gray-200 px-2.5 py-0.5 rounded-md font-mono">
                        Fictional Gem
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span>{selectedBrand.category} Category</span>
                    <span>•</span>
                    <span>Active for {selectedBrand.yearsActive} Years</span>
                  </p>
                </div>

                {/* Score Dial Wrapper */}
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 py-3.5 px-6 rounded-2xl self-start md:self-auto">
                  <div className="text-center">
                    <span className="text-gray-500 text-[10px] font-mono tracking-widest block uppercase">Trust score</span>
                    <span className="text-4xl font-black font-display text-gray-900 tracking-tighter">
                      {selectedBrand.score}
                    </span>
                  </div>
                  <div className="h-10 w-[1px] bg-gray-200" />
                  <div>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                      Stable Trend
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-1">Evolving since {selectedBrand.journey[0]?.year}</span>
                  </div>
                </div>
              </div>

              {/* Scam risk alerts banner */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                selectedBrand.scamRisk === 'Very Low' || selectedBrand.scamRisk === 'Low'
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                  : selectedBrand.scamRisk === 'Moderate'
                  ? 'bg-amber-50 border-amber-100 text-amber-800'
                  : 'bg-rose-50 border-rose-100 text-rose-800'
              }`}>
                {selectedBrand.scamRisk === 'Very Low' || selectedBrand.scamRisk === 'Low' ? (
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                )}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                    Scam Risk Indicators: {selectedBrand.scamRisk}
                  </h4>
                  <ul className="list-disc pl-4 text-xs text-gray-700 mt-2 space-y-1">
                    {selectedBrand.scamRiskReason.map((reason, rIdx) => (
                      <li key={`scam-${rIdx}`}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Trust Summary Section */}
              <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5">
                <h4 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> AI Evaluation Intelligence
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                  {selectedBrand.aiSummary}
                </p>
              </div>

              {/* Pro and Cons splitting layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 leading-relaxed text-sm">
                <div className="bg-emerald-50/30 border border-emerald-100/70 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-600" /> Authenticated Advantages
                  </h4>
                  <ul className="space-y-2">
                    {selectedBrand.advantages.map((adv, aIdx) => (
                      <li key={`adv-${aIdx}`} className="text-gray-700 text-xs flex items-start gap-2">
                        <span className="text-emerald-500 text-xs">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/20 border border-rose-100/70 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-mono font-semibold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                    <X className="w-3.5 h-3.5 text-rose-600" /> Evaluated Disadvantages & Costs
                  </h4>
                  <ul className="space-y-2">
                    {selectedBrand.disadvantages.map((dis, dIdx) => (
                      <li key={`dis-${dIdx}`} className="text-gray-700 text-xs flex items-start gap-2">
                        <span className="text-rose-500 text-xs">•</span>
                        <span>{dis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Trusted Circle metric panel */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3.5 gap-2">
                  <div>
                    <h4 className="text-sm font-bold font-display text-gray-900">Trusted Circle Networks</h4>
                    <span className="text-[10px] text-gray-500 font-mono">Direct peer recommendations statistics</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-gray-900 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-2xs">
                    Circle Score: {selectedBrand.trustedCircle.score}%
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center">
                  <div>
                    <span className="text-xl font-bold font-display text-gray-900 block">
                      {selectedBrand.trustedCircle.friendsRecommend}
                    </span>
                    <span className="text-[10px] text-gray-500">Friends recommend</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold font-display text-gray-900 block">
                      {selectedBrand.trustedCircle.familyPurchased}
                    </span>
                    <span className="text-[10px] text-gray-500">Family purchased</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold font-display text-gray-900 block">
                      {selectedBrand.trustedCircle.mentorsTrust}
                    </span>
                    <span className="text-[10px] text-gray-500">Mentors trust</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold font-display text-gray-900 block">
                      {selectedBrand.trustedCircle.expertsRecommend}
                    </span>
                    <span className="text-[10px] text-gray-500">Experts recommend</span>
                  </div>
                </div>
              </div>

              {/* Accountability metrics table */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Accountability Tracking (Did promises match customer reality?)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {[
                    { label: 'Expectations Met', pct: selectedBrand.accountability.expectationsMet },
                    { label: 'Repurchase Rate', pct: selectedBrand.accountability.wouldBuyAgain },
                    { label: 'Fulfill Promises', pct: selectedBrand.accountability.fulfilledPromises },
                    { label: 'Reliable Service', pct: selectedBrand.accountability.reliableService },
                    { label: 'Would Recommend', pct: selectedBrand.accountability.wouldRecommend }
                  ].map((acc, aIdx) => (
                    <div key={`acc-card-${aIdx}`} className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-center shadow-2xs">
                      <span className="text-lg font-black font-display text-gray-900 block">{acc.pct}%</span>
                      <span className="text-[10px] text-gray-600 block mt-1 leading-snug">{acc.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Score detailed math breakdown */}
              <div className="border-t border-gray-200 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Pillar Breakdown Calculations</h4>
                  <span className="text-[10px] text-gray-400 font-mono">Weighted algorithm parameters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Transparency', score: selectedBrand.breakdown.transparency, weight: '15%' },
                    { label: 'Customer Satisfaction', score: selectedBrand.breakdown.customerSatisfaction, weight: '20%' },
                    { label: 'Review Authenticity', score: selectedBrand.breakdown.reviewAuthenticity, weight: '15%' },
                    { label: 'Consistency Rating', score: selectedBrand.breakdown.consistency, weight: '15%' },
                    { label: 'Community Trust', score: selectedBrand.breakdown.communityTrust, weight: '15%' },
                    { label: 'Trusted Circle Profile', score: selectedBrand.breakdown.trustedCircle, weight: '10%' },
                    { label: 'Brand Maturity Premium', score: selectedBrand.breakdown.brandMaturity, weight: '10%' }
                  ].map((p, pIdx) => (
                    <div key={`param-${pIdx}`} className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-800">{p.label} <span className="text-gray-400 font-mono text-[10px] ml-1">({p.weight})</span></span>
                        <span className="text-gray-900 font-mono">{p.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden animate-pulse">
                        <div className="bg-black h-full rounded-full" style={{ width: `${p.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {selectedBrand.breakdown.scamRiskAdjustment < 0 && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                    <span>Dynamic Score includes a penalty of <strong>{selectedBrand.breakdown.scamRiskAdjustment}</strong> points due to elevated scam risks.</span>
                  </div>
                )}
              </div>

              {/* Historical Journey Section */}
              <div className="border-t border-gray-200 pt-5">
                <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3.5">Trust journey timeline</h4>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {selectedBrand.journey.map((pt, jIdx) => (
                    <React.Fragment key={`j-${jIdx}`}>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-center min-w-[70px] shadow-2xs">
                        <span className="text-[10px] font-mono text-gray-500 block">{pt.year}</span>
                        <span className="text-sm font-bold font-display text-gray-900 mt-0.5 block">{pt.score}</span>
                      </div>
                      {jIdx < selectedBrand.journey.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0 select-none" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Badges Column list */}
              <div className="border-t border-gray-200 pt-5 space-y-2">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block">Earned Trust credentials</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedBrand.badges.map((badge, bIdx) => (
                    <span key={`badge-${bIdx}`} className="bg-gray-150 text-gray-800 text-xs px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-1 shadow-2xs font-semibold">
                      <Award className="w-3 h-3 text-gray-500" /> {badge}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Normal Tab Router Panels */
          <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
            
            {/* 🏠 tab: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-8 animate-fadeIn text-[#1A1A1A]">
                
                {/* HERO BLOCK (Clean Striped style) */}
                <div className="text-center md:py-10 max-w-3xl mx-auto space-y-4">
                  <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700 font-mono shadow-3xs mx-auto">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> SECURE BRAND INTELLIGENCE PLATFORM
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 tracking-widest uppercase">
                    VOUCH
                  </h2>
                  <p className="text-lg md:text-xl font-bold text-gray-800 font-display">
                    Trust Before Transaction
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    The dynamic Credit Score for Brands. We compute absolute corporate trust, review authenticity, and scam indicators so consumers can purchase with pristine confidence.
                  </p>

                  {/* MASTER SEARCH WRAPPER */}
                  <div className="pt-6 max-w-xl mx-auto">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Dyson, Hair Cream, sensitive skin, Minimalist..."
                        className="w-full bg-white border border-gray-200 focus:border-black text-gray-900 rounded-xl py-3.5 pl-11 pr-24 text-sm focus:outline-none transition-all placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-black/5"
                      />
                      <Search className="absolute left-4 w-4 h-4 text-gray-400" />
                      <button
                        type="submit"
                        className="absolute right-2 bg-black text-white font-semibold rounded-lg px-4 py-1.5 text-xs font-display hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        Find Brand
                      </button>
                    </form>

                    {/* Pre-laid Search tag pills */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs">
                      <span className="text-gray-500 mr-1.5">Quick lookup:</span>
                      {[
                        { label: 'Dyson', term: 'Dyson' },
                        { label: 'Hair Cream (Category)', term: 'hair cream' },
                        { label: 'Sensitive Skin (Need)', term: 'sensitive skin' },
                        { label: 'Running Shoes', term: 'running shoes' }
                      ].map((chip, cIdx) => (
                        <button
                          key={`chip-${cIdx}`}
                          type="button"
                          onClick={() => triggerPreloadedSearch(chip.term)}
                          className="bg-white border border-gray-200 hover:border-gray-400 shadow-3xs text-gray-700 px-3 py-1 rounded-full text-[11px] transition-colors cursor-pointer"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DYNAMIC SEARCH CONSOLE BOX (Renders if user has search outcome active) */}
                {searchResults && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs bg-gray-100 border border-gray-200 text-gray-800 px-2.5 py-0.5 rounded-md font-mono">
                          {searchResults.type.toUpperCase()} MATCH
                        </span>
                        <span className="text-sm font-bold text-gray-950">
                          Results matching "{searchResults.matchTerm}"
                        </span>
                      </div>
                      <button
                        onClick={resetSearch}
                        className="text-xs text-rose-600 hover:text-rose-800 hover:underline font-mono"
                      >
                        Clear Filter
                      </button>
                    </div>

                    {searchResults.type === 'category' && (
                      <div className="p-3 bg-slate-50 border border-slate-100 text-xs rounded-xl text-gray-600 leading-relaxed">
                        ⭐️ <strong>Vouch Core Difference Guidance:</strong> You searched for a <strong>Product Category</strong> ("{searchResults.matchTerm}"). Vouch does NOT list individual product variations. Instead, we display <strong>Verified Brands</strong> that score highly in this domain. Click any brand card below to inspect its operational metrics!
                      </div>
                    )}

                    {searchResults.type === 'need' && (
                      <div className="p-3 bg-slate-50 border border-slate-100 text-xs rounded-xl text-gray-600 leading-relaxed">
                        💡 <strong>Consumer Needs Mapping:</strong> Showing trusted brands that specialize in solving <strong>"{searchResults.matchTerm}"</strong> concerns.
                      </div>
                    )}

                    {searchResults.brands.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No evaluated brands matched your exact criteria. Click tab "Discover Brands" to view full database or submit standard request inside the "Business Hub."
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {searchResults.brands.map((b) => (
                          <div
                            key={`search-card-${b.id}`}
                            onClick={() => setSelectedBrand(b)}
                            className="bg-white border border-gray-200 hover:border-gray-400 cursor-pointer rounded-xl p-4 transition-all hover:scale-[1.01] shadow-3xs hover:shadow-2xs block"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-900 font-display text-sm">{b.name}</h4>
                              <span className="text-gray-900 font-bold font-mono text-sm">{b.score}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block uppercase mt-1 tracking-tight">{b.category}</span>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{b.aiSummary}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* PLATFORM METRICS OR STATS SUMMARY (Clean Slate look) */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest text-center font-bold">
                    Vouch Platform Assessment Volume
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 pt-2 text-center">
                    <div>
                      <span className="text-2xl md:text-3xl font-black font-display text-gray-900 block">520</span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Brands Monitored</span>
                    </div>
                    <div>
                      <span className="text-2xl md:text-3xl font-black font-display text-gray-900 block">12,480</span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Assessments Generated</span>
                    </div>
                    <div>
                      <span className="text-2xl md:text-3xl font-black font-display text-emerald-600 block">34</span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Hidden Gems Identified</span>
                    </div>
                    <div>
                      <span className="text-2xl md:text-3xl font-black font-display text-rose-600 block">82</span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Scam Warnings Issued</span>
                    </div>
                    <div>
                      <span className="text-2xl md:text-3xl font-black font-display text-gray-900 block">48,120</span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Circle Recommendations</span>
                    </div>
                    <div>
                      <span className="text-2xl md:text-3xl font-black font-display text-gray-800 block">9,340</span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Expert Endorsements</span>
                    </div>
                  </div>
                </div>

                {/* TARGET USERS split grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-3xs">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <Users className="w-5 h-5 text-gray-900" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-display">1. For Consumers</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Quickly discover whether a prospective brand deserves your hard-earned payment. Filter out bot review noise, fake social influencer campaigns, and inspect multi-year accountability benchmarks.
                    </p>
                  </div>

                  <div className="bg-emerald-50/15 border-2 border-emerald-100 rounded-2xl p-6 space-y-3 shadow-3xs">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-200">
                      <Award className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-display">2. For Small Businesses</h3>
                    <p className="text-xs text-gray-650 leading-relaxed">
                      Sincere, emerging brands naturally deserve wider credibility. Vouch gives highly transparent, bootstrapped emerging brands a mechanism to demonstrate their real-world integrity, bypassing giant marketing budgets.
                    </p>
                  </div>
                </div>

                {/* PLATFORM FEATURE HIGHLIGHTS */}
                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest text-center font-bold">
                    Unique Platform Core Mechanics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      {
                        title: '💎 Hidden Gems Discovery',
                        desc: 'Filters the global registry to reveal trustworthy, lesser-known brands with scores > 85, low scam indicators, and active service, keeping emerging builders discovered.'
                      },
                      {
                        title: '👥 Trusted Circle Verification',
                        desc: 'Integrates secure peer validation vectors (family purchases, friend reviews, verified expert reviews) to generate genuine confidence markers.'
                      },
                      {
                        title: '📈 Dynamic Trust Journey',
                        desc: 'Scores adapt to ongoing parameters, tracking how consistent formulation quality, customer fulfillment metrics, and billing parameters change over multi-year timelines.'
                      }
                    ].map((feature, fIdx) => (
                      <div key={`feat-${fIdx}`} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-400 transition-colors shadow-3xs">
                        <h4 className="text-sm font-bold text-gray-900 font-display">{feature.title}</h4>
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 🔍 tab: DISCOVER BRANDS */}
            {activeTab === 'discover' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Header overview and Search banner resetting */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
                      <Search className="text-black w-6 h-6" /> Brand Trust Directory
                    </h2>
                    <p className="text-sm text-gray-550 mt-1">
                      Browse Vouch independent assessments of global and local brands.
                    </p>
                  </div>
                  {searchResults && (
                    <div className="bg-white border border-gray-200 shadow-3xs rounded-xl py-1.5 px-3 flex items-center gap-2 text-xs">
                      <span className="text-gray-700">Filtered by: "{searchResults.matchTerm}"</span>
                      <button onClick={resetSearch} className="text-rose-600 underline font-mono text-[10px] cursor-pointer">Clear</button>
                    </div>
                  )}
                </div>

                {/* Filter Deck Grid */}
                <div className="bg-white border border-gray-200 rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end shadow-sm">
                  
                  {/* Category dropdown */}
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-2.5 text-xs focus:outline-none focus:border-black cursor-pointer font-sans"
                    >
                      <option value="All">All Categories</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Hair Care">Hair Care</option>
                      <option value="Skincare">Skincare</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Fitness">Fitness</option>
                      <option value="Food">Food </option>
                      <option value="Wellness">Wellness</option>
                      <option value="Home">Home</option>
                      <option value="Emerging Brands">Emerging Brands</option>
                    </select>
                  </div>

                  {/* Trust Score filter */}
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1.5">Min Trust Score</label>
                    <select
                      value={minTrustScore}
                      onChange={(e) => setMinTrustScore(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-2.5 text-xs focus:outline-none focus:border-black cursor-pointer font-sans"
                    >
                      <option value="0">Any Score</option>
                      <option value="90">Elite (90+)</option>
                      <option value="85">Strong (85+)</option>
                      <option value="80">Reputable (80+)</option>
                    </select>
                  </div>

                  {/* Scam Risk filter */}
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1.5">Scam Risk level</label>
                    <select
                      value={filterScamRisk}
                      onChange={(e) => setFilterScamRisk(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-2.5 text-xs focus:outline-none focus:border-black cursor-pointer font-sans"
                    >
                      <option value="All">Any Risk</option>
                      <option value="Very Low">Very Low Risk</option>
                      <option value="Low">Low Risk</option>
                      <option value="Moderate">Moderate Risk</option>
                    </select>
                  </div>

                  {/* Verified Check */}
                  <div className="flex items-center gap-2 h-9">
                    <input
                      id="verified-check"
                      type="checkbox"
                      checked={filterVerified}
                      onChange={(e) => setFilterVerified(e.target.checked)}
                      className="w-4 h-4 bg-gray-50 border-gray-300 rounded text-black focus:ring-black/20"
                    />
                    <label htmlFor="verified-check" className="text-xs text-gray-750 select-none cursor-pointer">
                      Vouch Certified Only
                    </label>
                  </div>

                </div>

                {/* Directory Brand Cards Output */}
                {discoveredBrands.length === 0 ? (
                  <div className="text-center p-12 bg-white border border-gray-200 rounded-2xl shadow-3xs space-y-2">
                    <p className="text-gray-500 text-sm">No evaluated brands match the selected criteria markers.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setMinTrustScore(0);
                        setFilterScamRisk('All');
                        setFilterVerified(false);
                        resetSearch();
                      }}
                      className="text-xs text-gray-900 font-bold hover:underline cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {discoveredBrands.map((b) => (
                      <div
                        key={b.id}
                        className="bg-white border border-gray-200 hover:border-gray-400 rounded-2xl overflow-hidden shadow-3xs hover:shadow-2xs transition-all flex flex-col justify-between"
                      >
                        {/* Header details block */}
                        <div className="p-5 space-y-4">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                              {b.category}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {b.verifiedStatus && (
                                <span className="w-2 h-2 bg-emerald-500 rounded-full" title="Certified" />
                              )}
                              <span className={`text-[10px] font-mono border rounded px-1.5 py-0.5 ${
                                b.scamRisk === 'Very Low' || b.scamRisk === 'Low'
                                  ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                                  : 'border-amber-200 text-amber-700 bg-amber-50'
                              }`}>
                                {b.scamRisk} Risk
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-gray-950 font-display tracking-tight flex items-center justify-between">
                              {b.name}
                              <span className="text-xl font-bold text-black ml-2">{b.score}</span>
                            </h3>
                            <span className="text-[10px] text-gray-400 block">Active {b.yearsActive} Years</span>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                            {b.aiSummary}
                          </p>
                        </div>

                        {/* Interactive trigger Button */}
                        <div className="p-5 border-t border-gray-100 bg-slate-50/40">
                          <button
                            onClick={() => setSelectedBrand(b)}
                            className="w-full bg-white hover:bg-gray-50 text-gray-800 hover:text-black font-semibold text-xs py-2.5 rounded-xl border border-gray-200 shadow-3xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            View Full Analysis <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* 💎 tab: HIDDEN GEMS */}
            {activeTab === 'gems' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Header overview */}
                <div className="border-b border-gray-200 pb-5">
                  <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
                    <Award className="text-black w-6 h-6" /> Verified Hidden Gems 💎
                  </h2>
                  <p className="text-sm text-gray-550 mt-1">
                    Showcasing trustworthy emerging brands. Under 10 years old, highly ethical (Score &gt; 85), and Low Scam indicators.
                  </p>
                </div>

                <div className="bg-emerald-50/20 border-2 border-emerald-100/60 rounded-2xl p-5 flex items-start gap-3.5 max-w-4xl shadow-3xs">
                  <span className="text-xl">🏆</span>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">Consumer Empowerment Mission</span>
                    <p className="text-xs text-gray-650 mt-1 leading-relaxed">
                      Small businesses often lack massive marketing budgets to compete with conglomerates on standard Google ads. Vouch Hidden Gems establishes a secure, objective credibility network, giving these highly sincere operators instant market visibility.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hiddenGems.map((b) => (
                    <div
                      key={`gem-${b.id}`}
                      className="bg-white border text-[#1A1A1A] border-gray-200 hover:border-gray-400 rounded-2xl p-6 shadow-3xs hover:shadow-2xs relative overflow-hidden flex flex-col justify-between group transition-all"
                    >
                      {/* Premium subtle glowing corner */}
                      <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-bl-full select-none" />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                            {b.category}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold uppercase bg-emerald-50 border border-emerald-155 px-2 py-0.5 rounded-md">
                            {b.yearsActive} yr emerging
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-gray-950 font-display tracking-tight flex justify-between items-baseline">
                            {b.name}
                            <span className="text-2xl font-black text-black ml-2">{b.score}</span>
                          </h3>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed text-justify">
                          {b.aiSummary}
                        </p>

                        <div className="border-t border-gray-200 pt-3.5 space-y-2">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">Real-World Gem Markers</span>
                          <div className="space-y-1.5 font-sans">
                            {b.advantages.slice(0, 2).map((adv, idx) => (
                              <div key={`gem-adv-${idx}`} className="text-xs text-gray-600 flex items-start gap-2">
                                <Check className="text-emerald-555 w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>{adv}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button
                          onClick={() => setSelectedBrand(b)}
                          className="w-full bg-black text-white font-semibold text-xs py-2.5 rounded-xl hover:bg-gray-850 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          Explore Brand Integrity <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ⚖️ tab: COMPARE */}
            {activeTab === 'compare' && (
              <ComparePanel onSelectBrand={setSelectedBrand} />
            )}

            {/* 📈 tab: INSIGHTS */}
            {activeTab === 'insights' && (
              <InsightsPanel />
            )}

            {/* 🤖 tab: ASK VOUCH */}
            {activeTab === 'ask' && (
              <AskVouchPanel />
            )}

            {/* 💼 tab: BUSINESS HUB */}
            {activeTab === 'business' && (
              <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
                
                {/* Header */}
                <div className="border-b border-gray-200 pb-5">
                  <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
                    <Briefcase className="text-black w-6 h-6" /> Vouch Business Hub
                  </h2>
                  <p className="text-sm text-gray-550 mt-1">
                    Submit your emerging brand for verification, obtain Enterprise Trust Reports, or configure sponsored profiles.
                  </p>
                </div>

                {/* Important Statement explicitly declaring brands cannot buy scores */}
                <div className="bg-slate-50 border-l-4 border-black rounded-r-2xl p-5 space-y-2 relative overflow-hidden shadow-3xs">
                  <div className="absolute top-0 right-0 p-4 select-none opacity-10 text-5xl">🗳️</div>
                  <h3 className="font-display font-bold text-gray-950 text-base">The Vouch Anti-Corruption Integrity Pledge</h3>
                  <p className="text-xs text-gray-650 leading-relaxed text-justify font-sans">
                    In order to maintain absolute consumer loyalty, <strong>Vouch strict guidelines state that brands are 100% prohibited from paying to increase their trust scores.</strong> Any verification subscription or premium onboarding simply handles physical audits, background certificate authentication, and legal tracking. The Dynamic Trust calculation is strictly governed by automated organic reviews, peer circle referrals, and public chemical/batch testing declarations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Onboarding Request Form */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
                    <h4 className="font-display font-bold text-gray-900 text-sm">Apply for Vouch Trust Audit</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Sincere, emerging brand builders receive zero-cost baseline audits. Let Vouch authenticate your ingredients and registries.
                    </p>

                    {bizSubmitted ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                        <h4 className="text-sm font-bold text-gray-900 font-display">Evaluation Scheduled!</h4>
                        <p className="text-xs text-gray-650 leading-relaxed">
                          We have registered <strong>{bizName}</strong>. Our audit desks will review your physical registration files and chemical batch reports over the week.
                        </p>
                        <button
                          onClick={() => {
                            setBizSubmitted(false);
                            setBizName('');
                            setBizWebsite('');
                          }}
                          className="text-xs text-gray-900 font-bold hover:underline pt-2 inline-block cursor-pointer"
                        >
                          Submit another brand
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!bizName.trim() || !bizWebsite.trim()) return;
                          setBizSubmitting(true);
                          setTimeout(() => {
                            setBizSubmitting(false);
                            setBizSubmitted(true);
                          }, 1500);
                        }}
                        className="space-y-3 pt-1"
                      >
                        <div>
                          <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1 font-bold">Brand Name</label>
                          <input
                            type="text"
                            required
                            value={bizName}
                            onChange={(e) => setBizName(e.target.value)}
                            placeholder="e.g. Moxie Beauty"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1 font-bold">Company Website</label>
                          <input
                            type="url"
                            required
                            value={bizWebsite}
                            onChange={(e) => setBizWebsite(e.target.value)}
                            placeholder="https://moxiebeauty.com"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5"
                          />
                        </div>

                        <div className="flex items-center gap-2 py-1.5 select-none">
                          <input id="pledge-agree" type="checkbox" required className="w-3.5 h-3.5 border-gray-300 rounded text-black focus:ring-black bg-gray-50 cursor-pointer" />
                          <label htmlFor="pledge-agree" className="text-[10px] text-gray-500 cursor-pointer leading-snug">
                            We confirm all formula claims and operational registries are authentic.
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={bizSubmitting}
                          className="w-full bg-black text-white font-semibold text-xs py-2.5 rounded-xl hover:bg-gray-850 active:scale-95 transition-all outline-none font-display cursor-pointer"
                        >
                          {bizSubmitting ? 'Evaluating Registry papers...' : 'Apply for Trust Assessment'}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Pricing Matrix / Tiers info */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
                    <h4 className="font-display font-bold text-gray-950 text-sm text-center">Business Solutions Framework</h4>
                    
                    <div className="space-y-3 pt-1">
                      {[
                        { title: '🛡️ Core Integrity Verification', price: 'Free Baseline', desc: 'Dermatological and agricultural audits showing lab safety certifications on public Vouch profile sheets.' },
                        { title: '📊 Enterprise Trust Reports', price: '$180 / mo', desc: 'Secure customer expectation analytics, NPS trends over 360 days, and deep comparison reports (competitor benching).' },
                        { title: '💎 Hidden Gem Showcase Badge', price: '$49 / mo', desc: 'For verified boutique/artisan brands confirming local operational compliance, showcasing to 48k+ monthly Vouch consumers.' }
                      ].map((tier, idx) => (
                        <div key={`tier-${idx}`} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex justify-between gap-4 shadow-3xs">
                          <div>
                            <h5 className="text-xs font-semibold text-gray-900">{tier.title}</h5>
                            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{tier.desc}</p>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-800 font-bold shrink-0 self-start bg-emerald-50 border border-emerald-100 rounded-md px-1.5 py-0.5">{tier.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
