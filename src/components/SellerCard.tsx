import React from 'react';
import { Phone, MapPin, Building } from 'lucide-react';
import { Seller } from '@/data/mockProperties';
import { Button } from '@/components/ui/button';

interface SellerCardProps {
  seller: Seller;
}

export function SellerCard({ seller }: SellerCardProps) {
  const [showContact, setShowContact] = React.useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-hover transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
          {getInitials(seller.name)}
        </div>

        <div className="flex-1">
          <h3 className="font-display font-semibold text-lg text-foreground mb-1">
            {seller.name}
          </h3>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground">{seller.experience}</span>
              <span>Yrs</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              <span className="font-semibold text-foreground">{seller.propertyCount}</span>
              <span>Properties</span>
            </div>
          </div>

          {/* Localities */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 text-accent" />
            <span>{seller.localities.join(', ')}</span>
          </div>

          {/* Contact Button */}
          {showContact ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg">
              <Phone className="w-4 h-4 text-accent" />
              <span className="font-medium text-accent">{seller.phone}</span>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowContact(true)}
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              Show Contact
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
