import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, X, MapPin } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { ChatBot } from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { mockProperties, localities, propertyTypes, budgetRanges, Property } from '@/data/mockProperties';
import { useProperties } from '@/contexts/PropertyContext';
import { getAllCityNames } from '@/data/tamilNaduLocations';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties, filters, setFilters, filteredProperties } = useProperties();

  const intent = searchParams.get('intent') as 'buy' | 'rent' | 'pg' | null;
  const city = searchParams.get('city');
  const locality = searchParams.get('locality');
  const type = searchParams.get('type');

  useEffect(() => {
    setFilters({
      intent: intent || undefined,
      city: city || undefined,
      locality: locality || undefined,
      type: type || undefined,
    });
  }, [intent, city, locality, type, setFilters]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const activeFilters = Array.from(searchParams.entries());

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Intent */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Property For</label>
        <div className="flex gap-2 flex-wrap">
          {['buy', 'rent', 'pg'].map((i) => (
            <Button
              key={i}
              size="sm"
              variant={intent === i ? 'default' : 'outline'}
              onClick={() => updateFilter('intent', intent === i ? null : i)}
              className={intent === i ? 'bg-primary' : ''}
            >
              {i === 'pg' ? 'PG / Co-Living' : i.charAt(0).toUpperCase() + i.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">City</label>
        <Select value={city || ''} onValueChange={(v) => updateFilter('city', v || null)}>
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {getAllCityNames().map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Locality */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Locality</label>
        <Select value={locality || ''} onValueChange={(v) => updateFilter('locality', v || null)}>
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Select locality" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {localities.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Property Type</label>
        <Select value={type || ''} onValueChange={(v) => updateFilter('type', v || null)}>
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {propertyTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Budget */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Budget</label>
        <div className="flex gap-2 flex-wrap">
          {(intent === 'buy' ? budgetRanges.buy : intent === 'pg' ? budgetRanges.pg : budgetRanges.rent).map((budget) => (
            <Button
              key={budget.value}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              {budget.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilters.length > 0 && (
        <Button variant="ghost" onClick={clearFilters} className="w-full text-destructive hover:text-destructive">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">Properties</span>
            {intent && (
              <>
                <span>/</span>
                <span className="text-foreground capitalize">{intent === 'pg' ? 'PG / Co-Living' : intent}</span>
              </>
            )}
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {intent === 'buy' ? 'Properties for Sale' : intent === 'rent' ? 'Properties for Rent' : intent === 'pg' ? 'PG / Co-Living' : 'All Properties'}
            {city && ` in ${city}`}
            {locality && ` - ${locality}`}
          </h1>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-card rounded-2xl p-6 border border-border sticky top-24">
              <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>
              <FilterContent />
            </div>
          </aside>





          {/* Properties Grid */}
          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2">
                      <Filter className="w-4 h-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Active Filter Badges */}
                {activeFilters.map(([key, value]) => (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => updateFilter(key, null)}
                  >
                    <span className="capitalize">{value}</span>
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>

              <span className="text-sm text-muted-foreground hidden sm:block">
                {filteredProperties.length} properties
              </span>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No properties found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}
