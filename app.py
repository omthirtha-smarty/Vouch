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
        "trustedCircle": {"friendsRecommend": 14, "familyPurchased": 9, "mentorsTrust": 6, "expertsRecommend": 11, "score": 91},
        "accountability": {"expectationsMet": 92, "wouldBuyAgain": 88, "fulfilledPromises": 94, "reliableService": 90, "wouldRecommend": 91},
        "breakdown": {"transparency": 92, "customerSatisfaction": 88, "reviewAuthenticity": 91, "consistency": 94, "communityTrust": 86, "trustedCircle": 91, "brandMaturity": 95, "scamRiskAdjustment": 0},
        "journey": [{"year": 2022, "score": 86}, {"year": 2023, "score": 87}, {"year": 2024, "score": 88}, {"year": 2025, "score": 89}],
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
        "trustedCircle": {"friendsRecommend": 8, "familyPurchased": 7, "mentorsTrust": 3, "expertsRecommend": 4, "score": 74},
        "accountability": {"expectationsMet": 79, "wouldBuyAgain": 74, "fulfilledPromises": 81, "reliableService": 77, "wouldRecommend": 75},
        "breakdown": {"transparency": 84, "customerSatisfaction": 79, "reviewAuthenticity": 71, "consistency": 80, "communityTrust": 82, "trustedCircle": 74, "brandMaturity": 82, "scamRiskAdjustment": -4},
        "journey": [{"year": 2022, "score": 84}, {"year": 2023, "score": 83}, {"year": 2024, "score": 81}, {"year": 2025, "score": 82}],
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
        "trustedCircle": {"friendsRecommend": 25, "familyPurchased": 18, "mentorsTrust": 12, "expertsRecommend": 19, "score": 97},
        "accountability": {"expectationsMet": 96, "wouldBuyAgain": 94, "fulfilledPromises": 97, "reliableService": 93, "wouldRecommend": 95},
        "breakdown": {"transparency": 96, "customerSatisfaction": 94, "reviewAuthenticity": 95, "consistency": 98, "communityTrust": 93, "trustedCircle": 97, "brandMaturity": 98, "scamRiskAdjustment": 0},
        "journey": [{"year": 2022, "score": 94}, {"year": 2023, "score": 94}, {"year": 2024, "score": 95}, {"year": 2025, "score": 95}],
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
        "trustedCircle": {"friendsRecommend": 21, "familyPurchased": 14, "mentorsTrust": 8, "expertsRecommend": 15, "score": 92},
        "accountability": {"expectationsMet": 91, "wouldBuyAgain": 89, "fulfilledPromises": 93, "reliableService": 88, "wouldRecommend": 92},
        "breakdown": {"transparency": 90, "customerSatisfaction": 91, "reviewAuthenticity": 88, "consistency": 93, "communityTrust": 89, "trustedCircle": 92, "brandMaturity": 96, "scamRiskAdjustment": 0},
        "journey": [{"year": 2022, "score": 90}, {"year": 2023, "score": 90}, {"year": 2024, "score": 91}, {"year": 2025, "score": 91}],
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
        "trustedCircle": {"friendsRecommend": 16, "familyPurchased": 11, "mentorsTrust": 5, "expertsRecommend": 14, "score": 93},
        "accountability": {"expectationsMet": 91, "wouldBuyAgain": 90, "fulfilledPromises": 92, "reliableService": 87, "wouldRecommend": 91},
        "breakdown": {"transparency": 98, "customerSatisfaction": 89, "reviewAuthenticity": 94, "consistency": 91, "communityTrust": 88, "trustedCircle": 93, "brandMaturity": 80, "scamRiskAdjustment": 0},
        "journey": [{"year": 2022, "score": 81}, {"year": 2023, "score": 86}, {"year": 2024, "score": 88}, {"year": 2025, "score": 90}],
        "badges": ["Transparency Star", "Science Backed"]
    },
    # Fictional Gems
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
        "advantages": ["Exceptional performance on hyper-sensitive models", "Direct, personal support lines with formulators", "Fresh, active antioxidants that are blended on demand"],
        "disadvantages": ["Digital only checkout lanes", "Must be used within 6 months due to cold-pressed active bases", "No brick and mortar testing counters"],
        "verifiedStatus": True,
        "trustedCircle": {"friendsRecommend": 8, "familyPurchased": 4, "mentorsTrust": 3, "expertsRecommend": 6, "score": 88},
        "accountability": {"expectationsMet": 90, "wouldBuyAgain": 88, "fulfilledPromises": 91, "reliableService": 92, "wouldRecommend": 90},
        "breakdown": {"transparency": 96, "customerSatisfaction": 90, "reviewAuthenticity": 93, "consistency": 87, "communityTrust": 86, "trustedCircle": 88, "brandMaturity": 70, "scamRiskAdjustment": 0},
        "journey": [{"year": 2024, "score": 86}, {"year": 2025, "score": 89}],
        "badges": ["Organic Wave", "DTC Star"]
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
        "trustedCircle": {"friendsRecommend": 7, "familyPurchased": 5, "mentorsTrust": 4, "expertsRecommend": 5, "score": 86},
        "accountability": {"expectationsMet": 88, "wouldBuyAgain": 86, "fulfilledPromises": 89, "reliableService": 87, "wouldRecommend": 88},
        "breakdown": {"transparency": 94, "customerSatisfaction": 86, "reviewAuthenticity": 90, "consistency": 85, "communityTrust": 85, "trustedCircle": 86, "brandMaturity": 74, "scamRiskAdjustment": 0},
        "journey": [{"year": 2023, "score": 84}, {"year": 2024, "score": 85}, {"year": 2025, "score": 87}],
        "badges": ["Earth Keeper", "Fair Trade Certified"]
    },
    {
        "id": "moxie-beauty",
        "name": "Moxie Beauty",
        "category": "Hair Care",
        "subcategories": ["Beauty", "Emerging Brands"],
        "needs": ["Hair Cream", "Dry Hair", "Hair Styling", "Hair Fall"],
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
        "advantages": ["Highly precise custom hydration lines for textured hair", "Extreme sincerity in customer engagement and feedback loops", "Clean, non-toxic, lightweight hair protectants"],
        "disadvantages": ["Limited offline distribution network", "High demand occasionally leads to short inventory outages", "Price per ounce is higher than mass drug store brands"],
        "verifiedStatus": True,
        "trustedCircle": {"friendsRecommend": 12, "familyPurchased": 8, "mentorsTrust": 4, "expertsRecommend": 7, "score": 96},
        "accountability": {"expectationsMet": 94, "wouldBuyAgain": 92, "fulfilledPromises": 95, "reliableService": 93, "wouldRecommend": 94},
        "breakdown": {"transparency": 96, "customerSatisfaction": 92, "reviewAuthenticity": 95, "consistency": 90, "communityTrust": 91, "trustedCircle": 96, "brandMaturity": 72, "scamRiskAdjustment": 0},
        "journey": [{"year": 2024, "score": 89}, {"year": 2025, "score": 92}],
        "badges": ["Texture Perfect", "Founder Sincerity"]
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

    # Detail Profile view active block
    if "selected_brand" in st.session_state:
        selected_id = st.session_state["selected_brand"]
        matched_b = next((b for b in BRANDS_DB if b["id"] == selected_id), None)
        if matched_b:
            st.markdown(f"## {matched_b['name']} Detailed Trust Dossier")
            st.markdown(f"**Overall Trust Rating:** {matched_b['score']}/100")
            st.markdown(f"**Scam Risk Indicator:** {matched_b['scamRisk']}")
            st.info(matched_b["aiSummary"])
            
            pcol1, pcol2 = st.columns(2)
            with pcol1:
                st.markdown("##### Advantages")
                for a in matched_b["advantages"]:
                    st.write(f"✅ {a}")
            with pcol2:
                st.markdown("##### Disadvantages")
                for d in matched_b["disadvantages"]:
                    st.write(f"⚠️ {d}")

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
