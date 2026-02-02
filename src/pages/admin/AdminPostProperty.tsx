import React from 'react';
import { Home } from 'lucide-react';
import { useProperties } from '@/contexts/PropertyContext';
import { Property } from '@/data/mockProperties';
import { toast } from 'sonner';
import { PropertyForm } from '@/components/PropertyForm';

export default function AdminPostProperty() {
    const { addProperty } = useProperties();

    const handleAdminSubmit = async (formData: any) => {
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
                price: parseInt(formData.price),
                priceUnit: formData.purpose === 'Sale' ? 'total' : 'month',
                priceNegotiable: formData.priceNegotiable,
                maintenanceCharges: formData.maintenanceCharges ? parseInt(formData.maintenanceCharges) : undefined,
                securityDeposit: formData.securityDeposit ? parseInt(formData.securityDeposit) : undefined,
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
                availableFrom: formData.availableFrom,
                propertyAge: formData.propertyAge as Property['propertyAge'],
                amenities: formData.amenities,
                images: formData.images,
                description: formData.description || '',
                sellerId: 'admin',
                sellerName: 'System Admin',
                sellerPhone: '9999999999',
                videoUrl: formData.videoUrl,
                pgDetails: formData.purpose === 'PG' ? {
                    pgType: formData.pgType,
                    roomType: formData.pgRoomType,
                    foodType: formData.pgFoodType,
                    electricityChargesIncluded: !!formData.pgElectricityIncluded,
                    houseRules: formData.pgHouseRules
                } : undefined
            };

            // Pass true for verified since it's an admin post
            await addProperty(propertyData, true);
            toast.success('Property published successfully as verified!');
        } catch (error) {
            console.error('Admin submit error:', error);
            toast.error('Failed to publish property');
            throw error;
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-display">New System Listing</h1>
                    <p className="text-muted-foreground">Admin-level property insertion. Listings are automatically verified and live on site.</p>
                </div>
            </div>

            <PropertyForm onSubmit={handleAdminSubmit} isAdmin={true} />
        </div>
    );
}

