import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageCircle, MapPin, ArrowRight, Building2, Home, Building, Warehouse, TreePine, Users, CheckCircle2, CalendarCheck, Handshake, Navigation, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { SellerCard } from '@/components/SellerCard';
import { ChatBot } from '@/components/ChatBot';
import { LocationModal } from '@/components/LocationModal';
import { OthersPropertyDialog } from '@/components/OthersPropertyDialog';
import { PricingSection } from '@/components/PricingSection';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProperties, mockSellers, propertyTypes } from '@/data/mockProperties';
import { pgTypes } from '@/data/pgTypes';
import { useProperties } from '@/contexts/PropertyContext';
import { Property } from '@/data/mockProperties';

const propertyCategories = [
  { icon: Building2, label: 'Apartment' },
  { icon: Home, label: 'House' },
  { icon: Building, label: 'Villa' },
  { icon: TreePine, label: 'Plot/Land' },
  { icon: Warehouse, label: 'Commercial' },
  { icon: Users, label: 'PG / Hostels' },
];

export default function Index() {
  const { properties } = useProperties();

  const featuredProperties = properties.filter(p => p.verified).slice(0, 6);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'pg'>('buy');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [customPropertyType, setCustomPropertyType] = useState('');

  // ── OLX-style locality autocomplete ────────────────────────────────────────
  interface LocalitySuggestion { id: string; name: string; secondary: string; }
  const [localitySuggestions, setLocalitySuggestions] = useState<LocalitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /**
   * Fetch neighbourhood/sublocality suggestions from Nominatim.
   * Extracts: neighbourhood → suburb → quarter → city_district
   * (equivalent to Google's neighborhood / sublocality_level_1 / sublocality_level_2)
   */
  const fetchLocalitySuggestions = useCallback(async (query: string) => {
    if (query.length < 2) { setLocalitySuggestions([]); setShowSuggestions(false); return; }
    setSuggestionLoading(true);
    try {
      const url =
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}` +
        `&countrycodes=in&addressdetails=1&limit=7&accept-language=en`;
      const res = await fetch(url);
      const data: any[] = await res.json();

      const seen = new Set<string>();
      const mapped: LocalitySuggestion[] = [];

      for (const item of data) {
        const a = item.address ?? {};
        // Sublocality priority — mirrors Google's neighborhood/sublocality_level_1/2
        const name =
          a.neighbourhood ||
          a.suburb ||
          a.quarter ||
          a.city_district ||
          a.village ||
          a.hamlet ||
          a.locality ||
          item.display_name.split(',')[0];

        const secondary = [
          a.city || a.town || a.municipality,
          a.state
        ].filter(Boolean).join(', ');

        const key = `${name}|${secondary}`;
        if (!seen.has(key)) {
          seen.add(key);
          mapped.push({ id: String(item.place_id), name, secondary });
        }
      }

      setLocalitySuggestions(mapped);
      setShowSuggestions(mapped.length > 0);
    } catch {
      setLocalitySuggestions([]);
    } finally {
      setSuggestionLoading(false);
    }
  }, []);

  const handleSearchInput = (val: string) => {
    setSearchLocation(val);
    setActiveIdx(-1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchLocalitySuggestions(val), 300);
  };

  const pickSuggestion = (s: LocalitySuggestion) => {
    setSearchLocation(s.name);
    setLocalitySuggestions([]);
    setShowSuggestions(false);
    setActiveIdx(-1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || localitySuggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, localitySuggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); pickSuggestion(localitySuggestions[activeIdx]); }
    else if (e.key === 'Escape') setShowSuggestions(false);
  };

  const handleLocationSelect = (coords: { lat: number; lng: number }, address?: string) => {
    setSearchLocation(address || 'Current Location');
    setShowSuggestions(false);
  };

  const handleOthersSubmit = (data: { propertyType: string; description: string }) => {
    setCustomPropertyType(data.propertyType);
    setSearchType('others');
    console.log('Custom property type:', data);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-hero opacity-5" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="container mx-auto px-4 py-20 lg:py-32 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-6">
                <MapPin className="w-4 h-4" />
                {t('availableIn')}
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {t('findDreamProperty')}{' '}
                <span className="text-gradient-hero">{t('withoutBrokerage')}</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('heroSubtitle')}
              </p>

              {/* Search Box */}
              <div className="bg-card rounded-2xl shadow-xl p-4 mb-6 max-w-2xl mx-auto border border-border/50">
                <div className="flex gap-6 mb-4 px-2 border-b border-border pb-2">
                  <button
                    className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'buy' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('buy')}
                  >
                    {t('buy')}
                  </button>
                  <button
                    className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'rent' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('rent')}
                  >
                    {t('rent')}
                  </button>
                  <button
                    className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'pg' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('pg')}
                  >
                    {t('pg')}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="w-full sm:w-[180px]">
                    <Select
                      value={searchType}
                      onValueChange={(value) => {
                        if (value === 'others') {
                          // Don't set the value yet, let the dialog handle it
                          return;
                        }
                        setSearchType(value);
                        setCustomPropertyType(''); // Clear custom type if switching to standard type
                      }}
                    >
                      <SelectTrigger className="w-full h-12 bg-muted/50 border-transparent focus:ring-2 focus:ring-primary/20 rounded-xl">
                        <SelectValue placeholder={
                          searchType === 'others' && customPropertyType
                            ? customPropertyType
                            : t('propertyType')
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{activeTab === 'pg' ? t('allPg') : t('allTypes')}</SelectItem>
                        {(activeTab === 'pg' ? pgTypes : propertyTypes).map((type) => {
                          if (type.value === 'others') {
                            return (
                              <OthersPropertyDialog key={type.value} onSubmit={handleOthersSubmit}>
                                <div className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                  {type.label}
                                </div>
                              </OthersPropertyDialog>
                            );
                          }
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* OLX-style locality search with autocomplete */}
                  <div className="flex-1 relative">
                    <div className="flex items-center w-full h-12 bg-muted/50 rounded-xl border border-transparent focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20 transition-all px-3 gap-2">
                      {/* GPS dot button */}
                      <LocationModal onLocationSelect={handleLocationSelect}>
                        <button
                          type="button"
                          title="Detect my location"
                          className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                        >
                          <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                        </button>
                      </LocationModal>
                      <div className="w-px h-5 bg-border flex-shrink-0" />
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
                        value={searchLocation}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        onFocus={() => { if (localitySuggestions.length > 0) setShowSuggestions(true); }}
                        autoComplete="off"
                      />
                      {suggestionLoading && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin flex-shrink-0" />}
                      {!suggestionLoading && searchLocation && (
                        <button type="button" onClick={() => { setSearchLocation(''); setLocalitySuggestions([]); setShowSuggestions(false); inputRef.current?.focus(); }} className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {!suggestionLoading && !searchLocation && <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                    </div>

                    {/* Autocomplete dropdown */}
                    {showSuggestions && localitySuggestions.length > 0 && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                        style={{ animation: 'fadeSlideIn 0.15s ease' }}
                      >
                        {localitySuggestions.map((s, idx) => (
                          <button
                            key={s.id + idx}
                            type="button"
                            onMouseDown={() => pickSuggestion(s)}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/60 transition-colors ${idx === activeIdx ? 'bg-muted/60' : ''
                              }`}
                          >
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                              {s.secondary && <p className="text-xs text-muted-foreground truncate">{s.secondary}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    <style>{`
                    @keyframes fadeSlideIn {
                      from { opacity: 0; transform: translateY(-4px); }
                      to   { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>
                  </div>
                  <Link to={`/properties?intent=${activeTab}&locality=${encodeURIComponent(searchLocation)}${searchType && searchType !== 'all' ? `&type=${searchType}` : ''}`}>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 w-full sm:w-auto rounded-xl shadow-lg shadow-primary/20">
                      <Search className="w-5 h-5 mr-2" />
                      {t('search')}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* AI Search CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-accent hover:opacity-90 text-accent-foreground gap-2 rounded-full px-8 shadow-lg shadow-accent/20"
                  onClick={() => {
                    const chatButton = document.querySelector('button[class*="fixed bottom-6"]') as HTMLButtonElement;
                    if (chatButton) chatButton.click();
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('chatSearch')}
                </Button>
                <span className="text-sm text-muted-foreground">{t('orBrowse')}</span>
              </div>
            </div>
          </div>
        </section>



        {/* How It Works Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('howItWorks')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('howItWorksSubtitle')}
              </p>
            </div>

            <div className="relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-border -z-10" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-white border-2 border-dashed border-primary/30 flex items-center justify-center shadow-sm">
                      <Search className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold shadow-md">
                      1
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t('searchProperty')}</h3>
                  <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                    {t('searchDesc')}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-white border-2 border-dashed border-primary/30 flex items-center justify-center shadow-sm">
                      <Home className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold shadow-md">
                      2
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t('shortlistVisit')}</h3>
                  <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                    {t('shortlistDesc')}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-white border-2 border-dashed border-primary/30 flex items-center justify-center shadow-sm">
                      <Handshake className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold shadow-md">
                      3
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t('closeDeal')}</h3>
                  <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                    {t('closeDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Property Categories */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('experienceExtraordinary')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('experienceSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {propertyCategories.map((category) => (
                <Link
                  key={category.label}
                  to={`/properties?type=${category.label.toLowerCase()}`}
                  className="group bg-card rounded-2xl p-6 text-center border border-border hover:border-primary hover:shadow-hover transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-hero/10 flex items-center justify-center group-hover:bg-gradient-hero group-hover:text-primary-foreground transition-all duration-300">
                    <category.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{category.label}</h3>
                  <p className="text-sm text-muted-foreground">Browse Listings</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {t('featuredProperties')}
                </h2>
                <p className="text-muted-foreground">
                  {t('featuredSubtitle')}
                </p>
              </div>
              <Link to="/properties">
                <Button variant="outline" className="gap-2">
                  {t('viewAll')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />



        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-20" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                {t('havePropertyToSell')}
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                {t('listPropertyDesc')}
              </p>
              <Link to="/post-property">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 gap-2">
                  {t('postYourProperty')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}
