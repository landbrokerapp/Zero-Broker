import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationModalProps {
    children: React.ReactNode;
    onLocationSelect: (coords: { lat: number; lng: number }, address?: string, city?: string) => void;
}

export function LocationModal({ children, onLocationSelect }: LocationModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const reverseGeocode = async (lat: number, lng: number): Promise<{ sublocality: string; city: string }> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`,
                { headers: { 'Accept-Language': 'en' } }
            );
            const data = await response.json();

            console.log('Nominatim reverse geocode:', data.address);

            const a = data.address ?? {};

            // ── OLX / Zomato style: return ONLY the sublocality name ──────────
            // Maps to Google's: neighborhood > sublocality_level_1 > sublocality_level_2
            //
            // Nominatim field mapping:
            //   neighbourhood  → Google neighborhood / sublocality_level_1
            //   suburb         → Google sublocality_level_1 / sublocality_level_2
            //   quarter        → Google sublocality_level_2
            //   city_district  → Google sublocality_level_1 (for some cities)
            //   village/hamlet → rural equivalent of neighbourhood
            //   locality       → fallback sublocality
            //   city/town      → last resort (city-level, not sub)

            const city = a.city || a.town || a.municipality || '';
            const sublocality =
                a.neighbourhood ||
                a.suburb ||
                a.quarter ||
                a.city_district ||
                a.village ||
                a.hamlet ||
                a.locality ||
                city ||
                '';

            return {
                sublocality: sublocality || data.display_name?.split(',')[0] || 'Current Location',
                city: city || 'Coimbatore'
            };

        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return { sublocality: 'Current Location', city: 'Coimbatore' };
        }
    };

    const handleEnableLocation = async () => {
        setLoading(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    // Get readable address and city from coordinates
                    const { sublocality, city } = await reverseGeocode(latitude, longitude);

                    setLoading(false);
                    onLocationSelect({ lat: latitude, lng: longitude }, sublocality, city);
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
