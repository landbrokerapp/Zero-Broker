import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles, Upload, CheckCircle, MapPin, Building2, Home, Building, TreePine, Warehouse, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { tamilNaduCities, budgetRanges } from '@/data/mockProperties';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/contexts/PropertyContext';
import { Property } from '@/data/mockProperties';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: React.ReactNode;
  options?: string[];
  cityPicker?: boolean;
  localityPicker?: string; // city name to show localities for
}

interface ChatState {
  step: number;
  mode: 'search' | 'post';
  searchIntent?: 'buy' | 'rent' | 'pg';
  searchCity?: string;
  searchLocality?: string;
  searchType?: string;
  searchBudget?: string;
  searchBHK?: string;
  searchFurnishing?: string;
  postPurpose?: 'Sale' | 'Rent' | 'PG';
  postType?: string;
  postCity?: string;
  postLocality?: string;
  postBHK?: string;
  postArea?: string;
  postPrice?: string;
  postImages?: File[];
  tempData?: any;
}

// ── City metadata for the visual city picker ──────────────────────────────────
const CITY_META: Record<string, { emoji: string; tagline: string }> = {
  'Coimbatore': { emoji: '🏙️', tagline: 'Manchester of South India' },
  'Chennai': { emoji: '🌊', tagline: 'Capital City' },
  'Madurai': { emoji: '🛕', tagline: 'Temple City' },
  'Trichy': { emoji: '🏛️', tagline: 'Rock Fort City' },
  'Salem': { emoji: '⚙️', tagline: 'Steel City' },
  'Tiruppur': { emoji: '👕', tagline: 'Knitwear Capital' },
  'Erode': { emoji: '🌿', tagline: 'Turmeric City' },
  'Vellore': { emoji: '🏰', tagline: 'Fort City' },
  'Tirunelveli': { emoji: '🌾', tagline: 'Wheat Halwa City' },
  'Thoothukudi': { emoji: '⚓', tagline: 'Port City' },
  'Hosur': { emoji: '🏭', tagline: 'Industrial Hub' },
  'Kancheepuram': { emoji: '🧵', tagline: 'Silk City' },
  'Thanjavur': { emoji: '🎭', tagline: 'Cultural Capital' },
  'Nagercoil': { emoji: '🌴', tagline: 'Cape City' },
};

