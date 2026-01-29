import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ta';

interface Translations {
    [key: string]: {
        en: string;
        ta: string;
    };
}

const translations: Translations = {
    // Navigation
    home: { en: 'Home', ta: 'முகப்பு' },
    properties: { en: 'Properties', ta: 'சொத்துக்கள்' },
    favorites: { en: 'Favorites', ta: 'விருப்பங்கள்' },
    postProperty: { en: 'Post Property', ta: 'சொத்தை பதிவு செய்' },
    login: { en: 'Login', ta: 'உள்நுழை' },
    logout: { en: 'Logout', ta: 'வெளியேறு' },
    myProperties: { en: 'My Properties', ta: 'எனது சொத்துக்கள்' },

    // Hero
    findDreamProperty: { en: 'Find Your Dream Property', ta: 'உங்கள் கனவு இல்லத்தை தேடுங்கள்' },
    withoutBrokerage: { en: 'Without Brokerage', ta: 'தரகர் கட்டணம் இல்லை' },
    heroSubtitle: {
        en: 'Buy, rent, or find PG accommodations directly from owners. Zero brokerage fees, verified listings, and AI-powered search to find your perfect home.',
        ta: 'உரிமையாளர்களிடமிருந்து நேரடியாக வாங்க, வாடகைக்கு எடுக்க அல்லது PG தங்குமிடங்களைக் கண்டறியவும். தரகர் கட்டணம் இல்லை, சரிபார்க்கப்பட்ட பட்டியல்கள்.'
    },
    availableIn: { en: 'Available only in Coimbatore (Phase 1)', ta: 'கோவையில் மட்டும் கிடைக்கிறது (கட்டம் 1)' },

    // Search
    buy: { en: 'Buy', ta: 'வாங்க' },
    rent: { en: 'Rent', ta: 'வாடகை' },
    pg: { en: 'PG / Co-Living', ta: 'PG / வசிப்பிடம்' },
    searchPlaceholder: { en: 'Search location, project, or locality...', ta: 'இடம் அல்லது பகுதியைத் தேடுங்கள்...' },
    search: { en: 'Search', ta: 'தேடு' },
    chatSearch: { en: 'Chat to Search', ta: 'தேட அரட்டையடிக்கவும்' },
    orBrowse: { en: 'or browse below', ta: 'அல்லது கீழே உலாவவும்' },

    // Location Modal
    useLocation: { en: 'Use your location?', ta: 'உங்கள் இருப்பிடத்தைப் பயன்படுத்தவா?' },
    enableLocationText: {
        en: 'Enable location to find properties near you and see accurate distances.',
        ta: 'உங்களுக்கு அருகிலுள்ள சொத்துக்களைக் கண்டறியவும், துல்லியமான தூரத்தைக் காணவும் இருப்பிடத்தை இயக்கவும்.'
    },
    enableLocationButton: { en: 'Enable Location', ta: 'இருப்பிடத்தை இயக்கு' },
    locationError: { en: 'Error getting location', ta: 'இருப்பிடத்தைப் பெறுவதில் பிழை' },

    // How It Works
    howItWorks: { en: 'How It Works', ta: 'எப்படி இது செயல்படுகிறது' },
    howItWorksSubtitle: { en: 'Your journey to finding the perfect property in 3 simple steps', ta: 'உங்கள் கனவு சொத்தை 3 எளிய படிகளில் கண்டறியலாம்' },
    searchProperty: { en: 'Search Property', ta: 'சொத்தை தேடுங்கள்' },
    searchDesc: { en: 'Browse through thousands of verified listings using our smart filters.', ta: 'எங்கள் ஸ்மார்ட் வடிப்பான்களைப் பயன்படுத்தி சரிபார்க்கப்பட்ட ஆயிரக்கணக்கான பட்டியல்களை உலாவவும்.' },
    shortlistVisit: { en: 'Shortlist & Visit', ta: 'தேர்வு செய்து பார்வையிடவும்' },
    shortlistDesc: { en: 'Shortlist your favorites and schedule visits directly with owners.', ta: 'உங்களுக்கு பிடித்தவற்றை பட்டியலிட்டு, உரிமையாளர்களுடன் நேரடியாக பார்வையிட திட்டமிடுங்கள்.' },
    closeDeal: { en: 'Close the Deal', ta: 'ஒப்பந்தத்தை முடிக்கவும்' },
    closeDesc: { en: 'Connect, negotiate, and finalize your dream property seamlessly.', ta: 'இணந்து, பேரம் பேசி, உங்கள் கனவு சொத்தை சுமூகமாக முடிக்கவும்.' },

    // Homepage Headings
    popularLocalities: { en: 'Popular Localities:', ta: 'பிரபலமான இடங்கள்:' },
    experienceExtraordinary: { en: 'Experience The Extraordinary', ta: 'அசாதாரணத்தை அனுபவிக்கவும்' },
    experienceSubtitle: { en: 'Explore properties across different categories and find the perfect match for your needs', ta: 'பல்வேறு வகைகளில் உள்ள சொத்துக்களை ஆராய்ந்து, உங்கள் தேவைகளுக்கு ஏற்ற சிறந்த தேர்வைக் கண்டறியவும்' },
    featuredProperties: { en: 'Featured Properties', ta: 'சிறப்பு சொத்துக்கள்' },
    featuredSubtitle: { en: 'Handpicked properties verified by our team', ta: 'எங்கள் குழுவால் சரிபார்க்கப்பட்ட தேர்ந்தெடுக்கப்பட்ட சொத்துக்கள்' },
    viewAll: { en: 'View All', ta: 'அனைத்தையும் பார்க்க' },
    recommendedSellers: { en: 'Recommended Sellers', ta: 'பரிந்துரைக்கப்பட்ட விற்பனையாளர்கள்' },
    sellersSubtitle: { en: 'Sellers with complete knowledge about locality and verified track record', ta: 'பகுதி பற்றிய முழுமையான அறிவு மற்றும் சரிபார்க்கப்பட்ட பதிவு கொண்ட விற்பனையாளர்கள்' },
    havePropertyToSell: { en: 'Have a Property to Sell?', ta: 'விற்க ஒரு சொத்து உள்ளதா?' },
    listPropertyDesc: { en: 'List your property & connect with genuine buyers faster! Zero brokerage, maximum reach.', ta: 'உங்கள் சொத்தைப் பட்டியலிட்டு, உண்மையான வாங்குபவர்களுடன் வேகமாக இணையுங்கள்! தரகர் கட்டணம் இல்லை, அதிகபட்ச வரம்பு.' },
    postYourProperty: { en: 'Post Your Property', ta: 'உங்கள் சொத்தைப் பதிவு செய்யவும்' },

    // Property Types
    apartment: { en: 'Apartment', ta: 'அடுக்குமாடி குடியிருப்பு' },
    house: { en: 'House', ta: 'வீடு' },
    villa: { en: 'Villa', ta: 'வில்லா' },
    plot: { en: 'Plot/Land', ta: 'மனை / நிலம்' },
    commercial: { en: 'Commercial', ta: 'வணிக வளாகம்' },
    pgHostels: { en: 'PG / Hostels', ta: 'PG / விடுதிகள்' },

    // PG Types
    singleRoom: { en: 'Single Room', ta: 'தனி அறை' },
    sharedRoom: { en: 'Shared Room', ta: 'பகிரப்பட்ட அறை' },
    malePg: { en: 'Male PG', ta: 'ஆண்கள் PG' },
    femalePg: { en: 'Female PG', ta: 'பெண்கள் PG' },
    coLiving: { en: 'Co-Living', ta: 'கூட்டு வாழ்க்கை' },
    allPg: { en: 'All PG / Co-Living', ta: 'அனைத்து PG / கூட்டு வாழ்க்கை' },
    allTypes: { en: 'All Types', ta: 'அனைத்து வகைகள்' },
    propertyType: { en: 'Property Type', ta: 'சொத்து வகை' },

    // Pricing
    pricingPlans: { en: 'Pricing Plans', ta: 'விலை திட்டங்கள்' },
    pricingSubtitle: { en: 'Experience the power of ZeroBroker with our special launch offer.', ta: 'எங்கள் சிறப்பு அறிமுக சலுகையுடன் ZeroBroker-ன் நன்மைகளை அனுபவிக்கவும்.' },
    launchOffer: { en: 'Launch Offer', ta: 'அறிமுக சலுகை' },
    premiumFree: { en: 'Premium is FREE for 6 Months!', ta: 'பிரீமியம் 6 மாதங்களுக்கு இலவசம்!' },
    premiumDesc: { en: 'To celebrate our launch, we are giving early adopters exclusive access to all premium features completely free for the first 6 months.', ta: 'எங்கள் தொடக்கத்தைக் கொண்டாடும் விதமாக, முதல் 6 மாதங்களுக்கு அனைத்து பிரீமியம் அம்சங்களையும் முற்றிலும் இலவசமாக வழங்குகிறோம்.' },
    startFreeTrial: { en: 'Start Your Free Trial', ta: 'உங்கள் இலவச சோதனையைத் தொடங்கவும்' },
    limitedTimeOffer: { en: 'Limited Time Offer', ta: 'குறுகிய கால சலுகை' },

    // Pricing Features
    unlimitedListings: { en: 'Unlimited Property Listings', ta: 'வரம்பற்ற சொத்து பட்டியல்கள்' },
    rmManager: { en: 'Dedicated Relationship Manager', ta: 'பிரத்யேக உறவு மேலாளர்' },
    verifiedLeads: { en: 'Verified Leads access', ta: 'சரிபார்க்கப்பட்ட வாடிக்கையாளர் அணுகல்' },
    prioritySupport: { en: 'Priority Support', ta: 'முன்னுரிமை ஆதரவு' },
    featuredTag: { en: 'Featured Tag on Listings', ta: 'பட்டியல்களில் சிறப்பு குறிச்சொல்' },
    noCreditCard: { en: 'No Credit Card Required', ta: 'கிரெடிட் கார்டு தேவையில்லை' },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
