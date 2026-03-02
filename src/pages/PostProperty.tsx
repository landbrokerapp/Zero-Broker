import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/contexts/PropertyContext';
import { Property } from '@/data/mockProperties';
import { PropertyForm } from '@/components/PropertyForm';

export default function PostProperty() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUserRole } = useAuth();
  const { addProperty } = useProperties();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/post-property');
    } else {
      setUserRole('seller');
    }
  }, [isAuthenticated, navigate, setUserRole]);

  const handlePropertySubmit = async (formData: any) => {
    try {
      const intentMap: Record<string, 'buy' | 'rent' | 'pg'> = {
        'Sale': 'buy',
        'Rent': 'rent',
        'PG': 'pg'
      };

      const propertyData: Omit<Property, 'id' | 'postedDate' | 'verified'> = {
        title: formData.title,
        type: formData.type as Property['type'],
        intent: intentMap[formData.purpose] || 'buy',
        purpose: formData.purpose,
        price: parseInt(formData.price) || 0,
        priceUnit: formData.priceUnit || (formData.purpose === 'Sale' ? 'total' : 'month'),
        priceNegotiable: formData.priceNegotiable,
        maintenanceCharges: formData.maintenanceCharges ? parseInt(formData.maintenanceCharges) : 0,
        securityDeposit: formData.securityDeposit ? parseInt(formData.securityDeposit) : 0,
        foodIncluded: formData.foodIncluded,
        locality: formData.area,
        city: formData.city,
        address: formData.address,
        landmark: formData.landmark,
        pincode: formData.pincode,
        bhk: formData.bhk,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        balconies: formData.balconies ? parseInt(formData.balconies) : undefined,
        parking: formData.parking || 'None',
        builtUpArea: parseInt(formData.builtUpArea),
        floor: formData.floor || 'G',
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : 0,
        furnishing: formData.furnishingStatus,
        propertyAge: formData.propertyAge as Property['propertyAge'],
        amenities: formData.amenities,
        images: formData.images,
        status: 'active',
        description: formData.description || '',
        sellerId: user?.id || '',
        sellerName: user?.name || 'Property Owner',
        sellerPhone: user?.phone || '',
        pgDetails: formData.purpose === 'PG' ? {
          pgType: formData.pgType,
          roomType: formData.pgRoomType,
          foodType: formData.pgFoodType,
          electricityChargesIncluded: !!formData.pgElectricityIncluded,
          houseRules: formData.pgHouseRules,
          numBeds: formData.numBeds ? parseInt(formData.numBeds) : undefined
        } : undefined,
        plotArea: formData.plotArea ? parseInt(formData.plotArea) : undefined,
        plotAreaUnit: formData.plotAreaUnit,
        facing: formData.plotFacing,
        boundaryWall: formData.boundaryWall,
        roadWidth: formData.roadWidth,
        washroomCount: formData.washroomCount ? parseInt(formData.washroomCount) : undefined
      };

      await addProperty(propertyData);
      setIsSubmitted(true);
      toast.success('Property submitted for verification!');
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorMessage = error.message || 'Failed to submit property listing.';
      toast.error(errorMessage);
      throw error;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
          <div className="max-w-md bg-white dark:bg-card p-10 rounded-3xl shadow-2xl border border-border/50">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-6">
              Property Sent for Admin Review!
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Thank you! Your property has been submitted and is currently pending admin review. Once approved, it will be visible on the platform.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/my-properties" className="w-full">
                <Button className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg hover:shadow-primary/25">
                  Manage My Listings
                </Button>
              </Link>
              <Link to="/" className="w-full">
                <Button variant="ghost" className="w-full h-12 text-lg rounded-xl hover:bg-muted font-medium">
                  Go Back Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950 pb-20">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel and Return Home
        </Link>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold font-display tracking-tight text-foreground sm:text-5xl">
            Post Your Property
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            List your property on ZeroBroker and connect with potential buyers or tenants directly without any middlemen.
          </p>
        </div>

        <PropertyForm onSubmit={handlePropertySubmit} />
      </main>

      <Footer />
    </div>
  );
}

