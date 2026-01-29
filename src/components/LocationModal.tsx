import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationModalProps {
    children: React.ReactNode;
    onLocationSelect: (coords: { lat: number; lng: number }, address?: string) => void;
}

export function LocationModal({ children, onLocationSelect }: LocationModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`
            );
            const data = await response.json();

            // Log the full response for debugging
            console.log('Geocoding response:', data);
            console.log('Address components:', data.address);

            // Extract relevant address components
            const address = data.address;
            const parts = [];

            // Prioritize most specific location first (in English)
            // Check for very specific locations first
            if (address.hamlet) parts.push(address.hamlet);
            else if (address.village) parts.push(address.village);
            else if (address.neighbourhood) parts.push(address.neighbourhood);
            else if (address.suburb) parts.push(address.suburb);
            else if (address.locality) parts.push(address.locality);
            else if (address.quarter) parts.push(address.quarter);
            else if (address.road) parts.push(address.road);

            // Add city/town level
            if (address.city) parts.push(address.city);
            else if (address.town) parts.push(address.town);
            else if (address.municipality) parts.push(address.municipality);

            // Add state/region
            if (address.state) parts.push(address.state);
            else if (address.state_district) parts.push(address.state_district);

            // If we got specific parts, use them; otherwise use display_name
            if (parts.length > 0) {
                return parts.join(', ');
            } else {
                // Fallback: use display_name but try to clean it up
                return data.display_name || 'Current Location';
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return 'Current Location';
        }
    };

    const handleEnableLocation = async () => {
        setLoading(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    // Get readable address from coordinates
                    const address = await reverseGeocode(latitude, longitude);

                    setLoading(false);
                    onLocationSelect({ lat: latitude, lng: longitude }, address);
                    setOpen(false);
                },
                (error) => {
                    setLoading(false);
                    console.error('Error getting location:', error);
                    alert(t('locationError'));
                }
            );
        } else {
            setLoading(false);
            alert('Geolocation is not supported by your browser');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-6 gap-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                        <Navigation className="w-8 h-8 text-blue-600 fill-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">
                        {t('useLocation')}
                    </h2>
                    <p className="text-muted-foreground text-center max-w-[280px]">
                        {t('enableLocationText')}
                    </p>

                    <div className="w-full flex flex-col gap-3 mt-2">
                        <Button
                            size="lg"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg gap-2"
                            onClick={handleEnableLocation}
                            disabled={loading}
                        >
                            <Navigation className="w-4 h-4 fill-white" />
                            {loading ? t('gettingLocation') : t('enableLocationButton')}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-muted-foreground hover:text-foreground"
                            onClick={() => setOpen(false)}
                        >
                            {t('searchManually')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
