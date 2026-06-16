import streamlit as st
import pandas as pd
import json

# Set premium Streamlit page styles
st.set_page_config(
    page_title="VOUCH – Trust Before Transaction",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom premium CSS injection to align with CRED/Stripe/Apple styles (dark minimalist design)
st.markdown("""
<style>
    /* Dark Slate Canvas styles */
    .stApp {
        background-color: #0A0D10;
        color: #E4E6EB;
    }
    h1, h2, h3, h4, h5, h6 {
        color: #FFFFFF !important;
        font-family: 'Space Grotesk', sans-serif;
    }
    .stSidebar {
        background-color: #0D1217 !important;
        border-right: 1px solid #1B232D;
    }
    .stButton>button {
        background-color: #151D26 !important;
        color: #14B8A6 !important;
        border: 1px solid #232F3D !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        background-color: #1E2733 !important;
        border-color: #14B8A6 !important;
        color: #FFFFFF !important;
        box-shadow: 0 0 10px rgba(20, 184, 166, 0.2);
    }
    .stTextInput>div>div>input {
        background-color: #11161D !important;
        color: #FFFFFF !important;
        border: 1px solid #1F2731 !important;
        border-radius: 10px !important;
    }
    .stSelectbox>div>div>div {
        background-color: #11161D !important;
        color: #FFFFFF !important;
        border: 1px solid #1F2731 !important;
    }
    /* Simple Cards */
    .brand-card {
        background-color: #0E1217;
        border: 1px solid #1D2530;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 15px;
        transition: border-color 0.3s ease;
    }
    .brand-card:hover {
        border-color: #14B8A6;
    }
    .trust-score-badge {
        font-size: 32px;
        font-weight: 900;
        color: #14B8A6;
        line-height: 1;
    }
    .scam-warning {
        background-color: rgba(244, 63, 94, 0.1);
        border: 1px solid rgba(244, 63, 94, 0.3);
        border-radius: 10px;
        padding: 15px;
        color: #FDA4AF;
    }
    .scam-success {
        background-color: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 10px;
        padding: 15px;
        color: #6EE7B7;
    }
</style>
""", unsafe_allow_html=True)

# 1. CORE BRAND TRUST DATASET
BRANDS_DB = [
    {
        "id": "dyson",
        "name": "Dyson",
        "category": "Electronics",
        "subcategories": ["Home", "Hair Care", "Home Appliances"],
        "needs": ["Hair Styling", "Dry Hair", "Air Purifiers", "Vacuum Cleaners"],
        "yearsActive": 31,
        "isFictional": False,
        "score": 89,
        "scamRisk": "Low",
        "scamRiskReason": [
            "Verified business registration and operational facilities globally",
            "Strongly transparent pricing, warranty, and refund systems",
            "High operational consistency though premium price point triggers customer queries"
        ],
        "aiSummary": "Dyson shows exceptionally strong technical authenticity, backed by consistent customer support and a long history of engineering excellence. Its high-fidelity warranty tracking elevates community confidence, although its high pricing creates strict customer standards.",
        "advantages": ["Outstanding engineering design", "Excellent customer service & real warranty fulfillment", "Pioneer of high-efficiency cyclones and brushless digital motors"],
        "disadvantages": ["Extremely premium price point", "Expensive replacement components", "Aesthetic upgrades are frequent, leading to rapid model obsolescence"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 14,
            "familyPurchased": 9,
            "mentorsTrust": 6,
            "expertsRecommend": 11,
            "score": 91
        },
        "accountability": {
            "expectationsMet": 92,
            "wouldBuyAgain": 88,
            "fulfilledPromises": 94,
            "reliableService": 90,
            "wouldRecommend": 91
        },
        "breakdown": {
            "transparency": 92,
            "customerSatisfaction": 88,
            "reviewAuthenticity": 91,
            "consistency": 94,
            "communityTrust": 86,
            "trustedCircle": 91,
            "brandMaturity": 95,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2022, "score": 86},
            {"year": 2023, "score": 87},
            {"year": 2024, "score": 88},
            {"year": 2025, "score": 89}
        ],
        "badges": ["Pioneer Award", "Expert Verified", "Elite Engineer"]
    },
    {
        "id": "mamaearth",
        "name": "Mamaearth",
        "category": "Skincare",
        "subcategories": ["Hair Care", "Beauty", "Baby Care"],
        "needs": ["Hair Fall", "Dry Hair", "Sensitive Skin", "Natural Ingredients", "Organic Foods"],
        "yearsActive": 8,
        "isFictional": False,
        "score": 82,
        "scamRisk": "Moderate",
        "scamRiskReason": [
            "Frequent consumer reviews mentioning inconsistent batch-to-batch product benefits",
            "Heavy marketing spend and influencer volume can obscure authentic consumer feedback",
            "Recent refund/customer-service delay complaints raised during seasonal sales"
        ],
        "aiSummary": "Mamaearth holds a reputable place as a toxin-free alternative but struggles with organic review consistency as massive influencer campaigns dilute organic review scores. Real-world promise fulfillment gets minor hits from batch variations.",
        "advantages": ["Cruelty-free & plastic-friendly brand positioning", "Very accessible pricing and wide physical presence", "Rich chemical-free organic ingredients focus"],
        "disadvantages": ["Variable user outcomes with hair fall / skincare lines", "Overwhelming promotional feedback dilutes review authenticity", "Customer desk takes longer response times during spikes"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 8,
            "familyPurchased": 7,
            "mentorsTrust": 3,
            "expertsRecommend": 4,
            "score": 74
        },
        "accountability": {
            "expectationsMet": 79,
            "wouldBuyAgain": 74,
            "fulfilledPromises": 81,
            "reliableService": 77,
            "wouldRecommend": 75
        },
        "breakdown": {
            "transparency": 84,
            "customerSatisfaction": 79,
            "reviewAuthenticity": 71,
            "consistency": 80,
            "communityTrust": 82,
            "trustedCircle": 74,
            "brandMaturity": 82,
            "scamRiskAdjustment": -4
        },
        "journey": [
            {"year": 2022, "score": 84},
            {"year": 2023, "score": 83},
            {"year": 2024, "score": 81},
            {"year": 2025, "score": 82}
        ],
        "badges": ["Carbon Neutral", "Cruelty Free"]
    },
    {
        "id": "apple",
        "name": "Apple",
        "category": "Electronics",
        "subcategories": ["Fitness", "Home", "Computers", "Wearables"],
        "needs": ["Wireless Earbuds", "Sensitive Skin", "Running Shoes", "Smartwatches", "Computers"],
        "yearsActive": 50,
        "isFictional": False,
        "score": 95,
        "scamRisk": "Very Low",
        "scamRiskReason": [
            "Unmatched structural maturity, long-term corporate governance, and registered entity status",
            "Ultra-clear business guidelines, end-to-end user privacy controls, and transparent statements",
            "Exceptional customer success consistency and highly verified review architectures"
        ],
        "aiSummary": "Apple sits at the absolute pinnacle of Brand Trust globally. Its robust physical store infrastructure, ironclad device privacy controls, and reliable engineering support validate its high scores. Review fraud is near-zero due to strict purchase verifications.",
        "advantages": ["Perfect hardware-software ecosystem harmony", "Highest security/privacy standards in consumer tech", "Excellent post-purchase retail network & long lasting durability"],
        "disadvantages": ["Ecosystem lock-in limits third-party hardware", "Cost of repairs is exceptionally high without protection plans", "Premium prices can act as a financial barrier"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 25,
            "familyPurchased": 18,
            "mentorsTrust": 12,
            "expertsRecommend": 19,
            "score": 97
        },
        "accountability": {
            "expectationsMet": 96,
            "wouldBuyAgain": 94,
            "fulfilledPromises": 97,
            "reliableService": 93,
            "wouldRecommend": 95
        },
        "breakdown": {
            "transparency": 96,
            "customerSatisfaction": 94,
            "reviewAuthenticity": 95,
            "consistency": 98,
            "communityTrust": 93,
            "trustedCircle": 97,
            "brandMaturity": 98,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2022, "score": 94},
            {"year": 2023, "score": 94},
            {"year": 2024, "score": 95},
            {"year": 2025, "score": 95}
        ],
        "badges": ["Industry Icon", "Privacy Champion", "Lifetime Reliability"]
    },
    {
        "id": "nike",
        "name": "Nike",
        "category": "Fashion",
        "subcategories": ["Fitness", "Shoes", "Athletic Wear"],
        "needs": ["Running Shoes", "Fitness", "Wellness", "Shoes"],
        "yearsActive": 62,
        "isFictional": False,
        "score": 91,
        "scamRisk": "Very Low",
        "scamRiskReason": [
            "Unassailable logistics validity and legal infrastructure",
            "Transparent returns policies and verified athlete/user reviews",
            "Extremely high consistency across physical and digital storefronts"
        ],
        "aiSummary": "Nike represents excellent reputational integrity in sportswear. Its long history of manufacturing tracking and structured product support protects it from scam risks. Social and expert backing is extremely dense.",
        "advantages": ["Market leading research in orthopedic support & performance tech", "Vibrant community circles and excellent return loyalty system", "Worldwide athletic validation"],
        "disadvantages": ["Certain limited drops trigger secondary resale scalping", "High markup on classic legacy iterations", "Ethical supply chain reports often draw public scrutiny"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 21,
            "familyPurchased": 14,
            "mentorsTrust": 8,
            "expertsRecommend": 15,
            "score": 92
        },
        "accountability": {
            "expectationsMet": 91,
            "wouldBuyAgain": 89,
            "fulfilledPromises": 93,
            "reliableService": 88,
            "wouldRecommend": 92
        },
        "breakdown": {
            "transparency": 90,
            "customerSatisfaction": 91,
            "reviewAuthenticity": 88,
            "consistency": 93,
            "communityTrust": 89,
            "trustedCircle": 92,
            "brandMaturity": 96,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2022, "score": 90},
            {"year": 2023, "score": 90},
            {"year": 2024, "score": 91},
            {"year": 2025, "score": 91}
        ],
        "badges": ["Athletic Gold Standard", "Global Leader"]
    },
    {
        "id": "minimalist",
        "name": "Minimalist",
        "category": "Skincare",
        "subcategories": ["Beauty", "Wellness"],
        "needs": ["Sensitive Skin", "Hair Fall", "Skincare", "Dry Hair"],
        "yearsActive": 4,
        "isFictional": False,
        "score": 90,
        "scamRisk": "Very Low",
        "scamRiskReason": [
            "Highly transparent active percentage declarations on all bottles",
            "Clean evidence-based ingredient communication, zero marketing hyperbole",
            "Superb organic community word-of-mouth with negligible spam-bots"
        ],
        "aiSummary": "Minimalist is a highly praised science-backed skincare disruptor. By presenting precise ingredient percentages right on the label, they maintain excellent transparency and built high customer trust quickly.",
        "advantages": ["Total formula disclosure on labels", "Highly competitive pricing without middle-man fees", "Zero artificial fragrance or coloring prevents skin irritations"],
        "disadvantages": ["Primarily digital-first making in-person trial hard", "Technical naming schema can be confusing for skincare novices", "Fewer global offices make physical support tough"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 16,
            "familyPurchased": 11,
            "mentorsTrust": 5,
            "expertsRecommend": 14,
            "score": 93
        },
        "accountability": {
            "expectationsMet": 91,
            "wouldBuyAgain": 90,
            "fulfilledPromises": 92,
            "reliableService": 87,
            "wouldRecommend": 91
        },
        "breakdown": {
            "transparency": 98,
            "customerSatisfaction": 89,
            "reviewAuthenticity": 94,
            "consistency": 91,
            "communityTrust": 88,
            "trustedCircle": 93,
            "brandMaturity": 80,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2022, "score": 81},
            {"year": 2023, "score": 86},
            {"year": 2024, "score": 88},
            {"year": 2025, "score": 90}
        ],
        "badges": ["Transparency Star", "Science Backed"]
    },
    {
        "id": "boat",
        "name": "boAt",
        "category": "Electronics",
        "subcategories": ["Fitness", "Wearables", "Audio"],
        "needs": ["Wireless Earbuds", "Fitness", "Electronics"],
        "yearsActive": 10,
        "isFictional": False,
        "score": 78,
        "scamRisk": "Moderate",
        "scamRiskReason": [
            "Recurring reviews reporting device failure or charging issues within 6-12 months",
            "Overextended product inventory leading to delayed firmwares or patches",
            "High volumes of positive generic reviews that trigger algorithmic authenticity checks"
        ],
        "aiSummary": "boAt maintains an impressive market share in consumer audio with budget solutions, but overall Trust suffers due to high device failure rates and warranty claim bottlenecks.",
        "advantages": ["Highly affordable access to wireless sound tech", "Outstanding baseline bass signature appealing to youth", "Aggressive local marketing and high availability"],
        "disadvantages": ["Hardware build compromises to keep prices low", "Customer claims queue gets crowded resulting in customer friction", "Shorter overall operational lifespan than premium rivals"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 11,
            "familyPurchased": 12,
            "mentorsTrust": 2,
            "expertsRecommend": 3,
            "score": 68
        },
        "accountability": {
            "expectationsMet": 76,
            "wouldBuyAgain": 71,
            "fulfilledPromises": 78,
            "reliableService": 70,
            "wouldRecommend": 74
        },
        "breakdown": {
            "transparency": 80,
            "customerSatisfaction": 74,
            "reviewAuthenticity": 70,
            "consistency": 73,
            "communityTrust": 80,
            "trustedCircle": 68,
            "brandMaturity": 84,
            "scamRiskAdjustment": -3
        },
        "journey": [
            {"year": 2022, "score": 82},
            {"year": 2023, "score": 80},
            {"year": 2024, "score": 79},
            {"year": 2025, "score": 78}
        ],
        "badges": ["Youth Icon", "Value Audio"]
    },
    {
        "id": "samsung",
        "name": "Samsung",
        "category": "Electronics",
        "subcategories": ["Home", "Fitness", "Wearables", "Home Appliances"],
        "needs": ["Smartwatches", "Computers", "Electronics", "Vacuum Cleaners", "Dry Hair"],
        "yearsActive": 88,
        "isFictional": False,
        "score": 88,
        "scamRisk": "Low",
        "scamRiskReason": [
            "Unmatched size and global physical warranty support centers",
            "Robust corporate history with secure online payment and checkout systems",
            "Slight delays in resolving software updates for older budget tiers causes mild support drag"
        ],
        "aiSummary": "Samsung is a massive global engineering giant with high-fidelity production processes. Its brand trust score is highly positive due to hardware dependability and massive customer infrastructure, with minor drops for slow updates on non-flagship devices.",
        "advantages": ["Beautiful custom screen technologies and cameras", "Widespread robust offline servicing centers worldwide", "Comprehensive options stretching from budget to ultra-flagship"],
        "disadvantages": ["Bloatware on certain sub-flagship lineups", "Software upgrade cycles are shorter for entry tiers", "Customer assistance paths are deeply call-center driven"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 19,
            "familyPurchased": 15,
            "mentorsTrust": 8,
            "expertsRecommend": 12,
            "score": 89
        },
        "accountability": {
            "expectationsMet": 89,
            "wouldBuyAgain": 86,
            "fulfilledPromises": 90,
            "reliableService": 85,
            "wouldRecommend": 87
        },
        "breakdown": {
            "transparency": 88,
            "customerSatisfaction": 87,
            "reviewAuthenticity": 89,
            "consistency": 91,
            "communityTrust": 86,
            "trustedCircle": 89,
            "brandMaturity": 98,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2022, "score": 87},
            {"year": 2023, "score": 88},
            {"year": 2024, "score": 89},
            {"year": 2025, "score": 88}
        ],
        "badges": ["Global Innovator", "Legacy of Trust", "Superb Screen"]
    },
    {
        "id": "dove",
        "name": "Dove",
        "category": "Beauty",
        "subcategories": ["Skincare", "Hair Care", "Hygiene"],
        "needs": ["Sensitive Skin", "Dry Hair", "Skincare", "Beauty"],
        "yearsActive": 69,
        "isFictional": False,
        "score": 86,
        "scamRisk": "Low",
        "scamRiskReason": [
            "Established dermatological endorsement and clinical verification processes",
            "Transparent formulations and easily readable ingredient files",
            "Excellent batch security and low delivery complaint levels"
        ],
        "aiSummary": "Dove is highly trusted for moisturizing and dermatological sensitivity solutions. Free from deceptive marketing, they use certified clinical claims which bolster consistent review points across age groups.",
        "advantages": ["Highly mild pH-balanced formula ideal for sensitive barriers", "Excellent value for money and global availability", "Strong brand alignment with body positivity"],
        "disadvantages": ["Some product formulas still contain sulfates/parabens', 'Standard packaging design lacks modern aesthetics', 'Slow to transition to entirely plastic-free lines"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 15,
            "familyPurchased": 12,
            "mentorsTrust": 6,
            "expertsRecommend": 9,
            "score": 87
        },
        "accountability": {
            "expectationsMet": 87,
            "wouldBuyAgain": 85,
            "fulfilledPromises": 89,
            "reliableService": 86,
            "wouldRecommend": 86
        },
        "breakdown": {
            "transparency": 88,
            "customerSatisfaction": 85,
            "reviewAuthenticity": 84,
            "consistency": 89,
            "communityTrust": 85,
            "trustedCircle": 87,
            "brandMaturity": 94,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2022, "score": 85},
            {"year": 2023, "score": 86},
            {"year": 2024, "score": 86},
            {"year": 2025, "score": 86}
        ],
        "badges": ["Dermatologist Trusted", "Moisture Certified"]
    },
    {
        "id": "plum",
        "name": "Plum Goodness",
        "category": "Beauty",
        "subcategories": ["Skincare", "Hair Care", "Makeup"],
        "needs": ["Sensitive Skin", "Dry Hair", "Organic Foods", "Skincare"],
        "yearsActive": 10,
        "isFictional": False,
        "score": 88,
        "scamRisk": "Low",
        "scamRiskReason": [
            "100% vegan certified with strict cruelty-free compliance audits",
            "Consistent organic review ratings and solid custom customer service responses",
            "Secure, verified return logistics with transparent recycling rewards"
        ],
        "aiSummary": "Plum creates reliable, 100% vegan beauty solutions. Their highly active \"Recycle\" program rewards system keeps community trust high, accompanied by transparent, clean formulations.",
        "advantages": ["Certified vegan and cruelty-free across the board", "Excellent transparent packaging with standard recycling support", "Great formulation safety with minimal chemical active spikes"],
        "disadvantages": ["Physical stores are primarily limited to major cities", "Delicate natural-scents might not appeal to everyone", "Pricing is slightly higher than standard mass brands"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 12,
            "familyPurchased": 8,
            "mentorsTrust": 4,
            "expertsRecommend": 8,
            "score": 85
        },
        "accountability": {
            "expectationsMet": 89,
            "wouldBuyAgain": 87,
            "fulfilledPromises": 90,
            "reliableService": 88,
            "wouldRecommend": 88
        },
        "breakdown": {
            "transparency": 91,
            "customerSatisfaction": 87,
            "reviewAuthenticity": 88,
            "consistency": 89,
            "communityTrust": 86,
            "trustedCircle": 85,
            "brandMaturity": 85,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2022, "score": 85},
            {"year": 2023, "score": 86},
            {"year": 2024, "score": 87},
            {"year": 2025, "score": 88}
        ],
        "badges": ["Vegan Certified", "Green Clean Award"]
    },
    {
        "id": "tresemme",
        "name": "TRESemmé",
        "category": "Hair Care",
        "subcategories": ["Beauty", "Hair Styling"],
        "needs": ["Dry Hair", "Hair Styling", "Hair Fall"],
        "yearsActive": 70,
        "isFictional": False,
        "score": 85,
        "scamRisk": "Low",
        "scamRiskReason": [
            "Consistent retail supply and multi-decade commercial record",
            "Clear allergen profiling and ingredient list accessibility on packages",
            "Established, standard customer support networks through parent Unilever"
        ],
        "aiSummary": "TRESemmé is a long-standing hair care staple that successfully delivers salon-style outcomes at home. With high formulation consistency, they score well on reliability but lose minor points for slow moves to green solutions.",
        "advantages": ["Excellent conditioning outcomes for coarse/dry hair types", "Outstanding value per ounce", "Professional-salon grade styling support"],
        "disadvantages": ["Not entirely free of heavy silicone bases", "Mainstream packaging is entirely plastic-heavy with minimal recycling incentives", "Few direct-to-consumer digital channels"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 13,
            "familyPurchased": 11,
            "mentorsTrust": 4,
            "expertsRecommend": 7,
            "score": 83
        },
        "accountability": {
            "expectationsMet": 86,
            "wouldBuyAgain": 84,
            "fulfilledPromises": 88,
            "reliableService": 85,
            "wouldRecommend": 84
        },
        "breakdown": {
            "transparency": 84,
            "customerSatisfaction": 85,
            "reviewAuthenticity": 85,
            "consistency": 90,
            "communityTrust": 82,
            "trustedCircle": 83,
            "brandMaturity": 93,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2022, "score": 84},
            {"year": 2023, "score": 85},
            {"year": 2024, "score": 85},
            {"year": 2025, "score": 85}
        ],
        "badges": ["Salon Classic", "Legacy Stylist"]
    },
    {
        "id": "loreal",
        "name": "L'Oréal",
        "category": "Hair Care",
        "subcategories": ["Beauty", "Skincare", "Cosmetics"],
        "needs": ["Hair Styling", "Dry Hair", "Skincare", "Beauty"],
        "yearsActive": 110,
        "isFictional": False,
        "score": 87,
        "scamRisk": "Low",
        "scamRiskReason": [
            "Massive global security validation and scientific laboratory background",
            "Highly structured claims backed by multiple third-party dermatology trials",
            "Extremely safe transactional and direct customer response modules"
        ],
        "aiSummary": "L'Oréal represents multi-era styling consistency with deep funding in raw safety research. They show highly consistent product delivery although they face minor community concerns regarding corporate organic labeling.",
        "advantages": ["Immense research budget ensures stable formulation quality", "Extremely diverse ranges for every age, hair, and style", "Verified shelf life and active stability"],
        "disadvantages": ["Fuzzy differentiation between high-end chemical actives vs marketing titles', 'Slow direct communication lines due to giant corporate size', 'High plastic footprint across retail networks"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 18,
            "familyPurchased": 15,
            "mentorsTrust": 7,
            "expertsRecommend": 11,
            "score": 88
        },
        "accountability": {
            "expectationsMet": 88,
            "wouldBuyAgain": 86,
            "fulfilledPromises": 89,
            "reliableService": 84,
            "wouldRecommend": 87
        },
        "breakdown": {
            "transparency": 82,
            "customerSatisfaction": 88,
            "reviewAuthenticity": 84,
            "consistency": 92,
            "communityTrust": 84,
            "trustedCircle": 88,
            "brandMaturity": 98,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2022, "score": 86},
            {"year": 2023, "score": 86},
            {"year": 2024, "score": 87},
            {"year": 2025, "score": 87}
        ],
        "badges": ["Global Beauty Giant", "Clinical Approved"]
    },
    {
        "id": "moxie-beauty",
        "name": "Moxie Beauty",
        "category": "Hair Care",
        "subcategories": ["Beauty", "Emerging Brands"],
        "needs": ["Hair Cream", "Dry Hair", "Hair Styling", "Dry Hair", "Hair Fall"],
        "yearsActive": 2,
        "isFictional": False,
        "score": 92,
        "scamRisk": "Very Low",
        "scamRiskReason": [
            "Direct, friendly founders and team transparently showing manufacturing workflows",
            "Certified and audited clean testing protocols verified independently",
            "Outstanding customer care loop that handles claims and exchanges individually"
        ],
        "aiSummary": "Moxie Beauty is a rising star in hair styling products. Highly customized recipes targeting specific hair challenges like dry hair and curls, combined with beautiful, authentic, non-incentivized feedback circles, generate excellent trust.",
        "advantages": ["Highly precise custom hydration lines for textured hair", "Extreme sincerity in customer engagement and feedback loops', 'Clean, non-toxic, lightweight hair protectants"],
        "disadvantages": ["Limited offline distribution network", "High demand occasionally leads to short inventory outages", "Price per ounce is higher than mass drug store brands"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 12,
            "familyPurchased": 8,
            "mentorsTrust": 4,
            "expertsRecommend": 7,
            "score": 96
        },
        "accountability": {
            "expectationsMet": 94,
            "wouldBuyAgain": 92,
            "fulfilledPromises": 95,
            "reliableService": 93,
            "wouldRecommend": 94
        },
        "breakdown": {
            "transparency": 96,
            "customerSatisfaction": 92,
            "reviewAuthenticity": 95,
            "consistency": 90,
            "communityTrust": 91,
            "trustedCircle": 96,
            "brandMaturity": 72,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2024, "score": 89},
            {"year": 2025, "score": 92}
        ],
        "badges": ["Hidden Gem High recommendation", "Founder Sincerity", "Texture Perfect"]
    },
    {
        "id": "glownest",
        "name": "GlowNest",
        "category": "Emerging Brands",
        "subcategories": ["Skincare", "Beauty"],
        "needs": ["Sensitive Skin", "Skincare", "Beauty"],
        "yearsActive": 2,
        "isFictional": True,
        "score": 89,
        "scamRisk": "Very Low",
        "scamRiskReason": [
            "Small batch manufacturing with public batch-testing records",
            "Independently owned, direct to consumer with zero complex policy strings",
            "Highly conversational and prompt creator answers on chat networks"
        ],
        "aiSummary": "GlowNest focuses on simple, skin barrier-repair formulations with completely transparent testing trails. Their small-batch approach keeps chemical active levels extremely stable.",
        "advantages": ["Exceptional performance on hyper-sensitive models', 'Direct, personal support lines with formulators', 'Fresh, active antioxidants that are blended on demand"],
        "disadvantages": ["Digital only checkout lanes", "Must be used within 6 months due to cold-pressed active bases", "No brick and mortar testing counters"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 8,
            "familyPurchased": 4,
            "mentorsTrust": 3,
            "expertsRecommend": 6,
            "score": 88
        },
        "accountability": {
            "expectationsMet": 90,
            "wouldBuyAgain": 88,
            "fulfilledPromises": 91,
            "reliableService": 92,
            "wouldRecommend": 90
        },
        "breakdown": {
            "transparency": 96,
            "customerSatisfaction": 90,
            "reviewAuthenticity": 93,
            "consistency": 87,
            "communityTrust": 86,
            "trustedCircle": 88,
            "brandMaturity": 70,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2024, "score": 86},
            {"year": 2025, "score": 89}
        ],
        "badges": ["Dermatology Approved Fictional", "Organic Wave", "DTC Star"]
    },
    {
        "id": "herbaura",
        "name": "HerbAura",
        "category": "Emerging Brands",
        "subcategories": ["Wellness", "Food", "Skincare"],
        "needs": ["Organic Foods", "Sensitive Skin", "Dry Hair", "Wellness"],
        "yearsActive": 3,
        "isFictional": True,
        "score": 87,
        "scamRisk": "Very Low",
        "scamRiskReason": [
            "Verified farm-source trace maps showing organic origins",
            "Fair-trade auditing records registered with local farming co-ops",
            "Real-time customer logistics tracking and packaging materials are fully biodegradable"
        ],
        "aiSummary": "HerbAura combines traditional herbal processes with modern organic farming safety. They declare fair-trade origins on all goods and support transparent local employment.",
        "advantages": ["Ethical farm-to-door delivery pathways", "Exceptional bio-availability of supplements", "Zero non-natural preservatives or binders used"],
        "disadvantages": ["Higher cost due to small-scale custom organic harvests", "Taste/scents are organic with zero chemical flavorings", "Shorter shelf life requires small monthly buying habits"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 7,
            "familyPurchased": 5,
            "mentorsTrust": 4,
            "expertsRecommend": 5,
            "score": 86
        },
        "accountability": {
            "expectationsMet": 88,
            "wouldBuyAgain": 86,
            "fulfilledPromises": 89,
            "reliableService": 87,
            "wouldRecommend": 88
        },
        "breakdown": {
            "transparency": 94,
            "customerSatisfaction": 86,
            "reviewAuthenticity": 90,
            "consistency": 85,
            "communityTrust": 85,
            "trustedCircle": 86,
            "brandMaturity": 74,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2023, "score": 84},
            {"year": 2024, "score": 85},
            {"year": 2025, "score": 87}
        ],
        "badges": ["Earth Keeper", "Fair Trade Certified"]
    },
    {
        "id": "aurawell",
        "name": "AuraWell",
        "category": "Emerging Brands",
        "subcategories": ["Wellness", "Fitness"],
        "needs": ["Wellness", "Fitness", "Organic Foods"],
        "yearsActive": 1,
        "isFictional": True,
        "score": 88,
        "scamRisk": "Very Low",
        "scamRiskReason": [
            "Open lab books published on website detailing heavy metal testing",
            "Zero-fee subscription management with single-click custom cancellation plans",
            "Direct, founder-led video updates detailing future pipeline structures"
        ],
        "aiSummary": "AuraWell focuses on functional nutrition and performance hydration. By printing active lab analysis sheets online, they instantly gained credibility in the highly controversial dietary supplements category.",
        "advantages": ["No hidden proprietary blends—total clarity on milligrams", "Strict third-party heavy-metal and pesticide testing records", "Eco-friendly compostability containers with refill options"],
        "disadvantages": ["Only premium subscription slots are available", "Extremely limited production batches", "Some elements take longer transport times during raw material shortage"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 6,
            "familyPurchased": 4,
            "mentorsTrust": 3,
            "expertsRecommend": 6,
            "score": 89
        },
        "accountability": {
            "expectationsMet": 90,
            "wouldBuyAgain": 87,
            "fulfilledPromises": 91,
            "reliableService": 89,
            "wouldRecommend": 88
        },
        "breakdown": {
            "transparency": 97,
            "customerSatisfaction": 88,
            "reviewAuthenticity": 92,
            "consistency": 84,
            "communityTrust": 86,
            "trustedCircle": 89,
            "brandMaturity": 65,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2025, "score": 88}
        ],
        "badges": ["Purity Gold", "DTC Innovator"]
    },
    {
        "id": "econest",
        "name": "EcoNest",
        "category": "Emerging Brands",
        "subcategories": ["Home", "Wellness"],
        "needs": ["Home", "Air Purifiers", "Sensitive Skin"],
        "yearsActive": 4,
        "isFictional": True,
        "score": 86,
        "scamRisk": "Low",
        "scamRiskReason": [
            "Verified zero-plastic shipping lines with offset reports",
            "FSC certified wood logs and natural organic cotton materials",
            "Traceable raw material pathways with minor shipping hiccups in high-volume months"
        ],
        "aiSummary": "EcoNest designs sustainable domestic accents and home air purifiers. Their materials are completely natural which earns immense gratification from allergen-sensitive individuals.",
        "advantages": ["Beautiful custom artisan handcrafting styling", "Incredibly clean chemical footprint—zero toxins used", "Fully carbon-neutral delivery networks"],
        "disadvantages": ["Artisanal scaling is slower leading to backorders", "Slightly higher shipping costs for regional territories", "Higher initial investment than mass plastic furnishings"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 9,
            "familyPurchased": 6,
            "mentorsTrust": 4,
            "expertsRecommend": 5,
            "score": 84
        },
        "accountability": {
            "expectationsMet": 88,
            "wouldBuyAgain": 85,
            "fulfilledPromises": 88,
            "reliableService": 83,
            "wouldRecommend": 86
        },
        "breakdown": {
            "transparency": 92,
            "customerSatisfaction": 85,
            "reviewAuthenticity": 88,
            "consistency": 84,
            "communityTrust": 84,
            "trustedCircle": 84,
            "brandMaturity": 76,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2022, "score": 82},
            {"year": 2023, "score": 84},
            {"year": 2024, "score": 85},
            {"year": 2025, "score": 86}
        ],
        "badges": ["Green House Award", "Zero Waste Brand"]
    },
    {
        "id": "pureleaf-organics",
        "name": "PureLeaf Organics",
        "category": "Emerging Brands",
        "subcategories": ["Food", "Wellness"],
        "needs": ["Organic Foods", "Wellness", "Fitness"],
        "yearsActive": 3,
        "isFictional": True,
        "score": 91,
        "scamRisk": "Very Low",
        "scamRiskReason": [
            "Certified organic agricultural credentials with trace tags on every label",
            "100% fair pricing to farmers with published annual audit files",
            "Zero refined sugar declaration and non-processed natural preservation"
        ],
        "aiSummary": "PureLeaf Organics offers highly traceable food items, direct from agricultural co-operatives. They verify every crop rotation, maintaining a zero pesticide chemical record.",
        "advantages": ["True traceability—scan the bottle to see the farmer", "Outstanding natural flavor preservation", "Zero hidden oils, high in essential complex fibers"],
        "disadvantages": ["Limited seasonal selection availability", "Deteriorates quickly if not refrigerated properly", "Short delivery windows in rural locations"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 11,
            "familyPurchased": 8,
            "mentorsTrust": 5,
            "expertsRecommend": 8,
            "score": 94
        },
        "accountability": {
            "expectationsMet": 93,
            "wouldBuyAgain": 90,
            "fulfilledPromises": 94,
            "reliableService": 90,
            "wouldRecommend": 92
        },
        "breakdown": {
            "transparency": 98,
            "customerSatisfaction": 91,
            "reviewAuthenticity": 93,
            "consistency": 88,
            "communityTrust": 89,
            "trustedCircle": 94,
            "brandMaturity": 74,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2023, "score": 87},
            {"year": 2024, "score": 89},
            {"year": 2025, "score": 91}
        ],
        "badges": ["Soil Guard Award", "100% Pure Certified"]
    },
    {
        "id": "bloomtheory",
        "name": "BloomTheory",
        "category": "Emerging Brands",
        "subcategories": ["Beauty", "Skincare"],
        "needs": ["Sensitive Skin", "Skincare", "Beauty"],
        "yearsActive": 2,
        "isFictional": True,
        "score": 87,
        "scamRisk": "Very Low",
        "scamRiskReason": [
            "Botanical source registries verified and tested in clean laboratory modules",
            "Minimalist packaging reduces chemical reactions with cosmetic tubes",
            "Extremely high positive responsiveness to product feedback circles"
        ],
        "aiSummary": "BloomTheory focuses on botanical floral solutions using high-tech sub-critical fluid extraction. By omitting heavy artificial coloring or synthetics, they protect sensitive skin models.",
        "advantages": ["Clean modern extraction processes preserves raw potency", "Delicate natural-flower skin calming characteristics", "Highly aesthetic sustainable glass pump styling"],
        "disadvantages": ["Fewer SKU varieties than large beauty corporations", "Requires careful storage away from direct solar rays", "Rare botanical extracts trigger occasional stock delays"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 6,
            "familyPurchased": 5,
            "mentorsTrust": 3,
            "expertsRecommend": 5,
            "score": 85
        },
        "accountability": {
            "expectationsMet": 88,
            "wouldBuyAgain": 86,
            "fulfilledPromises": 89,
            "reliableService": 88,
            "wouldRecommend": 87
        },
        "breakdown": {
            "transparency": 94,
            "customerSatisfaction": 87,
            "reviewAuthenticity": 91,
            "consistency": 84,
            "communityTrust": 83,
            "trustedCircle": 85,
            "brandMaturity": 70,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2024, "score": 84},
            {"year": 2025, "score": 87}
        ],
        "badges": ["Botanical Triumph", "Premium Glass Label"]
    },
    {
        "id": "root-ritual",
        "name": "Root & Ritual",
        "category": "Emerging Brands",
        "subcategories": ["Hair Care", "Wellness"],
        "needs": ["Dry Hair", "Hair Fall", "Sensitive Skin"],
        "yearsActive": 3,
        "isFictional": True,
        "score": 89,
        "scamRisk": "Very Low",
        "scamRiskReason": [
            "Ayurvedic and modern trichologist verified formula lists",
            "Cold-pressed oil sources, fully traceable to small-scale wild harvesting",
            "No added foaming chemicals or sulfates prevents root thinning issues"
        ],
        "aiSummary": "Root & Ritual is an emerging hair care giant focusing on deep scalp health. They use wild-harvested herbs, protecting users from chemical active ingredients.",
        "advantages": ["Deep nourishment properties with clean herbal oils", "Helps build thicker textures naturally", "Very active customer support detailing custom-oiling schemas"],
        "disadvantages": ["Needs active massage rituals—not a simple quick-wash model", "Herbal fragrance can be intense for modern scent tastes", "Drip caps are plastic-free which requires manual control"],
        "verifiedStatus": True,
        "trustedCircle": {
            "friendsRecommend": 9,
            "familyPurchased": 7,
            "mentorsTrust": 4,
            "expertsRecommend": 6,
            "score": 90
        },
        "accountability": {
            "expectationsMet": 90,
            "wouldBuyAgain": 88,
            "fulfilledPromises": 91,
            "reliableService": 89,
            "wouldRecommend": 90
        },
        "breakdown": {
            "transparency": 96,
            "customerSatisfaction": 89,
            "reviewAuthenticity": 92,
            "consistency": 86,
            "communityTrust": 86,
            "trustedCircle": 90,
            "brandMaturity": 75,
            "scamRiskAdjustment": 0
        },
        "journey": [
            {"year": 2023, "score": 85},
            {"year": 2024, "score": 87},
            {"year": 2025, "score": 89}
        ],
        "badges": ["Traditional Crown", "Pure Scalp Approved"]
    }
]

