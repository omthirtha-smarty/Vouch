export interface TrustBreakdown {
  transparency: number; // 0-100
  customerSatisfaction: number; // 0-100
  reviewAuthenticity: number; // 0-100
  consistency: number; // 0-100
  communityTrust: number; // 0-100
  trustedCircle: number; // 0-100
  brandMaturity: number; // 0-100
  scamRiskAdjustment: number; // -10 to 0
}

export interface TrustedCircleInfo {
  friendsRecommend: number;
  familyPurchased: number;
  mentorsTrust: number;
  expertsRecommend: number;
  score: number;
}

export interface AccountabilityInfo {
  expectationsMet: number; // percentage
  wouldBuyAgain: number; // percentage
  fulfilledPromises: number; // percentage
  reliableService: number; // percentage
  wouldRecommend: number; // percentage
}

export interface Brand {
  id: string;
  name: string;
  category: 'Beauty' | 'Hair Care' | 'Skincare' | 'Electronics' | 'Fashion' | 'Fitness' | 'Food' | 'Wellness' | 'Home' | 'Emerging Brands';
  subcategories: string[];
  needs: string[];
  yearsActive: number;
  isFictional: boolean;
  score: number;
  scamRisk: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Critical';
  scamRiskReason: string[];
  aiSummary: string;
  advantages: string[];
  disadvantages: string[];
  verifiedStatus: boolean;
  trustedCircle: TrustedCircleInfo;
  accountability: AccountabilityInfo;
  breakdown: TrustBreakdown;
  journey: { year: number; score: number }[];
  badges: string[];
}

