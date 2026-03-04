// and reverse geocoding to get address from coordinates
import { getLocalitiesForCity } from "@/data/tamilNaduLocations";

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface LocationData {
    city: string;
    area: string;
    state: string;
    country: string;
    pincode?: string;
    formattedAddress: string;
    coordinates: Coordinates;
}

/**
 * Get user's current location using browser's Geolocation API
 */
export const getCurrentLocation = (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    });
};

/**
 * Reverse geocode coordinates to get address using Nominatim (OpenStreetMap)
 * Free API, no key required
 */
export const reverseGeocode = async (coords: Coordinates): Promise<LocationData> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`,
            {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'ZeroBroker-PropertyApp', // Required by Nominatim
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }

        const data = await response.json();
        const address = data.address || {};

        // Extract city (can be city, town, village, or suburb)
        const city = address.city || address.town || address.village || address.suburb || address.county || '';

        // Extract area/locality
        const area = address.suburb || address.neighbourhood || address.road || address.hamlet || '';

        return {
            city: city,
            area: area,
            state: address.state || '',
            country: address.country || '',
            pincode: address.postcode || '',
            formattedAddress: data.display_name || '',
            coordinates: coords,
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        throw new Error('Failed to get address from coordinates');
    }
};

/**
 * Get current location and reverse geocode it
 */
export const getCurrentLocationData = async (): Promise<LocationData> => {
    const coords = await getCurrentLocation();
    const locationData = await reverseGeocode(coords);
    return locationData;
};

/**
 * Forward geocode: Get coordinates from address
 * Using Nominatim (OpenStreetMap) - Free API
 */
export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
            {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'ZeroBroker-PropertyApp',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to geocode address');
        }

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
            };
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};

/**
 * Generate Google Maps link from coordinates
 */
export const generateGoogleMapsLink = (coords: Coordinates): string => {
    return `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
};

/**
 * Generate Google Maps embed URL
 */
export const generateGoogleMapsEmbedUrl = (coords: Coordinates): string => {
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${coords.latitude},${coords.longitude}`;
};

/**
 * Parse Google Maps link to extract coordinates
 */
export const parseGoogleMapsLink = (url: string): Coordinates | null => {
    try {
        // Pattern 1: https://www.google.com/maps?q=lat,lng
        const pattern1 = /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
        const match1 = url.match(pattern1);
        if (match1) {
            return {
                latitude: parseFloat(match1[1]),
                longitude: parseFloat(match1[2]),
            };
        }

        // Pattern 2: https://www.google.com/maps/@lat,lng,zoom
        const pattern2 = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
        const match2 = url.match(pattern2);
        if (match2) {
            return {
                latitude: parseFloat(match2[1]),
                longitude: parseFloat(match2[2]),
            };
        }

        // Pattern 3: https://maps.google.com/?q=lat,lng
        const pattern3 = /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
        const match3 = url.match(pattern3);
        if (match3) {
            return {
                latitude: parseFloat(match3[1]),
                longitude: parseFloat(match3[2]),
            };
        }

        return null;
    } catch (error) {
        console.error('Error parsing Google Maps link:', error);
        return null;
    }
};

/**
 * Validate if coordinates are within Tamil Nadu bounds (approximate)
 */
export const isInTamilNadu = (coords: Coordinates): boolean => {
    // Approximate bounds of Tamil Nadu
    const bounds = {
        north: 13.5,
        south: 8.0,
        east: 80.5,
        west: 76.0,
    };

    return (
        coords.latitude >= bounds.south &&
        coords.latitude <= bounds.north &&
        coords.longitude >= bounds.west &&
        coords.longitude <= bounds.east
    );
};

/**
 * Robustly match a detected location name or full address to our known localities
 */
export const matchLocalityInCity = (city: string, detectedArea: string, fullAddress?: string): string => {
    const localities = getLocalitiesForCity(city);
    if (localities.length === 0) return detectedArea;

    const lowerArea = detectedArea.toLowerCase();
    const lowerFull = fullAddress?.toLowerCase() || '';

    // 1. Try primary area match
    let matched = localities.find(loc =>
        loc.name.toLowerCase().includes(lowerArea) ||
        lowerArea.includes(loc.name.toLowerCase()) ||
        loc.subLocalities?.some(sub =>
            sub.toLowerCase().includes(lowerArea) ||
            lowerArea.includes(sub.toLowerCase())
        )
    );

    // 2. Try full address match if primary fails
    if (!matched && lowerFull) {
        matched = localities.find(loc =>
            lowerFull.includes(loc.name.toLowerCase()) ||
            loc.subLocalities?.some(sub => lowerFull.includes(sub.toLowerCase()))
        );
    }

    return matched ? matched.name : detectedArea;
};