# 2. SIDEBAR NAVIGATION
st.sidebar.markdown("<h2 style='text-align: center; color: #14B8A6 !important;'>VOUCH</h2>", unsafe_allow_html=True)
st.sidebar.markdown("<p style='text-align: center; font-size: 11px; margin-top:-15px; color:#6C7A89;'>Trust Before Transaction</p>", unsafe_allow_html=True)
st.sidebar.markdown("---")

nav_choice = st.sidebar.radio(
    "NAVIGATION",
    ["🏠 Home", "🔍 Discover Brands", "💎 Hidden Gems", "⚖️ Compare Brands", "📈 Trust Insights", "🤖 Ask Vouch"]
)

st.sidebar.markdown("---")
st.sidebar.info("💡 **Brand Protection Pledge:** Brands cannot pay Vouch to raise their Trust Score. Ratings are independent and algorithm-driven.")

# MAIN ROUTING
if st.session_state.get("selected_brand"):
    selected_id = st.session_state["selected_brand"]
    brand = next((b for b in BRANDS_DB if b["id"] == selected_id), None)
    if brand:
        col_back, col_status = st.columns([5, 2])
        with col_back:
            if st.button("← Back to Directory", key="global-back-btn"):
                st.session_state["selected_brand"] = None
                st.rerun()
        with col_status:
            st.markdown("<p style='text-align: right; font-size: 11px; font-family: monospace; color:#6C7A89; margin-top: 10px; margin-bottom: 0;'>Factual Verdict Active</p>", unsafe_allow_html=True)
            
        st.markdown("---")
        
        # 1. Trust Score, Title & Stability Trend Card
        st.markdown(f"""
        <div style="background-color: #1A1A1A; border: 1px solid #2D3748; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <h2 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800;">{brand['name']}</h2>
                {"<span style='background-color: rgba(16, 185, 129, 0.1); color: #34D399; font-size: 10px; font-family: monospace; border: 1px solid rgba(16, 185, 129, 0.3); padding: 2px 6px; border-radius: 4px; font-weight: bold;'>VOUCH CERTIFIED</span>" if brand['verifiedStatus'] else ""}
                {"<span style='background-color: rgba(113, 128, 150, 0.1); color: #A0AEC0; font-size: 10px; font-family: monospace; border: 1px solid rgba(113, 128, 150, 0.3); padding: 2px 6px; border-radius: 4px; font-weight: bold;'>FICTIONAL GEM</span>" if brand['isFictional'] else ""}
            </div>
            <p style="color: #A0AEC0; font-size: 13px; margin-top: 5px; margin-bottom: 20px;">{brand['category']} Category • Active for {brand['yearsActive']} Years</p>
            <div style="display: flex; align-items: center; gap: 20px;">
                <div>
                    <span style="color: #A0AEC0; font-size: 9px; font-family: monospace; letter-spacing: 1.5px; text-transform: uppercase; display: block; margin-bottom: 4px;">Trust Score</span>
                    <span style="color: #FFFFFF; font-size: 36px; font-weight: 900; line-height: 1; font-family: monospace;">{brand['score']}</span>
                </div>
                <div style="width: 1px; height: 35px; background-color: #2D3748;"></div>
                <div>
                    <span style="color: #34D399; font-size: 11px; font-weight: bold; background-color: rgba(52, 211, 153, 0.1); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(52, 211, 153, 0.2);">STABLE TREND</span>
                    <span style="color: #718096; font-size: 10px; display: block; margin-top: 5px;">Evolving since {brand['journey'][0]['year']}</span>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # 2. Scam Risk Indicators
        risk_level = brand['scamRisk']
        if risk_level in ['Very Low', 'Low']:
            bg_color = "rgba(16, 185, 129, 0.08)"
            border_color = "rgba(16, 185, 129, 0.25)"
            text_color = "#34D399"
            title_prefix = "🛡️ Safe Verification — "
        elif risk_level == 'Moderate':
            bg_color = "rgba(245, 158, 11, 0.08)"
            border_color = "rgba(245, 158, 11, 0.25)"
            text_color = "#FBBF24"
            title_prefix = "⚠️ Caution Advised — "
        else: # High
            bg_color = "rgba(239, 68, 68, 0.08)"
            border_color = "rgba(239, 68, 68, 0.25)"
            text_color = "#F87171"
            title_prefix = "🚨 Elevated Risk Warning — "

        st.markdown(f"""
        <div style="background-color: {bg_color}; border: 1px solid {border_color}; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: {text_color}; margin-top: 0; margin-bottom: 10px; font-family: monospace; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
                {title_prefix}Scam Risk Indicator: {risk_level}
            </h4>
            <ul style="color: #E2E8F0; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.6;">
                {"".join(f'<li style="margin-bottom: 6px;">{reason}</li>' for reason in brand['scamRiskReason'])}
            </ul>
        </div>
        """, unsafe_allow_html=True)
        
        # 3. AI Evaluation Intelligence
        st.markdown(f"""
        <div style="background-color: #2D3748; border-left: 4px solid #F59E0B; border-radius: 0 8px 8px 0; padding: 18px; margin-bottom: 25px; border-top: 1px solid #4A5568; border-right: 1px solid #4A5568; border-bottom: 1px solid #4A5568;">
            <h5 style="color: #FBBF24; margin-top: 0; margin-bottom: 8px; font-family: monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
                ✨ AI Evaluation Intelligence
            </h5>
            <p style="color: #CBD5E0; font-size: 13.5px; line-height: 1.6; margin: 0; text-align: justify;">
                {brand['aiSummary']}
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        # 4. Advantages & Disadvantages Column Grid
        col_pro, col_con = st.columns(2)
        with col_pro:
            st.markdown(f"""
            <div style="background-color: rgba(52, 211, 153, 0.05); border: 1px solid rgba(52, 211, 153, 0.15); border-radius: 12px; padding: 18px; height: 100%;">
                <h5 style="color: #34D399; margin-top: 0; margin-bottom: 12px; font-family: monospace; text-transform: uppercase; font-size: 12px; font-weight: bold; letter-spacing: 0.5px;">
                    ✅ Authenticated Advantages
                </h5>
                <ul style="color: #E2E8F0; font-size: 13px; margin: 0; padding-left: 15px; line-height: 1.6;">
                    {"".join(f'<li style="margin-bottom: 8px;">{val}</li>' for val in brand['advantages'])}
                </ul>
            </div>
            """, unsafe_allow_html=True)
        with col_con:
            st.markdown(f"""
            <div style="background-color: rgba(248, 113, 113, 0.05); border: 1px solid rgba(248, 113, 113, 0.15); border-radius: 12px; padding: 18px; height: 100%;">
                <h5 style="color: #F87171; margin-top: 0; margin-bottom: 12px; font-family: monospace; text-transform: uppercase; font-size: 12px; font-weight: bold; letter-spacing: 0.5px;">
                    ❌ Evaluated Disadvantages & Costs
                </h5>
                <ul style="color: #E2E8F0; font-size: 13px; margin: 0; padding-left: 15px; line-height: 1.6;">
                    {"".join(f'<li style="margin-bottom: 8px;">{val}</li>' for val in brand['disadvantages'])}
                </ul>
            </div>
            """, unsafe_allow_html=True)
            
        # 5. Trusted Circle Network
        tc = brand['trustedCircle']
        st.markdown(f"""
        <div style="background-color: #1A1A1A; border: 1px solid #2D3748; border-radius: 12px; padding: 20px; margin-top: 25px; margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2D3748; padding-bottom: 10px; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                <div>
                    <h4 style="color: #FFFFFF; margin: 0; font-size: 15px; font-weight: bold;">Trusted Circle Network</h4>
                    <span style="color: #718096; font-size: 10px; font-family: monospace;">Direct peer recommendations and assessments statistics</span>
                </div>
                <div style="background-color: #2D3748; color: #FFFFFF; font-family: monospace; font-size: 11px; padding: 4px 10px; border-radius: 4px; border: 1px solid #4A5568; font-weight: bold;">
                    Circle Score: {tc['score']}%
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
                <div>
                    <span style="color: #FFFFFF; font-size: 20px; font-weight: bold; display: block; font-family: monospace;">{tc['friendsRecommend']}</span>
                    <span style="color: #A0AEC0; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace;">Friends recommend</span>
                </div>
                <div>
                    <span style="color: #FFFFFF; font-size: 20px; font-weight: bold; display: block; font-family: monospace;">{tc['familyPurchased']}</span>
                    <span style="color: #A0AEC0; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace;">Family purchased</span>
                </div>
                <div>
                    <span style="color: #FFFFFF; font-size: 20px; font-weight: bold; display: block; font-family: monospace;">{tc['mentorsTrust']}</span>
                    <span style="color: #A0AEC0; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace;">Mentors trust</span>
                </div>
                <div>
                    <span style="color: #FFFFFF; font-size: 20px; font-weight: bold; display: block; font-family: monospace;">{tc['expertsRecommend']}</span>
                    <span style="color: #A0AEC0; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace;">Experts recommend</span>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # 6. Accountability Tracking
        acc = brand['accountability']
        st.markdown("<p style='color: #718096; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-weight: bold;'>Accountability Tracking (Did claims match real-world service?)</p>", unsafe_allow_html=True)
        cc1, cc2, cc3, cc4, cc5 = st.columns(5)
        cc_data = [
            ("Expectations Met", acc['expectationsMet']),
            ("Repurchase Rate", acc['wouldBuyAgain']),
            ("Promises Kept", acc['fulfilledPromises']),
            ("Reliable Service", acc['reliableService']),
            ("Would Recommend", acc['wouldRecommend'])
        ]

        for idx, (label, val) in enumerate(cc_data):
            col_ref = [cc1, cc2, cc3, cc4, cc5][idx]
            with col_ref:
                st.markdown(f"""
                <div style="background-color: #2D3748; border: 1px solid #4A5568; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.1); height: 100%;">
                    <span style="color: #FFFFFF; font-size: 18px; font-weight: 900; display: block; font-family: monospace;">{val}%</span>
                    <span style="color: #CBD5E0; font-size: 10px; display: block; margin-top: 4px; line-height: 1.2;">{label}</span>
                </div>
                """, unsafe_allow_html=True)
                
        # 7. Pillar Breakdown Calculations & Weighted Score Components
        st.markdown("<br/>", unsafe_allow_html=True)
        st.markdown("<p style='color: #718096; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-weight: bold;'>Pillar Breakdown Calculations & Weighted Score Components</p>", unsafe_allow_html=True)
        bd = brand['breakdown']
        p_col1, p_col2 = st.columns(2)
        pillars_list = [
            ("Transparency (15%)", bd['transparency']),
            ("Customer Satisfaction (20%)", bd['customerSatisfaction']),
            ("Review Authenticity (15%)", bd['reviewAuthenticity']),
            ("Consistency Rating (15%)", bd['consistency']),
            ("Community Trust (15%)", bd['communityTrust']),
            ("Trusted Circle Profile (10%)", bd['trustedCircle']),
            ("Brand Maturity Premium (10%)", bd['brandMaturity'])
        ]
        
        for i, (p_name, p_val) in enumerate(pillars_list):
            target_col = p_col1 if i % 2 == 0 else p_col2
            with target_col:
                st.markdown(f"""
                <div style="background-color: #1A1A1A; border: 1px solid #2D3748; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; font-family: monospace;">
                        <span style="color: #CBD5E0; font-weight: bold;">{p_name}</span>
                        <span style="color: #63B3ED; font-weight: bold;">{p_val}%</span>
                    </div>
                    <div style="background-color: #2D3748; height: 6px; border-radius: 3px; overflow: hidden;">
                        <div style="background-color: #14B8A6; width: {p_val}%; height: 6px; border-radius: 3px;"></div>
                    </div>
                </div>
                """, unsafe_allow_html=True)

        if bd['scamRiskAdjustment'] < 0:
            st.markdown(f"""
            <div style="background-color: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 8px; padding: 12px; margin-top: 5px; font-size: 12px; color: #F87171;">
                ⚠️ <strong>Dynamic Multi-Factor Adjustor deduction:</strong> Dynamic Score includes a warning penalty adjustments of <strong>{bd['scamRiskAdjustment']} points</strong> due to elevated risk parameters.
            </div>
            """, unsafe_allow_html=True)
            
        # 8. Historical Trust Journey
        st.markdown("<br/>", unsafe_allow_html=True)
        st.markdown("<p style='color: #718096; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-weight: bold;'>Historical Trust Journey</p>", unsafe_allow_html=True)
        timeline_cols = st.columns(len(brand['journey']))
        for j_idx, pt in enumerate(brand['journey']):
            with timeline_cols[j_idx]:
                st.markdown(f"""
                <div style="background-color: #1A1A1A; border: 1px solid #2D3748; border-radius: 8px; padding: 12px; text-align: center;">
                    <span style="color: #718096; font-size: 10px; font-family: monospace; display: block;">{pt['year']}</span>
                    <span style="color: #14B8A6; font-size: 16px; font-weight: 900; margin-top: 4px; display: block; font-family: monospace;">{pt['score']}</span>
                </div>
                """, unsafe_allow_html=True)
                
        # 9. Earned Trust Credentials (Badges)
        st.markdown("<br/>", unsafe_allow_html=True)
        st.markdown("<p style='color: #718096; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: bold;'>Earned Trust Credentials</p>", unsafe_allow_html=True)
        badges_html = " ".join(f'<span style="background-color: #2D3748; color: #E2E8F0; font-size: 11px; font-weight: bold; padding: 6px 12px; border-radius: 20px; border: 1px solid #4A5568; display: inline-block; margin-right: 8px; margin-bottom: 8px;">🏅 {badge}</span>' for badge in brand['badges'])
        st.markdown(f"<div style='margin-top: 4px;'>{badges_html}</div>", unsafe_allow_html=True)
        
        # Cease execution to overlay takeover view completely
        st.stop()

# MAIN ROUTING
if "🏠 Home" in nav_choice:
    st.markdown("<h1 style='text-align: center;'>VOUCH</h1>", unsafe_allow_html=True)
    st.markdown("<h4 style='text-align: center; color: #14B8A6 !important;'>The Credit Score for Brands</h4>", unsafe_allow_html=True)
    st.write("")

    # HERO SEARCH
    search_query = st.text_input("Search any brand, category, or consumer need (e.g., 'Dyson', 'Hair Cream', 'Sensitive Skin'):")
    
    if search_query:
        q = search_query.lower().strip()
        matched_brands = []
        
        # Exact Name check fallback
        for b in BRANDS_DB:
            if q in b["name"].lower() or any(q in need.lower() for need in b["needs"]) or q in b["category"].lower():
                matched_brands.append(b)
                
        if matched_brands:
            st.success(f"🔍 Found {len(matched_brands)} brand matches for '{search_query}':")
            cols = st.columns(len(matched_brands))
            for idx, mb in enumerate(matched_brands):
                with cols[idx]:
                    st.markdown(f"""
                    <div class="brand-card">
                        <h5>{mb["name"]}</h5>
                        <p style="font-size:11px; color:#888;">{mb["category"]}</p>
                        <span class="trust-score-badge">{mb["score"]}</span> <span style="font-size:11px; color:#888;">Trust Score</span>
                    </div>
                    """, unsafe_allow_html=True)
                    if st.button(f"Analyze {mb['name']}", key=f"rec-{mb['id']}"):
                        st.session_state["selected_brand"] = mb["id"]
                        st.toast(f"Opening {mb['name']} full report!")
        else:
            st.error("No evaluated brands found matching this phrase. Try 'Dyson' or 'Minimalist'.")

    # HOME PAGE METRICS
    st.markdown("### Platform Assessment Volume")
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Brands Monitored", "520+")
    col2.metric("Trust Profile Audits", "12,480")
    col3.metric("Emerging Hidden Gems", "34", delta="Verified")
    col4.metric("Scam Alerts Issued", "82", delta="Active warnings")

    st.markdown("---")
    st.markdown("### Why Vouch?")
    st.markdown("""
    * **Reviews can be Biased, Fake, or Manipulated:** We bypass raw star counts to inspect actual ingredient transparency declarations, support channels, and legal registry structures.
    * **Calculated over 8 core pillars:** Transparency, customer reviews, operational delivery consistency, Trusted circles, and longevity metrics.
    * **Promotes Boutique Artisans:** Undiscovered small businesses with excellent formulas get the high visibility & trust credibility they deserve.
    """)

elif "🔍 Discover Brands" in nav_choice:
    st.title("Brand Trust Directory")
    st.write("Browse certified and evaluated brands.")

    # Category and risk filters
    cat_filter = st.selectbox("Category Filter", ["All", "Beauty", "Hair Care", "Skincare", "Electronics", "Emerging Brands"])
    min_score = st.slider("Minimum Trust Score", 0, 100, 50)
    
    filtered_list = []
    for b in BRANDS_DB:
        if cat_filter != "All" and b["category"] != cat_filter:
            continue
        if b["score"] < min_score:
            continue
        filtered_list.append(b)

    if not filtered_list:
        st.warning("No brands match your active filters.")
    else:
        for fb in filtered_list:
            col_a, col_b = st.columns([4, 1])
            with col_a:
                st.subheader(fb["name"])
                st.caption(f"Category: {fb['category']} | Active {fb['yearsActive']} Years")
                st.write(fb["aiSummary"])
            with col_b:
                st.markdown(f"<div style='text-align:center;'><span class='trust-score-badge'>{fb['score']}</span><br/><span style='font-size:11px; color:#6C7A89;'>Trust Score</span></div>", unsafe_allow_html=True)
                st.write("")
                # Show profile button
                if st.button("Full Profile 🛡️", key=f"show-{fb['id']}"):
                    st.session_state["selected_brand"] = fb["id"]
                    
            st.markdown("---")

elif "💎 Hidden Gems" in nav_choice:
    st.title("Verified Emerging Hidden Gems 💎")
    st.write("Highlights of highly trustworthy operators under 10 years old with low risk ratings.")
    st.write("")

    gems = [b for b in BRANDS_DB if b["isFictional"] or b["id"] == "moxie-beauty"]
    for g in gems:
        st.markdown(f"""
        <div class="brand-card">
            <h4>{g["name"]} — {g["category"]}</h4>
            <p><strong>Trust Rating:</strong> <span style="color:#14B8A6; font-size:18px;">{g["score"]}</span></p>
            <p style="font-size:13px; color:#ccc;">{g["aiSummary"]}</p>
        </div>
        """, unsafe_allow_html=True)
        st.write("")

elif "⚖️ Compare Brands" in nav_choice:
    st.title("Compare Brand Integrity Bench")
    st.write("Evaluate two brands side-by-side to review real transparency metrics.")

    col1, col2 = st.columns(2)
    with col1:
        brand_a_name = st.selectbox("Select Primary Brand", [b["name"] for b in BRANDS_DB], index=4)
        brand_a = next(b for b in BRANDS_DB if b["name"] == brand_a_name)
    with col2:
        brand_b_name = st.selectbox("Select Target Brand", [b["name"] for b in BRANDS_DB], index=1)
        brand_b = next(b for b in BRANDS_DB if b["name"] == brand_b_name)

    st.markdown("### Metrics Comparison Matrix")
    compare_df = pd.DataFrame({
        "Attribute": ["Trust Score", "Category", "Years Active", "Scam Risk", "Transparency", "Customer Satisfaction", "Review Authenticity"],
        brand_a["name"]: [brand_a["score"], brand_a["category"], brand_a["yearsActive"], brand_a["scamRisk"], brand_a["breakdown"]["transparency"], brand_a["breakdown"]["customerSatisfaction"], brand_a["breakdown"]["reviewAuthenticity"]],
        brand_b["name"]: [brand_b["score"], brand_b["category"], brand_b["yearsActive"], brand_b["scamRisk"], brand_b["breakdown"]["transparency"], brand_b["breakdown"]["customerSatisfaction"], brand_b["breakdown"]["reviewAuthenticity"]],
    })
    st.table(compare_df)

    if brand_a["score"] > brand_b["score"]:
        st.success(f"🛡️ **Vouch Verdict:** {brand_a['name']} displays stronger brand authentication than {brand_b['name']}.")
    elif brand_b["score"] > brand_a["score"]:
        st.success(f"🛡️ **Vouch Verdict:** {brand_b['name']} displays stronger brand authentication than {brand_a['name']}.")

elif "📈 Trust Insights" in nav_choice:
    st.title("The Vouch Trust Algorithm Sandbox")
    st.write("Understand the weighted mathematical pillars powering the Brand Credit Score.")

    # Sandbox Sliders
    sb_trans = st.slider("Transparency Weight (15%)", 0, 100, 90)
    sb_satis = st.slider("Customer Satisfaction Weight (20%)", 0, 100, 85)
    sb_auth = st.slider("Review Authenticity Weight (15%)", 0, 100, 80)
    sb_cons = st.slider("Fulfillment Consistency Weight (15%)", 0, 100, 95)
    sb_comm = st.slider("Community Consensus Weight (15%)", 0, 100, 85)
    sb_circ = st.slider("Circle referrals Weight (10%)", 0, 100, 80)
    sb_mat = st.slider("longevity Premium (10%)", 0, 100, 75)

    sb_penalty = st.radio("Scam Warning deduction", [0, -3, -7, -15], format_func=lambda x: f"Deduct {abs(x)} points" if x != 0 else "No Warning Active")

    raw_calc = (sb_trans * 0.15) + (sb_satis * 0.20) + (sb_auth * 0.15) + (sb_cons * 0.15) + (sb_comm * 0.15) + (sb_circ * 0.10) + (sb_mat * 0.10) + sb_penalty
    final_sb_score = min(100, max(0, round(raw_calc)))

    st.subheader(f"Simulated Score result: {final_sb_score}/100")

elif "🤖 Ask Vouch" in nav_choice:
    st.title("Vouch Ask AI Assistant")
    st.write("Interactive Chat queries backed by grounded brand datasets.")
    
    user_query = st.text_input("Ask Vouch (e.g., 'Is Minimalist safe?', 'Should I choose Mamaearth?'):")
    if user_query:
        # Predefined response mapping for Streamlit offline stability fallbacks
        uq = user_query.lower()
        if "dyson" in uq:
            st.info("**Vouch Response:** Dyson represents highly consistent premium engineering (Score 89/100). They offer reliable global support and low overall scam indicators, although premium pricing is a strict customer gate.")
        elif "mamaearth" in uq or "minimalist" in uq:
            st.info("**Vouch Response:** Minimalist scores 90/100 with total ingredient percentage declarations right on the label (Transparency 98/100). Mamaearth is lower (82/100) with moderate scam risk due to heavy promotional review dilution and custom desk delays.")
        else:
            st.info("**Vouch Response:** That brand hasn't been evaluated by Vouch AI yet. If you believe this emerging business deserves credibility, please submit its registration papers inside the Business Hub.")
