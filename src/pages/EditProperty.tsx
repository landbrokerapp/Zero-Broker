import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/contexts/PropertyContext';
import { PropertyForm } from '@/components/PropertyForm';
import { Property } from '@/data/mockProperties';

export default function EditProperty() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { properties, updateProperty, loading: contextLoading } = useProperties();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated && !contextLoading) {
            navigate(`/auth?redirect=/edit-property/${id}`);
            return;
        }

        if (!contextLoading) {
            const found = properties.find(p => p.id === id);
            if (found) {
                // Check if the current user is the owner
                if (found.sellerId !== user?.id && user?.role !== 'admin') {
                    toast.error('You do not have permission to edit this property');
                    navigate('/my-properties');
                    return;
                }
                setProperty(found);
            } else {
                toast.error('Property not found');
                navigate('/my-properties');
            }
            setLoading(false);
        }
    }, [id, properties, contextLoading, isAuthenticated, user, navigate]);

    const handlePropertySubmit = async (formData: any) => {
        if (!id) return;

        try {
            const intentMap: Record<string, 'buy' | 'rent' | 'pg'> = {
                'Sale': 'buy',
                'Rent': 'rent',
                'PG': 'pg'
            };

            const updates: Partial<Property> = {
                title: formData.title,
                type: formData.type as Property['type'],
                intent: intentMap[formData.purpose] || 'buy',
                purpose: formData.purpose,
                price: parseInt(formData.price) || 0,
                priceUnit: formData.priceUnit,
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
                parking: formData.parking,
                builtUpArea: parseInt(formData.builtUpArea) || 0,
                floor: formData.floor,
                totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : 0,
                furnishing: formData.furnishingStatus,
                propertyAge: formData.propertyAge as Property['propertyAge'],
                amenities: formData.amenities,
                images: formData.images,
                description: formData.description,
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

            await updateProperty(id, updates);
            setIsSubmitted(true);
            toast.success('Property updated successfully!');
        } catch (error: any) {
            console.error('Update error:', error);
            const errorMessage = error.message || 'Failed to update property.';
            toast.error(errorMessage);
        }
    };

    if (loading || contextLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
                    <div className="max-w-md bg-white dark:bg-card p-10 rounded-3xl shadow-2xl border border-border/50">
                        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-blue-500" />
                        </div>
                        <h1 className="font-display text-4xl font-bold text-foreground mb-6">
                            Property Updated!
                        </h1>
                        <p className="text-muted-foreground mb-8 text-lg">
                            Your changes have been saved. Since you edited the details, the property has been sent back for admin re-verification.
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

    // Pre-fill form data from existing property
    const initialData = property ? {
        title: property.title,
        purpose: property.purpose as any,
        type: property.type,
        city: property.city,
        area: property.locality,
        address: property.address,
        landmark: property.landmark,
        pincode: property.pincode,
        price: property.price.toString(),
        priceUnit: property.priceUnit,
        priceNegotiable: property.priceNegotiable,
        maintenanceCharges: property.maintenanceCharges?.toString(),
        securityDeposit: property.securityDeposit?.toString(),
        foodIncluded: property.foodIncluded,
        bhk: property.bhk,
        bathrooms: property.bathrooms?.toString(),
        balconies: property.balconies?.toString(),
        parking: property.parking,
        builtUpArea: property.builtUpArea.toString(),
        carpetArea: property.carpetArea?.toString(),
        floor: property.floor,
        totalFloors: property.totalFloors.toString(),
        furnishingStatus: property.furnishing,
        propertyAge: property.propertyAge,
        amenities: property.amenities,
        description: property.description,
        plotArea: property.plotArea?.toString(),
        plotAreaUnit: property.plotAreaUnit,
        plotFacing: property.facing,
        boundaryWall: property.boundaryWall,
        roadWidth: property.roadWidth,
        washroomCount: property.washroomCount?.toString(),
    } : undefined;

    return (
        <div className="min-h-screen bg-background dark:bg-neutral-950 pb-20">
            <Header />

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <Link to="/my-properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Cancel and Return
                </Link>

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold font-display tracking-tight text-foreground sm:text-5xl">
                        Edit Property
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Update your property details. Note: editing will require admin re-approval.
                    </p>
                </div>

                {initialData && <PropertyForm onSubmit={handlePropertySubmit} initialData={initialData} />}
            </main>

            <Footer />
        </div>
    );
}
