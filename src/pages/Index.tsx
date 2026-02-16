import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageCircle, MapPin, ArrowRight, Building2, Home, Building, Warehouse, TreePine, Users, CheckCircle2, CalendarCheck, Handshake } from 'lucide-react';
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

  const handleLocationSelect = (coords: { lat: number; lng: number }, address?: string) => {
    // Set the address in the search field
    if (address) {
      setSearchLocation(address);
    } else {
      setSearchLocation('Current Location');
    }
    console.log('Location selected:', coords, 'Address:', address);
  };

  const handleOthersSubmit = (data: { propertyType: string; description: string }) => {
    setCustomPropertyType(data.propertyType);
    setSearchType('others');
    console.log('Custom property type:', data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <LocationModal onLocationSelect={handleLocationSelect}>
                      <button className="p-1 hover:bg-muted rounded-full transition-colors" title="Use my location">
                        <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                      </button>
                    </LocationModal>
                    <div className="w-px h-6 bg-border mx-1" />
                  </div>
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-20 pr-4 py-3 bg-muted/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/20"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
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

      {/* Recommended Sellers */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('recommendedSellers')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('sellersSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        </div>
      </section>

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

      <Footer />
      <ChatBot />
    </div>
  );
}