// ── City Picker Component ─────────────────────────────────────────────────────
function CityPicker({ onSelect }: { onSelect: (city: string) => void }) {
  const cities = Object.keys(tamilNaduCities);
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {cities.map(city => {
        const meta = CITY_META[city] ?? { emoji: '🏙️', tagline: '' };
        return (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="flex items-center gap-2 px-3 py-2.5 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <span className="text-xl leading-none">{meta.emoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{city}</p>
              {meta.tagline && <p className="text-[10px] text-muted-foreground truncate">{meta.tagline}</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Locality Picker Component ─────────────────────────────────────────────────
function LocalityPicker({ city, onSelect }: { city: string; onSelect: (loc: string) => void }) {
  const localities = tamilNaduCities[city] ?? [];
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {localities.map(loc => (
        <button
          key={loc}
          onClick={() => onSelect(loc)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-xs font-medium text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
        >
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {loc}
        </button>
      ))}
    </div>
  );
}

// ── Main ChatBot ──────────────────────────────────────────────────────────────
export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { addProperty } = useProperties();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatState, setChatState] = useState<ChatState>({ step: 1, mode: 'search', tempData: {} });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const greeting = user
      ? `Hello ${user.name.split(' ')[0]}! 👋 I'm your property assistant. What are you looking for?`
      : "Hello! 👋 I'm your property assistant. What are you looking for?";
    setMessages([{
      id: '1',
      type: 'bot',
      content: greeting,
      options: ['🏠 Buy', '🔑 Rent', '🛏️ PG / Co-Living', '📋 Post Your Property'],
    }]);
  }, [user]);

  const addMessage = (content: React.ReactNode, type: 'bot' | 'user', options?: string[], extra?: Partial<Message>) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type,
      content,
      options,
      ...extra,
    }]);
  };

  const handleOptionSelect = (option: string) => {
    // Strip emoji prefix for processing
    const clean = option.replace(/^[\p{Emoji}\s]+/u, '').trim();
    addMessage(option, 'user');
    processInput(clean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    addMessage(inputValue, 'user');
    processInput(inputValue);
    setInputValue('');
  };

  const processInput = (input: string) => {
    setTimeout(() => {
      if (chatState.step === 1) {
        if (input.toLowerCase().includes('post') || input.toLowerCase().includes('sell')) {
          startPostFlow();
        } else {
          startSearchFlow(input);
        }
        return;
      }
      if (chatState.mode === 'post') {
        handlePostFlow(input);
      } else {
        handleSearchFlow(input);
      }
    }, 400);
  };

  // ── POST FLOW ───────────────────────────────────────────────────────────────

  const startPostFlow = () => {
    setChatState(prev => ({ ...prev, mode: 'post', step: 201, tempData: {} }));
    addMessage("Great! 👍 Let's post your property. Are you looking to Sell, Rent out, or list a PG?", 'bot', ['Sale', 'Rent', 'PG']);
  };

  const handlePostFlow = (input: string) => {
    const { step, postPurpose, postType, tempData } = chatState;

    if (step === 201) {
      if (!['Sale', 'Rent', 'PG'].includes(input)) {
        addMessage("Please select one of the options below.", 'bot', ['Sale', 'Rent', 'PG']);
        return;
      }
      const purpose = input as 'Sale' | 'Rent' | 'PG';
      const options = purpose === 'PG'
        ? ['PG for Men', 'PG for Women', 'PG for Coliving']
        : ['Apartment / Flat', 'Independent House', 'Villa', 'Plot / Land', 'Commercial Office', 'Shop / Showroom'];
      setChatState(prev => ({ ...prev, postPurpose: purpose, step: 202 }));
      addMessage(`Okay, for ${purpose}. What type of property is it?`, 'bot', options);
      return;
    }

    if (step === 202) {
      setChatState(prev => ({ ...prev, postType: input, step: 203 }));
      // Show city picker
      addMessage("Which city is your property in? 🏙️", 'bot', undefined, { cityPicker: true });
      return;
    }

    if (step === 203) {
      setChatState(prev => ({ ...prev, postCity: input, step: 204 }));
      // Show locality picker for selected city
      addMessage(`Great! Which area in ${input}?`, 'bot', undefined, { localityPicker: input });
      return;
    }

    if (step === 204) {
      const loc = input;
      const type = postType || '';
      if (type.includes('Plot') || type.includes('Land')) {
        setChatState(prev => ({ ...prev, postLocality: loc, step: 301 }));
        addMessage("What is the total Plot Area? (e.g., 1200 sqft, 5 cents)", 'bot');
      } else if (type.includes('Commercial') || type.includes('Shop')) {
        setChatState(prev => ({ ...prev, postLocality: loc, step: 310 }));
        addMessage("What is the Built-up Area? (sqft)", 'bot');
      } else if (chatState.postPurpose === 'PG') {
        setChatState(prev => ({ ...prev, postLocality: loc, step: 320 }));
        addMessage("How much is the Rent per Bed? (₹)", 'bot');
      } else {
        setChatState(prev => ({ ...prev, postLocality: loc, step: 205 }));
        addMessage("How many Bedrooms (BHK)?", 'bot', ['1 BHK', '2 BHK', '3 BHK', '4+ BHK']);
      }
      return;
    }

    if (step === 205) {
      setChatState(prev => ({ ...prev, postBHK: input, step: 206 }));
      addMessage("How many Bathrooms?", 'bot', ['1', '2', '3+']);
      return;
    }
    if (step === 206) {
      setChatState(prev => ({ ...prev, tempData: { ...tempData, bathrooms: input }, step: 207 }));
      addMessage("Furnishing status?", 'bot', ['Fully Furnished', 'Semi Furnished', 'Unfurnished']);
      return;
    }
    if (step === 207) {
      setChatState(prev => ({ ...prev, tempData: { ...tempData, furnishing: input }, step: 208 }));
      addMessage("Built-up Area in sqft?", 'bot');
      return;
    }
    if (step === 208) {
      setChatState(prev => ({ ...prev, postArea: input, step: 400 }));
      askPricing(chatState.postPurpose!);
      return;
    }

    if (step === 301) {
      setChatState(prev => ({ ...prev, postArea: input, step: 302 }));
      addMessage("Any specific Facing?", 'bot', ['North', 'South', 'East', 'West', 'Corner Bit']);
      return;
    }
    if (step === 302) {
      setChatState(prev => ({ ...prev, tempData: { ...tempData, facing: input }, step: 400 }));
      askPricing(chatState.postPurpose!);
      return;
    }

    if (step === 310) {
      setChatState(prev => ({ ...prev, postArea: input, step: 311 }));
      addMessage("Does it include Washroom and Parking?", 'bot', ['Yes, Both', 'Only Parking', 'Only Washroom', 'None']);
      return;
    }
    if (step === 311) {
      setChatState(prev => ({ ...prev, tempData: { ...tempData, commAmenities: input }, step: 400 }));
      askPricing(chatState.postPurpose!);
      return;
    }

    if (step === 320) {
      setChatState(prev => ({ ...prev, postPrice: input, step: 321 }));
      addMessage("Sharing type?", 'bot', ['Single', 'Double', 'Triple', '3+ Sharing']);
      return;
    }
    if (step === 321) {
      setChatState(prev => ({ ...prev, tempData: { ...tempData, pgSharing: input }, step: 322 }));
      addMessage("Is Food included?", 'bot', ['Yes', 'No', 'Available at extra cost']);
      return;
    }
    if (step === 322) {
      setChatState(prev => ({ ...prev, tempData: { ...tempData, pgFood: input }, step: 500 }));
      askPhotos();
      return;
    }

    if (step === 400) {
      setChatState(prev => ({ ...prev, postPrice: input, step: 500 }));
      askPhotos();
      return;
    }

    if (step === 500) {
      if (input === 'Upload Photos 📸') {
        fileInputRef.current?.click();
        return;
      }
      if (input === 'Skip for Now') {
        finalizePost();
        return;
      }
      return;
    }

    if (step === 600) {
      if (input.includes('Submit')) {
        submitPropertyToDB();
      } else {
        addMessage("Okay, you can restart anytime.", 'bot');
        setChatState({ step: 1, mode: 'search', tempData: {} });
      }
    }
  };

  const submitPropertyToDB = async () => {
    setIsSubmitting(true);
    addMessage("Submitting your property... ⏳", 'bot');

    try {
      const { postPurpose, postType, postCity, postLocality, postBHK, postArea, postPrice, postImages, tempData } = chatState;

      // Handle Image Uploads
      let imageUrls: string[] = ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'];
      if (postImages && postImages.length > 0) {
        try {
          addMessage("Uploading your photos... 📸", 'bot');
          const uploadedUrls = await Promise.all(
            postImages.map(file => uploadToCloudinary(file))
          );
          if (uploadedUrls.length > 0) {
            imageUrls = uploadedUrls;
          }
        } catch (uploadError) {
          console.error('Image upload failed, using placeholder:', uploadError);
        }
      }

      const intentMap: Record<string, 'buy' | 'rent' | 'pg'> = {
        'Sale': 'buy',
        'Rent': 'rent',
        'PG': 'pg'
      };

      const propertyData: Omit<Property, 'id' | 'postedDate' | 'verified'> = {
        title: `${postBHK ? postBHK + ' ' : ''}${postType} in ${postLocality}`,
        type: (postType?.toLowerCase().includes('pg') ? 'pg'
          : postType?.toLowerCase().includes('apartment') ? 'apartment'
            : postType?.toLowerCase().includes('house') ? 'house'
              : postType?.toLowerCase().includes('villa') ? 'villa'
                : postType?.toLowerCase().includes('plot') ? 'plot'
                  : postType?.toLowerCase().includes('commercial') ? 'commercial'
                    : 'apartment') as Property['type'],
        intent: intentMap[postPurpose!] || 'buy',
        purpose: postPurpose,
        price: parseInt(postPrice?.replace(/[^\d]/g, '') || '0') || 0,
        priceUnit: postPurpose === 'Sale' ? 'total' : 'month',
        priceNegotiable: true,
        maintenanceCharges: 0,
        securityDeposit: postPurpose === 'Sale' ? 0 : (parseInt(postPrice?.replace(/[^\d]/g, '') || '0') * 5),
        foodIncluded: tempData?.pgFood?.toLowerCase().includes('yes'),
        locality: postLocality || '',
        city: postCity || '',
        address: `${postLocality}, ${postCity}`,
        landmark: '',
        pincode: '',
        bhk: postBHK || '',
        bathrooms: parseInt(tempData?.bathrooms || '1') || 1,
        balconies: 0,
        parking: 'Available',
        builtUpArea: parseInt(postArea?.replace(/[^\d]/g, '') || '0') || 0,
        floor: '1',
        totalFloors: 1,
        furnishing: (tempData?.furnishing?.toLowerCase().includes('fully') ? 'fully-furnished'
          : tempData?.furnishing?.toLowerCase().includes('semi') ? 'semi-furnished'
            : 'unfurnished') as Property['furnishing'],
        amenities: [],
        images: imageUrls,
        description: `Posted via ChatBot. ${postType} in ${postLocality}, ${postCity}.`,
        sellerId: user?.id || 'anonymous',
        sellerName: user?.name || 'User',
        sellerPhone: user?.phone || '9999999999',
        pgDetails: postPurpose === 'PG' ? {
          pgType: (postType?.toLowerCase().includes('women') ? 'girls' : postType?.toLowerCase().includes('men') ? 'boys' : 'coliving') as any,
          roomType: (tempData?.pgSharing?.toLowerCase().includes('single') ? 'single' : tempData?.pgSharing?.toLowerCase().includes('double') ? 'double' : 'shared') as any,
          foodType: 'both',
          electricityChargesIncluded: true
        } : undefined
      };

      await addProperty(propertyData, false); // false = pending admin approval
      addMessage("🎉 **Your property is successfully posted!** Our team will review and make it live shortly.", 'bot');

      setTimeout(() => {
        setIsOpen(false);
        setChatState({ step: 1, mode: 'search', tempData: {} });
        // Reset messages after a delay
        setTimeout(() => setMessages([]), 1000);
      }, 4000);
    } catch (error: any) {
      console.error('ChatBot submission error:', error);
      const errorMsg = error.message || "Unknown database error";
      addMessage(`❌ Submission failed: ${errorMsg}. Please try again.`, 'bot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const askPricing = (purpose: string) => {
    const prompt = purpose === 'Sale' ? "What is the Expected Price? (₹)" : "What is the Monthly Rent? (₹)";
    addMessage(prompt, 'bot');
  };

  const askPhotos = () => {
    setChatState(prev => ({ ...prev, step: 500 }));
    addMessage("Would you like to upload photos now?", 'bot', ['Upload Photos 📸', 'Skip for Now']);
  };

  const finalizePost = () => {
    setChatState(prev => ({ ...prev, step: 600 }));
    const { postPurpose, postType, postLocality, postCity, postPrice } = chatState;
    const summary = (
      <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-1.5 border border-border mt-2">
        <p><strong>Type:</strong> {postType} ({postPurpose})</p>
        <p><strong>Location:</strong> {postLocality}, {postCity}</p>
        <p><strong>Price:</strong> {postPrice}</p>
        <p className="text-xs text-muted-foreground mt-2">Ready to submit?</p>
      </div>
    );
    addMessage(<div>Here's a summary of your property: {summary}</div>, 'bot');
    setTimeout(() => {
      addMessage("Do you want to submit this property?", 'bot', ['✅ Submit Property', '❌ Cancel']);
    }, 500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addMessage(`📸 ${e.target.files.length} photo(s) selected.`, 'user');
      setChatState(prev => ({ ...prev, postImages: Array.from(e.target.files || []) }));
      setTimeout(() => finalizePost(), 1000);
    }
  };

  // ── SEARCH FLOW ─────────────────────────────────────────────────────────────

  const startSearchFlow = (input: string) => {
    const intent = input.toLowerCase().includes('pg') ? 'pg'
      : input.toLowerCase().includes('rent') ? 'rent'
        : 'buy';
    setChatState(prev => ({ ...prev, mode: 'search', step: 2, searchIntent: intent as any }));

    // Step 2: Ask property type FIRST (OLX / MagicBricks style)
    const isPG = intent === 'pg';
    const typeOptions = isPG
      ? ['PG for Men', 'PG for Women', 'PG for Coliving']
      : ['🏢 Apartment / Flat', '🏠 Independent House', '🏡 Villa', '🌳 Plot / Land', '🏬 Commercial'];
    addMessage("What type of property are you looking for?", 'bot', typeOptions);
  };

  const handleSearchFlow = (input: string) => {
    const { step, searchIntent } = chatState;

    // Step 2 → Property Type received → ask City
    if (step === 2) {
      const clean = input.replace(/^[\p{Emoji}\s]+/u, '').trim();
      setChatState(prev => ({ ...prev, searchType: clean, step: 3 }));
      addMessage("Which city are you looking in? 🏙️", 'bot', undefined, { cityPicker: true });
      return;
    }

    // Step 3 → City received → ask Locality
    if (step === 3) {
      if (!tamilNaduCities[input]) {
        addMessage(`I don't have data for "${input}" yet. Please pick a city below.`, 'bot', undefined, { cityPicker: true });
        return;
      }
      setChatState(prev => ({ ...prev, searchCity: input, step: 4 }));
      addMessage(`Great! Which area in ${input} are you interested in?`, 'bot', undefined, { localityPicker: input });
      return;
    }

    // Step 4 → Locality received → ask Budget
    if (step === 4) {
      setChatState(prev => ({ ...prev, searchLocality: input, step: 5 }));
      const budgetOptions = searchIntent === 'buy'
        ? budgetRanges.buy.map(b => b.label)
        : searchIntent === 'pg'
          ? budgetRanges.pg.map(b => b.label)
          : budgetRanges.rent.map(b => b.label);
      addMessage("What's your budget?", 'bot', budgetOptions);
      return;
    }

    // Step 5 → Budget received → ask BHK / Sharing (skip for Plot/Commercial)
    if (step === 5) {
      setChatState(prev => ({ ...prev, searchBudget: input, step: 6 }));
      const type = chatState.searchType || '';
      if (type.includes('Plot') || type.includes('Commercial')) {
        finishSearch(input);
        return;
      }
      if (searchIntent === 'pg') {
        addMessage("Sharing preference?", 'bot', ['Single', 'Double', 'Triple', 'Any']);
      } else {
        addMessage("How many Bedrooms (BHK)?", 'bot', ['1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Any']);
      }
      return;
    }

    // Step 6 → BHK / Sharing received → ask Furnishing (skip for PG)
    if (step === 6) {
      setChatState(prev => ({ ...prev, searchBHK: input, step: 7 }));
      if (searchIntent === 'pg') {
        finishSearch(input);
      } else {
        addMessage("Furnishing preference?", 'bot', ['Fully Furnished', 'Semi Furnished', 'Unfurnished', 'Any']);
      }
      return;
    }

    // Step 7 → Furnishing received → finish
    if (step === 7) {
      setChatState(prev => ({ ...prev, searchFurnishing: input }));
      finishSearch(input);
    }
  };

  const finishSearch = (_lastInput: string) => {
    addMessage("🎉 Found matching properties! Let me show you the results.", 'bot');
    setTimeout(() => {
      const params = new URLSearchParams();
      if (chatState.searchIntent) params.set('intent', chatState.searchIntent);
      if (chatState.searchCity) params.set('city', chatState.searchCity);
      if (chatState.searchLocality) params.set('locality', chatState.searchLocality);
      navigate(`/properties?${params.toString()}`);
      setIsOpen(false);
      setChatState({ step: 1, mode: 'search', tempData: {} });
    }, 1500);
  };

  // ── City / Locality selection from pickers ──────────────────────────────────
  const handleCityPick = (city: string) => {
    addMessage(city, 'user');
    processInput(city);
  };

  const handleLocalityPick = (loc: string) => {
    addMessage(loc, 'user');
    processInput(loc);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-hero shadow-lg flex items-center justify-center hover:scale-105 transition-transform ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="w-7 h-7 text-primary-foreground" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-accent rounded-full animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[390px] max-w-[calc(100vw-48px)] h-[620px] max-h-[calc(100vh-100px)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-hero p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-background/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-primary-foreground">
                    {user ? `Hi, ${user.name.split(' ')[0]}` : 'AI Assistant'}
                  </h3>
                  <p className="text-xs text-primary-foreground/70">Powered by ZeroBroker</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center hover:bg-background/30 transition-colors"
              >
                <X className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 ${message.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                      }`}
                  >
                    <div className="text-sm">{message.content}</div>

                    {/* Quick reply chips */}
                    {message.options && message.type === 'bot' && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            className="px-3 py-1.5 text-xs font-medium bg-card text-foreground rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* City picker grid */}
                    {message.cityPicker && message.type === 'bot' && (
                      <CityPicker onSelect={handleCityPick} />
                    )}

                    {/* Locality chips */}
                    {message.localityPicker && message.type === 'bot' && (
                      <LocalityPicker city={message.localityPicker} onSelect={handleLocalityPick} />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your answer or pick above…"
                  className="flex-1 px-4 py-2.5 bg-muted rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button type="submit" size="icon" className="rounded-full bg-gradient-hero hover:opacity-90 flex-shrink-0" disabled={isSubmitting}>
                  <Send className="w-4 h-4" />
                </Button>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
