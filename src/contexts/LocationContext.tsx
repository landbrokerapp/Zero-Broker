
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextType {
    city: string;
    sublocality: string;
    setCity: (city: string) => void;
    setSublocality: (sublocality: string) => void;
    updateLocation: (city: string, sublocality: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    // Try to load from localStorage first
    const [city, setCityState] = useState(() => localStorage.getItem('zb_current_city') || 'Coimbatore');
    const [sublocality, setSublocalityState] = useState(() => localStorage.getItem('zb_current_sublocality') || '');

    const setCity = (newCity: string) => {
        setCityState(newCity);
        localStorage.setItem('zb_current_city', newCity);
    };

    const setSublocality = (newSub: string) => {
        setSublocalityState(newSub);
        localStorage.setItem('zb_current_sublocality', newSub);
    };

    const updateLocation = (newCity: string, newSub: string) => {
        setCityState(newCity);
        setSublocalityState(newSub);
        localStorage.setItem('zb_current_city', newCity);
        localStorage.setItem('zb_current_sublocality', newSub);
    };

    return (
        <LocationContext.Provider value={{ city, sublocality, setCity, setSublocality, updateLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocationContext() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }
    return context;
}
