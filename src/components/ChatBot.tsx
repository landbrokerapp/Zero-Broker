import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { localities, budgetRanges } from '@/data/mockProperties';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  options?: string[];
}

interface ChatState {
  step: number;
  intent?: 'buy' | 'rent' | 'pg';
  locality?: string;
  budget?: string;
  propertyType?: string;
  furnishing?: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: "Hello! 👋 I'm your property search assistant. Let me help you find your perfect property in Coimbatore. What are you looking for?",
    options: ['Buy', 'Rent', 'PG / Co-Living'],
  },
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [chatState, setChatState] = useState<ChatState>({ step: 1 });
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const addMessage = (content: string, type: 'bot' | 'user', options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      options,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleOptionSelect = (option: string) => {
    addMessage(option, 'user');

    setTimeout(() => {
      switch (chatState.step) {
        case 1: // Intent
          const intent = option.toLowerCase().includes('pg') ? 'pg' : option.toLowerCase() as 'buy' | 'rent';
          setChatState((prev) => ({ ...prev, step: 2, intent }));
          addMessage('Great choice! Which area in Coimbatore are you interested in?', 'bot', localities);
          break;

        case 2: // Locality
          setChatState((prev) => ({ ...prev, step: 3, locality: option }));
          const budgetOptions = chatState.intent === 'buy' 
            ? budgetRanges.buy.map((b) => b.label)
            : chatState.intent === 'pg'
            ? budgetRanges.pg.map((b) => b.label)
            : budgetRanges.rent.map((b) => b.label);
          addMessage(`${option} is a wonderful locality! What's your budget?`, 'bot', budgetOptions);
          break;

        case 3: // Budget
          setChatState((prev) => ({ ...prev, step: 4, budget: option }));
          addMessage("Perfect! What type of property are you looking for?", 'bot', ['1 BHK', '2 BHK', '3 BHK', 'Any Type']);
          break;

        case 4: // Property Type
          setChatState((prev) => ({ ...prev, step: 5, propertyType: option }));
          addMessage("Last question - what's your furnishing preference?", 'bot', ['Fully Furnished', 'Semi Furnished', 'Unfurnished', 'Any']);
          break;

        case 5: // Furnishing
          setChatState((prev) => ({ ...prev, step: 6, furnishing: option }));
          addMessage("🎉 Great! I've found some matching properties for you. Let me show you the results!", 'bot');
          
          // Navigate to results after a short delay
          setTimeout(() => {
            const params = new URLSearchParams();
            if (chatState.intent) params.set('intent', chatState.intent);
            if (chatState.locality) params.set('locality', chatState.locality);
            navigate(`/properties?${params.toString()}`);
            setIsOpen(false);
            // Reset chat
            setMessages(initialMessages);
            setChatState({ step: 1 });
          }, 1500);
          break;
      }
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    addMessage(inputValue, 'user');
    setInputValue('');
    
    // Simple response for custom input
    setTimeout(() => {
      addMessage("I understand! Let me help you find properties based on that. Please select from the options above for more accurate results.", 'bot');
    }, 500);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-hero shadow-lg flex items-center justify-center hover:scale-105 transition-transform ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="w-7 h-7 text-primary-foreground" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-accent rounded-full animate-pulse" />
      </button>

      {/* Chat Window */}
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
                  <h3 className="font-display font-semibold text-primary-foreground">AI Property Search</h3>
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
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Options */}
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
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 bg-muted rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full bg-gradient-hero hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
