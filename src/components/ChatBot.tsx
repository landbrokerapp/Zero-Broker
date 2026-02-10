import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { localities, budgetRanges } from '@/data/mockProperties';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: React.ReactNode;
  options?: string[];
}

interface ChatState {
  step: number;
  mode: 'search' | 'post'; // Top level mode
  // Search State
  searchIntent?: 'buy' | 'rent' | 'pg';
  searchCity?: string;
  searchLocality?: string;

  // Post Property State
  postPurpose?: 'Sale' | 'Rent' | 'PG';
  postType?: string; // Apartment, Villa, Plot, etc.
  postCity?: string;
  postLocality?: string;
  postBHK?: string;
  postArea?: string;
  postPrice?: string;
  postImages?: File[];
  tempData?: any; // To store intermediate answers like bathrooms, furnishing, etc.
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatState, setChatState] = useState<ChatState>({ step: 1, mode: 'search', tempData: {} });
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Greeting
  useEffect(() => {
    const greeting = user
      ? `Hello! ${user.name} 👋 I'm your property search assistant. Let me help you find your perfect property. What are you looking for?`
      : "Hello! 👋 I'm your property search assistant. Let me help you find your perfect property. What are you looking for?";

    setMessages([
      {
        id: '1',
        type: 'bot',
        content: greeting,
        options: ['Buy', 'Rent', 'PG / Co-Living', 'Post Your Property'],
      }
    ]);
  }, [user]);

  const addMessage = (content: React.ReactNode, type: 'bot' | 'user', options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      options,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // --- HANDLERS ---

  const handleOptionSelect = (option: string) => {
    addMessage(option, 'user');
    processInput(option);
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
      // --- GLOBAL INTENT DETECTION (Step 1) ---
      if (chatState.step === 1) {
        if (input === 'Post Your Property' || input.toLowerCase().includes('post') || input.toLowerCase().includes('sell')) {
          startPostFlow();
        } else {
          startSearchFlow(input);
        }
        return;
      }

      // --- ROUTE TO CORRECT FLOW ---
      if (chatState.mode === 'post') {
        handlePostFlow(input);
      } else {
        handleSearchFlow(input);
      }
    }, 500);
  };

  // ==========================================
  //            POST PROPERTY FLOW
  // ==========================================

  const startPostFlow = () => {
    setChatState(prev => ({ ...prev, mode: 'post', step: 201, tempData: {} }));
    addMessage("Great 👍 Let’s post your property. It will take just 2–3 minutes. First, are you looking to Sell, Rent out, or list a PG?", 'bot', ['Sale', 'Rent', 'PG']);
  };

  const handlePostFlow = (input: string) => {
    const { step, postPurpose, postType, tempData } = chatState;

    // 201: Purpose Selection
    if (step === 201) {
      // Validate
      if (!['Sale', 'Rent', 'PG'].includes(input)) {
        addMessage("Please select one of the options below.", 'bot', ['Sale', 'Rent', 'PG']);
        return;
      }
      const purpose = input as 'Sale' | 'Rent' | 'PG';

      // Next: Property Type based on purpose
      let options: string[] = [];
      if (purpose === 'PG') {
        options = ['PG for Men', 'PG for Women', 'PG for Coliving'];
      } else {
        options = ['Apartment / Flat', 'Independent House', 'Villa', 'Plot / Land', 'Commercial Office', 'Shop / Showroom'];
      }

      setChatState(prev => ({ ...prev, postPurpose: purpose, step: 202 }));
      addMessage(`Okay, for ${purpose}. What type of property is it?`, 'bot', options);
      return;
    }

    // 202: Property Type
    if (step === 202) {
      setChatState(prev => ({ ...prev, postType: input, step: 203 }));
      addMessage("Which *City* is your property located in?", 'bot'); // Ask City
      return;
    }

    // 203: City -> Ask Locality
    if (step === 203) {
      setChatState(prev => ({ ...prev, postCity: input, step: 204 }));
      addMessage("Great! Now, which *Area / Locality*? (e.g., Gandhipuram, RS Puram)", 'bot');
      return;
    }

    // 204: Locality -> Ask Smart Details (Branching Logic)
    if (step === 204) {
      const loc = input;
      setChatState(prev => ({ ...prev, postLocality: input, step: 205 }));

      // Determine next question based on Property Type
      const type = postType || '';

      if (type.includes('Plot') || type.includes('Land')) {
        // Skip Bedroom/Bath logic for Land
        setChatState(prev => ({ ...prev, postLocality: loc, step: 301 })); // Jump to Land Area
        addMessage("Got it. What is the total **Plot Area**? (e.g., 1200 sqft, 5 cents)", 'bot');
      } else if (type.includes('Commercial') || type.includes('Shop')) {
        // Commercial Logic
        setChatState(prev => ({ ...prev, postLocality: loc, step: 310 })); // Jump to Comm Area
        addMessage("What is the **Built-up Area**? (sqft)", 'bot');
      } else if (chatState.postPurpose === 'PG') {
        // PG Logic
        setChatState(prev => ({ ...prev, postLocality: loc, step: 320 })); // Jump to PG Beds
        addMessage("How much is the **Rent per Bed**? (₹)", 'bot');
      } else {
        // Residential (House/Apt/Villa)
        setChatState(prev => ({ ...prev, postLocality: loc, step: 205 })); // Continue to Bedrooms
        addMessage("How many **Bedrooms** (BHK)?", 'bot', ['1 BHK', '2 BHK', '3 BHK', '4+ BHK']);
      }
      return;
    }

    // --- RESIDENTIAL FLOW (Apt/House) ---
    if (step === 205) { // BHK Received
      setChatState(prev => ({ ...prev, postBHK: input, step: 206 }));
      addMessage("How many **Bathrooms**?", 'bot', ['1', '2', '3+']);
      return;
    }
    if (step === 206) { // Bathrooms Received, Ask Furnishing
      setChatState(prev => ({ ...prev, tempData: { ...tempData, bathrooms: input }, step: 207 }));
      addMessage("What is the **Furnishing** status?", 'bot', ['Fully Furnished', 'Semi Furnished', 'Unfurnished']);
      return;
    }
    if (step === 207) { // Furnishing Received, Ask Area
      setChatState(prev => ({ ...prev, tempData: { ...tempData, furnishing: input }, step: 208 }));
      addMessage("What is the **Built-up Area** in sqft?", 'bot');
      return;
    }
    if (step === 208) { // Area Received, Go to Pricing
      setChatState(prev => ({ ...prev, postArea: input, step: 400 })); // Jump to Pricing
      askPricing(chatState.postPurpose!);
      return;
    }

    // --- LAND FLOW ---
    if (step === 301) { // Plot Area Received
      setChatState(prev => ({ ...prev, postArea: input, step: 302 }));
      addMessage("Any specific **Facing**?", 'bot', ['North', 'South', 'East', 'West', 'Corner Bit']);
      return;
    }
    if (step === 302) { // Facing Received, Go to Pricing
      setChatState(prev => ({ ...prev, tempData: { ...tempData, facing: input }, step: 400 }));
      askPricing(chatState.postPurpose!);
      return;
    }

    // --- COMMERCIAL FLOW ---
    if (step === 310) { // Comm Area Received
      setChatState(prev => ({ ...prev, postArea: input, step: 311 }));
      addMessage("Does it include **Washroom** and **Parking**?", 'bot', ['Yes, Both', 'Only Parking', 'Only Washroom', 'None']);
      return;
    }
    if (step === 311) { // Amenities Received, Go to Pricing
      setChatState(prev => ({ ...prev, tempData: { ...tempData, commAmenities: input }, step: 400 }));
      askPricing(chatState.postPurpose!);
      return;
    }

    // --- PG FLOW ---
    if (step === 320) { // Rent per Bed Received (Pricing IS the first step for PG often, but here we did it early)
      setChatState(prev => ({ ...prev, postPrice: input, step: 321 }));
      addMessage("What is the **Sharing Type**?", 'bot', ['Single', 'Double', 'Triple', '3+ Sharing']);
      return;
    }
    if (step === 321) {
      setChatState(prev => ({ ...prev, tempData: { ...tempData, pgSharing: input }, step: 322 }));
      addMessage("Is **Food** included?", 'bot', ['Yes', 'No', 'Available at extra cost']);
      return;
    }
    if (step === 322) { // PG Done, Go to Photos
      setChatState(prev => ({ ...prev, tempData: { ...tempData, pgFood: input }, step: 500 }));
      askPhotos();
      return;
    }


    // --- PRICING FLOW (Generic) ---
    if (step === 400) { // Price Received
      setChatState(prev => ({ ...prev, postPrice: input, step: 500 }));
      // If rent, ask security? Skip for simplicity in chat
      askPhotos();
      return;
    }

    // --- PHOTOS ---
    if (step === 500) {
      if (input === 'Upload Photos 📸') {
        // Simulate trigger hidden input
        if (fileInputRef.current) fileInputRef.current.click();
        return;
      }
      if (input === 'Skip for Now') {
        finalizePost();
        return;
      }
      return;
    }

    // --- FINAL CONFIRMATION ---
    if (step === 600) {
      if (input.includes('Submit')) {
        addMessage("🎉 **Your property is successfully posted!** Our team will review and make it live shortly.", 'bot');
        // Optional: Redirect or Reset
        setTimeout(() => {
          setIsOpen(false);
          setChatState({ step: 1, mode: 'search', tempData: {} });
          setMessages([]); // Or keep history
        }, 4000);
      } else {
        addMessage("Okay, you can restart the process anytime.", 'bot');
      }
    }
  };

  const askPricing = (purpose: string) => {
    const prompt = purpose === 'Sale' ? "What is the **Expected Price**? (₹)" : "What is the **Monthly Rent**? (₹)";
    addMessage(prompt, 'bot');
  };

  const askPhotos = () => {
    setChatState(prev => ({ ...prev, step: 500 }));
    addMessage("Would you like to **Upload Photos** now?", 'bot', ['Upload Photos 📸', 'Skip for Now']);
  };

  const finalizePost = () => {
    setChatState(prev => ({ ...prev, step: 600 }));
    const { postPurpose, postType, postLocality, postCity, postPrice } = chatState;

    const summary = (
      <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2 border border-border mt-2">
        <p><strong>Type:</strong> {postType} ({postPurpose})</p>
        <p><strong>Location:</strong> {postLocality}, {postCity}</p>
        <p><strong>Price:</strong> {postPrice}</p>
        <p className="text-xs text-muted-foreground mt-2">Ready to submit?</p>
      </div>
    );

    addMessage(<div>Here is a summary of your property: {summary}</div>, 'bot');
    setTimeout(() => {
      addMessage("Do you want to submit this property?", 'bot', ['✅ Submit Property', '❌ Cancel']);
    }, 500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addMessage(`📸 ${e.target.files.length} photos selected.`, 'user');
      setChatState(prev => ({ ...prev, postImages: Array.from(e.target.files || []) }));
      setTimeout(() => finalizePost(), 1000);
    }
  };


  // ==========================================
  //            SEARCH FLOW (Original)
  // ==========================================

  const startSearchFlow = (input: string) => {
    const intent = input.toLowerCase().includes('pg') ? 'pg' : input.toLowerCase() as 'buy' | 'rent'; // Simple heuristic
    setChatState(prev => ({ ...prev, mode: 'search', step: 2, searchIntent: intent }));
    addMessage('Great choice! Which city are you looking in?', 'bot', ['Coimbatore', 'Chennai', 'Madurai', 'Trichy', 'Salem']);
  };

  const handleSearchFlow = (input: string) => {
    const { step, searchIntent } = chatState;

    if (step === 2) { // City selected
      setChatState(prev => ({ ...prev, searchCity: input, step: 3 }));
      addMessage(`Great! Which area in ${input} are you interested in?`, 'bot', localities.slice(0, 8));
      return;
    }

    if (step === 3) { // Locality selected
      setChatState(prev => ({ ...prev, searchLocality: input, step: 4 }));
      const budgetOptions = searchIntent === 'buy'
        ? budgetRanges.buy.map((b) => b.label)
        : searchIntent === 'pg'
          ? budgetRanges.pg.map((b) => b.label)
          : budgetRanges.rent.map((b) => b.label);
      addMessage(`${input} is a wonderful locality! What's your budget?`, 'bot', budgetOptions);
      return;
    }

    if (step === 4) { // Budget selected
      setChatState(prev => ({ ...prev, step: 5, budget: input }));
      addMessage("Perfect! What type of property are you looking for?", 'bot', ['1 BHK', '2 BHK', '3 BHK', 'Any Type']);
      return;
    }

    if (step === 5) { // Property type
      setChatState(prev => ({ ...prev, step: 6, propertyType: input }));
      addMessage("Last question - what's your furnishing preference?", 'bot', ['Fully Furnished', 'Semi Furnished', 'Unfurnished', 'Any']);
      return;
    }

    if (step === 6) { // Furnishing -> Search
      setChatState(prev => ({ ...prev, step: 7, furnishing: input }));
      addMessage("🎉 Great! I've found some matching properties for you. Let me show you the results!", 'bot');

      setTimeout(() => {
        const params = new URLSearchParams();
        if (chatState.searchIntent) params.set('intent', chatState.searchIntent);
        if (chatState.searchCity) params.set('city', chatState.searchCity);
        if (chatState.searchLocality) params.set('locality', chatState.searchLocality);
        navigate(`/properties?${params.toString()}`);
        setIsOpen(false);
        setChatState({ step: 1, mode: 'search', tempData: {} });
      }, 1500);
    }
  };

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
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-hero p-4 flex items-center justify-between">
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
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center hover:bg-background/30 transition-colors">
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
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                      }`}
                  >
                    <div className="text-sm">{message.content}</div>

                    {message.options && message.type === 'bot' && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            className="px-3 py-1.5 text-xs font-medium bg-card text-foreground rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-left"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1 px-4 py-2.5 bg-muted rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button type="submit" size="icon" className="rounded-full bg-gradient-hero hover:opacity-90">
                  <Send className="w-4 h-4" />
                </Button>
                {/* Hidden File Input for Photos */}
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
