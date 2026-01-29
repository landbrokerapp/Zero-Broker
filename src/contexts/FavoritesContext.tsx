import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
    favorites: string[];
    addToFavorites: (id: string) => void;
    removeFromFavorites: (id: string) => void;
    isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>(() => {
        const saved = localStorage.getItem('property_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('property_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (id: string) => {
        setFavorites((prev) => {
            if (!prev.includes(id)) {
                return [...prev, id];
            }
            return prev;
        });
    };

    const removeFromFavorites = (id: string) => {
        setFavorites((prev) => prev.filter((favId) => favId !== id));
    };

    const isFavorite = (id: string) => favorites.includes(id);

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
