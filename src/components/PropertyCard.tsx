import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Maximize, BadgeCheck, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '@/data/mockProperties';
import { Badge } from '@/components/ui/badge';

import { useFavorites } from '@/contexts/FavoritesContext';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(property.id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property.id);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const formatPrice = (price: number, unit: string, intent: string) => {
    if (intent === 'buy') {
      if (unit === 'sqft') {
        return `₹${price.toLocaleString('en-IN')}/sqft`;
      }
      if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(2)} Cr`;
      } else if (price >= 100000) {
        return `₹${(price / 100000).toFixed(2)} L`;
      }
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `₹${price.toLocaleString('en-IN')}/${unit === 'month' ? 'mo' : unit}`;
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'buy':
        return 'bg-primary text-primary-foreground';
      case 'rent':
        return 'bg-secondary text-secondary-foreground';
      case 'pg':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Link to={`/property/${property.id}`} className="group">
      <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-border group-hover:border-primary/20">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden group/image">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

          {/* Image Navigation Arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover/image:opacity-100 transition-all duration-300 z-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover/image:opacity-100 transition-all duration-300 z-20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image Dots Indicator */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {property.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge className={getIntentColor(property.intent)}>
              {property.intent === 'pg' ? 'PG' : property.intent.charAt(0).toUpperCase() + property.intent.slice(1)}
            </Badge>
            {property.verified && (
              <Badge className="bg-growth text-accent-foreground gap-1">
                <BadgeCheck className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors z-20"
          >
            <Heart className={`w-4 h-4 transition-colors ${favorite ? 'fill-destructive text-destructive' : 'text-muted-foreground hover:text-destructive'}`} />
          </button>

          {/* Price Overlay */}
          <div className="absolute bottom-3 left-3 z-10">
            <p className="text-2xl font-display font-bold text-background">
              {formatPrice(property.price, property.priceUnit, property.intent)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm">{property.locality}, {property.city}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {property.bhk && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4" />
                <span>{property.bhk}</span>
              </div>
            )}
            {/* Fix: Check for pgDetails instead of property.pgType if redundant */}
            {property.pgDetails?.pgType && (
              <div className="flex items-center gap-1.5">
                <span className="capitalize">{property.pgDetails.pgType} PG</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4" />
              <span>{property.builtUpArea} sqft</span>
            </div>
          </div>

          {/* Furnishing Badge */}
          <div className="mt-3 pt-3 border-t border-border">
            <Badge variant="secondary" className="capitalize">
              {property.furnishing.replace('-', ' ')}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