export const BRANDS: Brand[] = [
  {
    id: 'dyson',
    name: 'Dyson',
    category: 'Electronics',
    subcategories: ['Home', 'Hair Care', 'Home Appliances'],
    needs: ['Hair Styling', 'Dry Hair', 'Air Purifiers', 'Vacuum Cleaners'],
    yearsActive: 31,
    isFictional: false,
    score: 89,
    scamRisk: 'Low',
    scamRiskReason: [
      'Verified business registration and operational facilities globally',
      'Strongly transparent pricing, warranty, and refund systems',
      'High operational consistency though premium price point triggers customer queries'
    ],
    aiSummary: 'Dyson shows exceptionally strong technical authenticity, backed by consistent customer support and a long history of engineering excellence. Its high-fidelity warranty tracking elevates community confidence, although its high pricing creates strict customer standards.',
    advantages: ['Outstanding engineering design', 'Excellent customer service & real warranty fulfillment', 'Pioneer of high-efficiency cyclones and brushless digital motors'],
    disadvantages: ['Extremely premium price point', 'Expensive replacement components', 'Aesthetic upgrades are frequent, leading to rapid model obsolescence'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 14,
      familyPurchased: 9,
      mentorsTrust: 6,
      expertsRecommend: 11,
      score: 91
    },
    accountability: {
      expectationsMet: 92,
      wouldBuyAgain: 88,
      fulfilledPromises: 94,
      reliableService: 90,
      wouldRecommend: 91
    },
    breakdown: {
      transparency: 92,
      customerSatisfaction: 88,
      reviewAuthenticity: 91,
      consistency: 94,
      communityTrust: 86,
      trustedCircle: 91,
      brandMaturity: 95,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2022, score: 86 },
      { year: 2023, score: 87 },
      { year: 2024, score: 88 },
      { year: 2025, score: 89 }
    ],
    badges: ['Pioneer Award', 'Expert Verified', 'Elite Engineer']
  },
  {
    id: 'mamaearth',
    name: 'Mamaearth',
    category: 'Skincare',
    subcategories: ['Hair Care', 'Beauty', 'Baby Care'],
    needs: ['Hair Fall', 'Dry Hair', 'Sensitive Skin', 'Natural Ingredients', 'Organic Foods'],
    yearsActive: 8,
    isFictional: false,
    score: 82,
    scamRisk: 'Moderate',
    scamRiskReason: [
      'Frequent consumer reviews mentioning inconsistent batch-to-batch product benefits',
      'Heavy marketing spend and influencer volume can obscure authentic consumer feedback',
      'Recent refund/customer-service delay complaints raised during seasonal sales'
    ],
    aiSummary: 'Mamaearth holds a reputable place as a toxin-free alternative but struggles with organic review consistency as massive influencer campaigns dilute organic review scores. Real-world promise fulfillment gets minor hits from batch variations.',
    advantages: ['Cruelty-free & plastic-friendly brand positioning', 'Very accessible pricing and wide physical presence', 'Rich chemical-free organic ingredients focus'],
    disadvantages: ['Variable user outcomes with hair fall / skincare lines', 'Overwhelming promotional feedback dilutes review authenticity', 'Customer desk takes longer response times during spikes'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 8,
      familyPurchased: 7,
      mentorsTrust: 3,
      expertsRecommend: 4,
      score: 74
    },
    accountability: {
      expectationsMet: 79,
      wouldBuyAgain: 74,
      fulfilledPromises: 81,
      reliableService: 77,
      wouldRecommend: 75
    },
    breakdown: {
      transparency: 84,
      customerSatisfaction: 79,
      reviewAuthenticity: 71,
      consistency: 80,
      communityTrust: 82,
      trustedCircle: 74,
      brandMaturity: 82,
      scamRiskAdjustment: -4
    },
    journey: [
      { year: 2022, score: 84 },
      { year: 2023, score: 83 },
      { year: 2024, score: 81 },
      { year: 2025, score: 82 }
    ],
    badges: ['Carbon Neutral', 'Cruelty Free']
  },
  {
    id: 'apple',
    name: 'Apple',
    category: 'Electronics',
    subcategories: ['Fitness', 'Home', 'Computers', 'Wearables'],
    needs: ['Wireless Earbuds', 'Sensitive Skin', 'Running Shoes', 'Smartwatches', 'Computers'],
    yearsActive: 50,
    isFictional: false,
    score: 95,
    scamRisk: 'Very Low',
    scamRiskReason: [
      'Unmatched structural maturity, long-term corporate governance, and registered entity status',
      'Ultra-clear business guidelines, end-to-end user privacy controls, and transparent statements',
      'Exceptional customer success consistency and highly verified review architectures'
    ],
    aiSummary: 'Apple sits at the absolute pinnacle of Brand Trust globally. Its robust physical store infrastructure, ironclad device privacy controls, and reliable engineering support validate its high scores. Review fraud is near-zero due to strict purchase verifications.',
    advantages: ['Perfect hardware-software ecosystem harmony', 'Highest security/privacy standards in consumer tech', 'Excellent post-purchase retail network & long lasting durability'],
    disadvantages: ['Ecosystem lock-in limits third-party hardware', 'Cost of repairs is exceptionally high without protection plans', 'Premium prices can act as a financial barrier'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 25,
      familyPurchased: 18,
      mentorsTrust: 12,
      expertsRecommend: 19,
      score: 97
    },
    accountability: {
      expectationsMet: 96,
      wouldBuyAgain: 94,
      fulfilledPromises: 97,
      reliableService: 93,
      wouldRecommend: 95
    },
    breakdown: {
      transparency: 96,
      customerSatisfaction: 94,
      reviewAuthenticity: 95,
      consistency: 98,
      communityTrust: 93,
      trustedCircle: 97,
      brandMaturity: 98,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2022, score: 94 },
      { year: 2023, score: 94 },
      { year: 2024, score: 95 },
      { year: 2025, score: 95 }
    ],
    badges: ['Industry Icon', 'Privacy Champion', 'Lifetime Reliability']
  },
  {
    id: 'nike',
    name: 'Nike',
    category: 'Fashion',
    subcategories: ['Fitness', 'Shoes', 'Athletic Wear'],
    needs: ['Running Shoes', 'Fitness', 'Wellness', 'Shoes'],
    yearsActive: 62,
    isFictional: false,
    score: 91,
    scamRisk: 'Very Low',
    scamRiskReason: [
      'Unassailable logistics validity and legal infrastructure',
      'Transparent returns policies and verified athlete/user reviews',
      'Extremely high consistency across physical and digital storefronts'
    ],
    aiSummary: 'Nike represents excellent reputational integrity in sportswear. Its long history of manufacturing tracking and structured product support protects it from scam risks. Social and expert backing is extremely dense.',
    advantages: ['Market leading research in orthopedic support & performance tech', 'Vibrant community circles and excellent return loyalty system', 'Worldwide athletic validation'],
    disadvantages: ['Certain limited drops trigger secondary resale scalping', 'High markup on classic legacy iterations', 'Ethical supply chain reports often draw public scrutiny'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 21,
      familyPurchased: 14,
      mentorsTrust: 8,
      expertsRecommend: 15,
      score: 92
    },
    accountability: {
      expectationsMet: 91,
      wouldBuyAgain: 89,
      fulfilledPromises: 93,
      reliableService: 88,
      wouldRecommend: 92
    },
    breakdown: {
      transparency: 90,
      customerSatisfaction: 91,
      reviewAuthenticity: 88,
      consistency: 93,
      communityTrust: 89,
      trustedCircle: 92,
      brandMaturity: 96,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2022, score: 90 },
      { year: 2023, score: 90 },
      { year: 2024, score: 91 },
      { year: 2025, score: 91 }
    ],
    badges: ['Athletic Gold Standard', 'Global Leader']
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'Skincare',
    subcategories: ['Beauty', 'Beautification', 'Wellness'],
    needs: ['Sensitive Skin', 'Hair Fall', 'Skincare', 'Dry Hair'],
    yearsActive: 4,
    isFictional: false,
    score: 90,
    scamRisk: 'Very Low',
    scamRiskReason: [
      'Highly transparent active percentage declarations on all bottles',
      'Clean evidence-based ingredient communication, zero marketing hyperbole',
      'Superb organic community word-of-mouth with negligible spam-bots'
    ],
    aiSummary: 'Minimalist is a highly praised science-backed skincare disruptor. By presenting precise ingredient percentages right on the label, they maintain excellent transparency and built high customer trust quickly.',
    advantages: ['Total formula disclosure on labels', 'Highly competitive pricing without middle-man fees', 'Zero artificial fragrance or coloring prevents skin irritations'],
    disadvantages: ['Primarily digital-first making in-person trial hard', 'Technical naming schema can be confusing for skincare novices', 'Fewer global offices make physical support tough'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 16,
      familyPurchased: 11,
      mentorsTrust: 5,
      expertsRecommend: 14,
      score: 93
    },
    accountability: {
      expectationsMet: 91,
      wouldBuyAgain: 90,
      fulfilledPromises: 92,
      reliableService: 87,
      wouldRecommend: 91
    },
    breakdown: {
      transparency: 98,
      customerSatisfaction: 89,
      reviewAuthenticity: 94,
      consistency: 91,
      communityTrust: 88,
      trustedCircle: 93,
      brandMaturity: 80,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2022, score: 81 },
      { year: 2023, score: 86 },
      { year: 2024, score: 88 },
      { year: 2025, score: 90 }
    ],
    badges: ['Transparency Star', 'Emerging Powerhouse', 'Science Backed']
  },
  {
    id: 'boat',
    name: 'boAt',
    category: 'Electronics',
    subcategories: ['Fitness', 'Wearables', 'Audio'],
    needs: ['Wireless Earbuds', 'Fitness', 'Electronics'],
    yearsActive: 10,
    isFictional: false,
    score: 78,
    scamRisk: 'Moderate',
    scamRiskReason: [
      'Recurring reviews reporting device failure or charging issues within 6-12 months',
      'Overextended product inventory leading to delayed firmwares or patches',
      'High volumes of positive generic reviews that trigger algorithmic authenticity checks'
    ],
    aiSummary: 'boAt maintains an impressive market share in consumer audio with budget solutions, but overall Trust suffers due to high device failure rates and warranty claim bottlenecks.',
    advantages: ['Highly affordable access to wireless sound tech', 'Outstanding baseline bass signature appealing to youth', 'Aggressive local marketing and high availability'],
    disadvantages: ['Hardware build compromises to keep prices low', 'Customer claims queue gets crowded resulting in customer friction', 'Shorter overall operational lifespan than premium rivals'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 11,
      familyPurchased: 12,
      mentorsTrust: 2,
      expertsRecommend: 3,
      score: 68
    },
    accountability: {
      expectationsMet: 76,
      wouldBuyAgain: 71,
      fulfilledPromises: 78,
      reliableService: 70,
      wouldRecommend: 74
    },
    breakdown: {
      transparency: 80,
      customerSatisfaction: 74,
      reviewAuthenticity: 70,
      consistency: 73,
      communityTrust: 80,
      trustedCircle: 68,
      brandMaturity: 84,
      scamRiskAdjustment: -3
    },
    journey: [
      { year: 2022, score: 82 },
      { year: 2023, score: 80 },
      { year: 2024, score: 79 },
      { year: 2025, score: 78 }
    ],
    badges: ['Youth Icon', 'Value Audio']
  },
  {
    id: 'samsung',
    name: 'Samsung',
    category: 'Electronics',
    subcategories: ['Home', 'Fitness', 'Wearables', 'Home Appliances'],
    needs: ['Smartwatches', 'Computers', 'Electronics', 'Vacuum Cleaners', 'Dry Hair'],
    yearsActive: 88,
    isFictional: false,
    score: 88,
    scamRisk: 'Low',
    scamRiskReason: [
      'Unmatched size and global physical warranty support centers',
      'Robust corporate history with secure online payment and checkout systems',
      'Slight delays in resolving software updates for older budget tiers causes mild support drag'
    ],
    aiSummary: 'Samsung is a massive global engineering giant with high-fidelity production processes. Its brand trust score is highly positive due to hardware dependability and massive customer infrastructure, with minor drops for slow updates on non-flagship devices.',
    advantages: ['Beautiful custom screen technologies and cameras', 'Widespread robust offline servicing centers worldwide', 'Comprehensive options stretching from budget to ultra-flagship'],
    disadvantages: ['Bloatware on certain sub-flagship lineups', 'Software upgrade cycles are shorter for entry tiers', 'Customer assistance paths are deeply call-center driven'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 19,
      familyPurchased: 15,
      mentorsTrust: 8,
      expertsRecommend: 12,
      score: 89
    },
    accountability: {
      expectationsMet: 89,
      wouldBuyAgain: 86,
      fulfilledPromises: 90,
      reliableService: 85,
      wouldRecommend: 87
    },
    breakdown: {
      transparency: 88,
      customerSatisfaction: 87,
      reviewAuthenticity: 89,
      consistency: 91,
      communityTrust: 86,
      trustedCircle: 89,
      brandMaturity: 98,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2022, score: 87 },
      { year: 2023, score: 88 },
      { year: 2024, score: 89 },
      { year: 2025, score: 88 }
    ],
    badges: ['Global Innovator', 'Legacy of Trust', 'Superb Screen']
  },
  {
    id: 'dove',
    name: 'Dove',
    category: 'Beauty',
    subcategories: ['Skincare', 'Hair Care', 'Hygiene'],
    needs: ['Sensitive Skin', 'Dry Hair', 'Skincare', 'Beauty'],
    yearsActive: 69,
    isFictional: false,
    score: 86,
    scamRisk: 'Low',
    scamRiskReason: [
      'Established dermatological endorsement and clinical verification processes',
      'Transparent formulations and easily readable ingredient files',
      'Excellent batch security and low delivery complaint levels'
    ],
    aiSummary: 'Dove is highly trusted for moisturizing and dermatological sensitivity solutions. Free from deceptive marketing, they use certified clinical claims which bolster consistent review points across age groups.',
    advantages: ['Highly mild pH-balanced formula ideal for sensitive barriers', 'Excellent value for money and global availability', 'Strong brand alignment with body positivity'],
    disadvantages: ['Some product formulas still contain sulfates/parabens', 'Standard packaging design lacks modern aesthetics', 'Slow to transition to entirely plastic-free lines'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 15,
      familyPurchased: 12,
      mentorsTrust: 6,
      expertsRecommend: 9,
      score: 87
    },
    accountability: {
      expectationsMet: 87,
      wouldBuyAgain: 85,
      fulfilledPromises: 89,
      reliableService: 86,
      wouldRecommend: 86
    },
    breakdown: {
      transparency: 88,
      customerSatisfaction: 85,
      reviewAuthenticity: 84,
      consistency: 89,
      communityTrust: 85,
      trustedCircle: 87,
      brandMaturity: 94,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2022, score: 85 },
      { year: 2023, score: 86 },
      { year: 2024, score: 86 },
      { year: 2025, score: 86 }
    ],
    badges: ['Dermatologist Trusted', 'Moisture Certified']
  },
  {
    id: 'plum',
    name: 'Plum Goodness',
    category: 'Beauty',
    subcategories: ['Skincare', 'Hair Care', 'Makeup'],
    needs: ['Sensitive Skin', 'Dry Hair', 'Organic Foods', 'Skincare'],
    yearsActive: 10,
    isFictional: false,
    score: 88,
    scamRisk: 'Low',
    scamRiskReason: [
      '100% vegan certified with strict cruelty-free compliance audits',
      'Consistent organic review ratings and solid custom customer service responses',
      'Secure, verified return logistics with transparent recycling rewards'
    ],
    aiSummary: 'Plum creates reliable, 100% vegan beauty solutions. Their highly active "Recycle" program rewards system keeps community trust high, accompanied by transparent, clean formulations.',
    advantages: ['Certified vegan and cruelty-free across the board', 'Excellent transparent packaging with standard recycling support', 'Great formulation safety with minimal chemical active spikes'],
    disadvantages: ['Physical stores are primarily limited to major cities', 'Delicate natural-scents might not appeal to everyone', 'Pricing is slightly higher than standard mass brands'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 12,
      familyPurchased: 8,
      mentorsTrust: 4,
      expertsRecommend: 8,
      score: 85
    },
    accountability: {
      expectationsMet: 89,
      wouldBuyAgain: 87,
      fulfilledPromises: 90,
      reliableService: 88,
      wouldRecommend: 88
    },
    breakdown: {
      transparency: 91,
      customerSatisfaction: 87,
      reviewAuthenticity: 88,
      consistency: 89,
      communityTrust: 86,
      trustedCircle: 85,
      brandMaturity: 85,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2022, score: 85 },
      { year: 2023, score: 86 },
      { year: 2024, score: 87 },
      { year: 2025, score: 88 }
    ],
    badges: ['Vegan Certified', 'Green Clean Award']
  },
  {
    id: 'tresemme',
    name: 'TRESemmé',
    category: 'Hair Care',
    subcategories: ['Beauty', 'Hair Styling'],
    needs: ['Dry Hair', 'Hair Styling', 'Hair Fall'],
    yearsActive: 70,
    isFictional: false,
    score: 85,
    scamRisk: 'Low',
    scamRiskReason: [
      'Consistent retail supply and multi-decade commercial record',
      'Clear allergen profiling and ingredient list accessibility on packages',
      'Established, standard customer support networks through parent Unilever'
    ],
    aiSummary: 'TRESemmé is a long-standing hair care staple that successfully delivers salon-style outcomes at home. With high formulation consistency, they score well on reliability but lose minor points for slow moves to green solutions.',
    advantages: ['Excellent conditioning outcomes for coarse/dry hair types', 'Outstanding value per ounce', 'Professional-salon grade styling support'],
    disadvantages: ['Not entirely free of heavy silicone bases', 'Mainstream packaging is entirely plastic-heavy with minimal recycling incentives', 'Few direct-to-consumer digital channels'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 13,
      familyPurchased: 11,
      mentorsTrust: 4,
      expertsRecommend: 7,
      score: 83
    },
    accountability: {
      expectationsMet: 86,
      wouldBuyAgain: 84,
      fulfilledPromises: 88,
      reliableService: 85,
      wouldRecommend: 84
    },
    breakdown: {
      transparency: 84,
      customerSatisfaction: 85,
      reviewAuthenticity: 85,
      consistency: 90,
      communityTrust: 82,
      trustedCircle: 83,
      brandMaturity: 93,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2022, score: 84 },
      { year: 2023, score: 85 },
      { year: 2024, score: 85 },
      { year: 2025, score: 85 }
    ],
    badges: ['Salon Classic', 'Legacy Stylist']
  },
  {
    id: 'loreal',
    name: "L'Oréal",
    category: 'Hair Care',
    subcategories: ['Beauty', 'Skincare', 'Cosmetics'],
    needs: ['Hair Styling', 'Dry Hair', 'Skincare', 'Beauty'],
    yearsActive: 110,
    isFictional: false,
    score: 87,
    scamRisk: 'Low',
    scamRiskReason: [
      'Massive global security validation and scientific laboratory background',
      'Highly structured claims backed by multiple third-party dermatology trials',
      'Extremely safe transactional and direct customer response modules'
    ],
    aiSummary: "L'Oreal represents multi-era styling consistency with deep funding in raw safety research. They show highly consistent product delivery although they face minor community concerns regarding corporate organic labeling.",
    advantages: ['Immense research budget ensures stable formulation quality', 'Extremely diverse ranges for every age, hair, and style', 'Verified shelf life and active stability'],
    disadvantages: ['Fuzzy differentiation between high-end chemical actives vs marketing titles', 'Slow direct communication lines due to giant corporate size', 'High plastic footprint across retail networks'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 18,
      familyPurchased: 15,
      mentorsTrust: 7,
      expertsRecommend: 11,
      score: 88
    },
    accountability: {
      expectationsMet: 88,
      wouldBuyAgain: 86,
      fulfilledPromises: 89,
      reliableService: 84,
      wouldRecommend: 87
    },
    breakdown: {
      transparency: 82,
      customerSatisfaction: 88,
      reviewAuthenticity: 84,
      consistency: 92,
      communityTrust: 84,
      trustedCircle: 88,
      brandMaturity: 98,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2022, score: 86 },
      { year: 2023, score: 86 },
      { year: 2024, score: 87 },
      { year: 2025, score: 87 }
    ],
    badges: ['Global Beauty Giant', 'Clinical Approved']
  },
  {
    id: 'moxie-beauty',
    name: 'Moxie Beauty',
    category: 'Hair Care',
    subcategories: ['Beauty', 'Emerging Brands'],
    needs: ['Hair Cream', 'Dry Hair', 'Hair Styling', 'Dry Hair', 'Hair Fall'],
    yearsActive: 2,
    isFictional: false,
    score: 92,
    scamRisk: 'Very Low',
    scamRiskReason: [
      'Direct, friendly founders and team transparently showing manufacturing workflows',
      'Certified and audited clean testing protocols verified independently',
      'Outstanding customer care loop that handles claims and exchanges individually'
    ],
    aiSummary: 'Moxie Beauty is a rising star in hair styling products. Highly customized recipes targeting specific hair challenges like dry hair and curls, combined with beautiful, authentic, non-incentivized feedback circles, generate excellent trust.',
    advantages: ['Highly precise custom hydration lines for textured hair', 'Extreme sincerity in customer engagement and feedback loops', 'Clean, non-toxic, lightweight hair protectants'],
    disadvantages: ['Limited offline distribution network', 'High demand occasionally leads to short inventory outages', 'Price per ounce is higher than mass drug store brands'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 12,
      familyPurchased: 8,
      mentorsTrust: 4,
      expertsRecommend: 7,
      score: 96
    },
    accountability: {
      expectationsMet: 94,
      wouldBuyAgain: 92,
      fulfilledPromises: 95,
      reliableService: 93,
      wouldRecommend: 94
    },
    breakdown: {
      transparency: 96,
      customerSatisfaction: 92,
      reviewAuthenticity: 95,
      consistency: 90,
      communityTrust: 91,
      trustedCircle: 96,
      brandMaturity: 72,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2024, score: 89 },
      { year: 2025, score: 92 }
    ],
    badges: ['Hidden Gem High recommendation', 'Founder Sincerity', 'Texture Perfect']
  },

  // FICTIONAL BRANDS (HIDDEN GEMS)
  {
    id: 'glownest',
    name: 'GlowNest',
    category: 'Emerging Brands',
    subcategories: ['Skincare', 'Beauty'],
    needs: ['Sensitive Skin', 'Skincare', 'Beauty'],
    yearsActive: 2,
    isFictional: true,
    score: 89,
    scamRisk: 'Very Low',
    scamRiskReason: [
      'Small batch manufacturing with public batch-testing records',
      'Independently owned, direct to consumer with zero complex policy strings',
      'Highly conversational and prompt creator answers on chat networks'
    ],
    aiSummary: 'GlowNest focuses on simple, skin barrier-repair formulations with completely transparent testing trails. Their small-batch approach keeps chemical active levels extremely stable.',
    advantages: ['Exceptional performance on hyper-sensitive models', 'Direct, personal support lines with formulators', 'Fresh, active antioxidants that are blended on demand'],
    disadvantages: ['Digital only checkout lanes', 'Must be used within 6 months due to cold-pressed active bases', 'No brick and mortar testing counters'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 8,
      familyPurchased: 4,
      mentorsTrust: 3,
      expertsRecommend: 6,
      score: 88
    },
    accountability: {
      expectationsMet: 90,
      wouldBuyAgain: 88,
      fulfilledPromises: 91,
      reliableService: 92,
      wouldRecommend: 90
    },
    breakdown: {
      transparency: 96,
      customerSatisfaction: 90,
      reviewAuthenticity: 93,
      consistency: 87,
      communityTrust: 86,
      trustedCircle: 88,
      brandMaturity: 70,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2024, score: 86 },
      { year: 2025, score: 89 }
    ],
    badges: ['Dermatology Approved Fictional', 'Organic Wave', 'DTC Star']
  },
  {
    id: 'herbaura',
    name: 'HerbAura',
    category: 'Emerging Brands',
    subcategories: ['Wellness', 'Food', 'Skincare'],
    needs: ['Organic Foods', 'Sensitive Skin', 'Dry Hair', 'Wellness'],
    yearsActive: 3,
    isFictional: true,
    score: 87,
    scamRisk: 'Very Low',
    scamRiskReason: [
      'Verified farm-source trace maps showing organic origins',
      'Fair-trade auditing records registered with local farming co-ops',
      'Real-time customer logistics tracking and packaging materials are fully biodegradable'
    ],
    aiSummary: 'HerbAura combines traditional herbal processes with modern organic farming safety. They declare fair-trade origins on all goods and support transparent local employment.',
    advantages: ['Ethical farm-to-door delivery pathways', 'Exceptional bio-availability of supplements', 'Zero non-natural preservatives or binders used'],
    disadvantages: ['Higher cost due to small-scale custom organic harvests', 'Taste/scents are organic with zero chemical flavorings', 'Shorter shelf life requires small monthly buying habits'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 7,
      familyPurchased: 5,
      mentorsTrust: 4,
      expertsRecommend: 5,
      score: 86
    },
    accountability: {
      expectationsMet: 88,
      wouldBuyAgain: 86,
      fulfilledPromises: 89,
      reliableService: 87,
      wouldRecommend: 88
    },
    breakdown: {
      transparency: 94,
      customerSatisfaction: 86,
      reviewAuthenticity: 90,
      consistency: 85,
      communityTrust: 85,
      trustedCircle: 86,
      brandMaturity: 74,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2023, score: 84 },
      { year: 2024, score: 85 },
      { year: 2025, score: 87 }
    ],
    badges: ['Earth Keeper', 'Fair Trade Certified']
  },
  {
    id: 'aurawell',
    name: 'AuraWell',
    category: 'Emerging Brands',
    subcategories: ['Wellness', 'Fitness'],
    needs: ['Wellness', 'Fitness', 'Organic Foods'],
    yearsActive: 1,
    isFictional: true,
    score: 88,
    scamRisk: 'Very Low',
    scamRiskReason: [
      'Open lab books published on website detailing heavy metal testing',
      'Zero-fee subscription management with single-click custom cancellation plans',
      'Direct, founder-led video updates detailing future pipeline structures'
    ],
    aiSummary: 'AuraWell focuses on functional nutrition and performance hydration. By printing active lab analysis sheets online, they instantly gained credibility in the highly controversial dietary supplements category.',
    advantages: ['No hidden proprietary blends—total clarity on milligrams', 'Strict third-party heavy-metal and pesticide testing records', 'Eco-friendly compostability containers with refill options'],
    disadvantages: ['Only premium subscription slots are available', 'Extremely limited production batches', 'Some elements take longer transport times during raw material shortage'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 6,
      familyPurchased: 4,
      mentorsTrust: 3,
      expertsRecommend: 6,
      score: 89
    },
    accountability: {
      expectationsMet: 90,
      wouldBuyAgain: 87,
      fulfilledPromises: 91,
      reliableService: 89,
      wouldRecommend: 88
    },
    breakdown: {
      transparency: 97,
      customerSatisfaction: 88,
      reviewAuthenticity: 92,
      consistency: 84,
      communityTrust: 86,
      trustedCircle: 89,
      brandMaturity: 65,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2025, score: 88 }
    ],
    badges: ['Purity Gold', 'DTC Innovator']
  },
  {
    id: 'econest',
    name: 'EcoNest',
    category: 'Emerging Brands',
    subcategories: ['Home', 'Wellness'],
    needs: ['Home', 'Air Purifiers', 'Sensitive Skin'],
    yearsActive: 4,
    isFictional: true,
    score: 86,
    scamRisk: 'Low',
    scamRiskReason: [
      'Verified zero-plastic shipping lines with offset reports',
      'FSC certified wood logs and natural organic cotton materials',
      'Traceable raw material pathways with minor shipping hiccups in high-volume months'
    ],
    aiSummary: 'EcoNest designs sustainable domestic accents and home air purifiers. Their materials are completely natural which earns immense gratitude from allergen-sensitive individuals.',
    advantages: ['Beautiful custom artisan handcrafting styling', 'Incredibly clean chemical footprint—zero toxins used', 'Fully carbon-neutral delivery networks'],
    disadvantages: ['Artisanal scaling is slower leading to backorders', 'Slightly higher shipping costs for regional territories', 'Higher initial investment than mass plastic furnishings'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 9,
      familyPurchased: 6,
      mentorsTrust: 4,
      expertsRecommend: 5,
      score: 84
    },
    accountability: {
      expectationsMet: 88,
      wouldBuyAgain: 85,
      fulfilledPromises: 88,
      reliableService: 83,
      wouldRecommend: 86
    },
    breakdown: {
      transparency: 92,
      customerSatisfaction: 85,
      reviewAuthenticity: 88,
      consistency: 84,
      communityTrust: 84,
      trustedCircle: 84,
      brandMaturity: 76,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2022, score: 82 },
      { year: 2023, score: 84 },
      { year: 2024, score: 85 },
      { year: 2025, score: 86 }
    ],
    badges: ['Green House Award', 'Zero Waste Brand']
  },
  {
    id: 'pureleaf-organics',
    name: 'PureLeaf Organics',
    category: 'Emerging Brands',
    subcategories: ['Food', 'Wellness'],
    needs: ['Organic Foods', 'Wellness', 'Fitness'],
    yearsActive: 3,
    isFictional: true,
    score: 91,
    scamRisk: 'Very Low',
    scamRiskReason: [
      'Certified organic agricultural credentials with trace tags on every label',
      '100% fair pricing to farmers with published annual audit files',
      'Zero refined sugar declaration and non-processed natural preservation'
    ],
    aiSummary: 'PureLeaf Organics offers highly traceable food items, direct from agricultural co-operatives. They verify every crop rotation, maintaining a zero pesticide chemical record.',
    advantages: ['True traceability—scan the bottle to see the farmer', 'Outstanding natural flavor preservation', 'Zero hidden oils, high in essential complex fibers'],
    disadvantages: ['Limited seasonal selection availability', 'Deteriorates quickly if not refrigerated properly', 'Short delivery windows in rural locations'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 11,
      familyPurchased: 8,
      mentorsTrust: 5,
      expertsRecommend: 8,
      score: 94
    },
    accountability: {
      expectationsMet: 93,
      wouldBuyAgain: 90,
      fulfilledPromises: 94,
      reliableService: 90,
      wouldRecommend: 92
    },
    breakdown: {
      transparency: 98,
      customerSatisfaction: 91,
      reviewAuthenticity: 93,
      consistency: 88,
      communityTrust: 89,
      trustedCircle: 94,
      brandMaturity: 74,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2023, score: 87 },
      { year: 2024, score: 89 },
      { year: 2025, score: 91 }
    ],
    badges: ['Soil Guard Award', '100% Pure Certified']
  },
  {
    id: 'bloomtheory',
    name: 'BloomTheory',
    category: 'Emerging Brands',
    subcategories: ['Beauty', 'Skincare'],
    needs: ['Sensitive Skin', 'Skincare', 'Beauty'],
    yearsActive: 2,
    isFictional: true,
    score: 87,
    scamRisk: 'Very Low',
    scamRiskReason: [
      'Botanical source registries verified and tested in clean laboratory modules',
      'Minimalist packaging reduces chemical reactions with cosmetic tubes',
      'Extremely high positive responsiveness to product feedback circles'
    ],
    aiSummary: 'BloomTheory focuses on botanical floral solutions using high-tech sub-critical fluid extraction. By omitting heavy artificial coloring or synthetics, they protect sensitive skin models.',
    advantages: ['Clean modern extraction processes preserves raw potency', 'Delicate natural-flower skin calming characteristics', 'Highly aesthetic sustainable glass pump styling'],
    disadvantages: ['Fewer SKU varieties than large beauty corporations', 'Requires careful storage away from direct solar rays', 'Rare botanical extracts trigger occasional stock delays'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 6,
      familyPurchased: 5,
      mentorsTrust: 3,
      expertsRecommend: 5,
      score: 85
    },
    accountability: {
      expectationsMet: 88,
      wouldBuyAgain: 86,
      fulfilledPromises: 89,
      reliableService: 88,
      wouldRecommend: 87
    },
    breakdown: {
      transparency: 94,
      customerSatisfaction: 87,
      reviewAuthenticity: 91,
      consistency: 84,
      communityTrust: 83,
      trustedCircle: 85,
      brandMaturity: 70,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2024, score: 84 },
      { year: 2025, score: 87 }
    ],
    badges: ['Botanical Triumph', 'Premium Glass Label']
  },
  {
    id: 'root-ritual',
    name: 'Root & Ritual',
    category: 'Emerging Brands',
    subcategories: ['Hair Care', 'Wellness'],
    needs: ['Dry Hair', 'Hair Fall', 'Sensitive Skin'],
    yearsActive: 3,
    isFictional: true,
    score: 89,
    scamRisk: 'Very Low',
    scamRiskReason: [
      'Ayurvedic and modern trichologist verified formula lists',
      'Cold-pressed oil sources, fully traceable to small-scale wild harvesting',
      'No added foaming chemicals or sulfates prevents root thinning issues'
    ],
    aiSummary: 'Root & Ritual is an emerging hair care giant focusing on deep scalp health. They use premium wild-harvested herbs, protecting users from chemical active irritabilities.',
    advantages: ['Deep nourishment properties with clean herbal oils', 'Helps build thicker textures naturally', 'Very active customer support detailing custom-oiling schemas'],
    disadvantages: ['Needs active massage rituals—not a simple quick-wash model', 'Herbal fragrance can be intense for modern scent tastes', 'Drip caps are plastic-free which requires manual control'],
    verifiedStatus: true,
    trustedCircle: {
      friendsRecommend: 9,
      familyPurchased: 7,
      mentorsTrust: 4,
      expertsRecommend: 6,
      score: 90
    },
    accountability: {
      expectationsMet: 90,
      wouldBuyAgain: 88,
      fulfilledPromises: 91,
      reliableService: 89,
      wouldRecommend: 90
    },
    breakdown: {
      transparency: 96,
      customerSatisfaction: 89,
      reviewAuthenticity: 92,
      consistency: 86,
      communityTrust: 86,
      trustedCircle: 90,
      brandMaturity: 75,
      scamRiskAdjustment: 0
    },
    journey: [
      { year: 2023, score: 85 },
      { year: 2024, score: 87 },
      { year: 2025, score: 89 }
    ],
    badges: ['Traditional Crown', 'Pure Scalp Approved']
  }
];

export interface FictionalNeedMap {
  [need: string]: string[]; // brand IDs that fit this need
}

export const CATEGORY_MAP = {
  'Beauty': ['dove', 'plum', 'loreal', 'moxie-beauty', 'bloomtheory'],
  'Hair Care': ['dyson', 'mamaearth', 'minimalist', 'tresemme', 'loreal', 'moxie-beauty', 'root-ritual'],
  'Skincare': ['mamaearth', 'minimalist', 'dove', 'plum', 'glownest', 'bloomtheory', 'root-ritual'],
  'Electronics': ['dyson', 'apple', 'boat', 'samsung'],
  'Fashion': ['nike', 'apple'],
  'Fitness': ['nike', 'apple', 'boat', 'samsung', 'aurawell', 'pureleaf-organics'],
  'Food': ['pureleaf-organics', 'herbaura'],
  'Wellness': ['herbaura', 'aurawell', 'econest', 'pureleaf-organics', 'root-ritual', 'minimalist'],
  'Home': ['dyson', 'apple', 'samsung', 'econest'],
  'Emerging Brands': ['moxie-beauty', 'glownest', 'herbaura', 'aurawell', 'econest', 'pureleaf-organics', 'bloomtheory', 'root-ritual']
};
