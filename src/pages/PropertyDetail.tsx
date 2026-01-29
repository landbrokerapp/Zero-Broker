import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, MapPin, Bed, Maximize, Car, Compass,
  Building, Layers, Home, BadgeCheck, Phone, MessageCircle, Share2,
  Heart, Calendar, User, Shield, X
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';
import { PropertyMap } from '@/components/PropertyMap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/contexts/PropertyContext';
import { mockProperties, amenitiesList } from '@/data/mockProperties';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [showEnquirySuccess, setShowEnquirySuccess] = useState(false);
  const { properties } = useProperties();

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Property Not Found</h1>
          <Link to="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number, unit: string, intent: string) => {
    if (intent === 'buy') {
      if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(2)} Cr`;
      } else if (price >= 100000) {
        return `₹${(price / 100000).toFixed(2)} L`;
      }
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `₹${price.toLocaleString('en-IN')}/${unit === 'month' ? 'month' : unit}`;
  };

  const handleEnquiry = () => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/property/' + id);
      return;
    }
    setShowEnquirySuccess(true);
    setTimeout(() => setShowEnquirySuccess(false), 3000);
  };

  const handleShowContact = () => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/property/' + id);
      return;
    }
    setShowContact(true);
  };

  const overviewItems = [
    { icon: Maximize, label: 'Built-up Area', value: `${property.builtUpArea} sqft` },
    { icon: Layers, label: 'Carpet Area', value: `${property.carpetArea} sqft` },
    { icon: Home, label: 'Furnishing', value: property.furnishing.replace('-', ' ') },
    { icon: Building, label: 'Floor', value: `${property.floor} of ${property.totalFloors}` },
    { icon: Compass, label: 'Facing', value: property.facing },
    { icon: Car, label: 'Parking', value: property.parking },
    { icon: Shield, label: 'Ownership', value: property.ownershipType },
    ...(property.maintenanceCharges ? [{ icon: Calendar, label: 'Maintenance', value: `₹${property.maintenanceCharges}/month` }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-primary">Properties</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{property.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[16/10]">
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Navigation */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  {property.intent === 'pg' ? 'PG' : property.intent.charAt(0).toUpperCase() + property.intent.slice(1)}
                </Badge>
                {property.verified && (
                  <Badge className="bg-growth text-accent-foreground gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-card/80 backdrop-blur-sm rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Location */}
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5 text-accent" />
                <span>{property.locality}, {property.city}</span>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Property Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {overviewItems.map((item) => (
                  <div key={item.label} className="text-center p-4 rounded-xl bg-muted/50">
                    <item.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="font-semibold text-foreground capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                About this property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>


            {/* Amenities */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-3">
                {property.amenities.slice(0, 8).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="px-4 py-2 text-sm">
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 8 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer hover:bg-muted">
                        +{property.amenities.length - 8} More
                      </Badge>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>All Amenities</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {property.amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="px-3 py-1.5">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 border border-border sticky top-24 space-y-6">
              {/* Price */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="font-display text-3xl font-bold text-foreground">
                  {formatPrice(property.price, property.priceUnit, property.intent)}
                </p>
                {property.intent === 'rent' && property.maintenanceCharges && (
                  <p className="text-sm text-muted-foreground mt-1">
                    + ₹{property.maintenanceCharges}/month maintenance
                  </p>
                )}
              </div>

              {/* Seller Info */}
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold">
                    {property.sellerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{property.sellerName}</p>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </div>

                {showContact ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg">
                    <Phone className="w-4 h-4 text-accent" />
                    <span className="font-medium text-accent">{property.sellerPhone}</span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                    onClick={handleShowContact}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Show Contact
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-hero hover:opacity-90 text-primary-foreground"
                  onClick={handleEnquiry}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Enquiry
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Posted Date */}
              <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
                Posted on {new Date(property.postedDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Toast */}
      {showEnquirySuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-growth text-accent-foreground px-6 py-3 rounded-full shadow-lg animate-slide-in-up">
          ✓ Enquiry sent successfully! The seller will contact you soon.
        </div>
      )}

      <Footer />
      <ChatBot />
    </div>
  );
}
