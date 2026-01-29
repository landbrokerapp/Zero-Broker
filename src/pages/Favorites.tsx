import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { ChatBot } from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/contexts/FavoritesContext';
import { mockProperties } from '@/data/mockProperties';

export default function Favorites() {
    const { favorites } = useFavorites();

    const favoriteProperties = mockProperties.filter(property => favorites.includes(property.id));

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Link to="/" className="hover:text-primary">Home</Link>
                        <span>/</span>
                        <span className="text-foreground">Favorites</span>
                    </div>
                    <h1 className="font-display text-3xl font-bold text-foreground">
                        My Favorites
                    </h1>
                </div>

                {favoriteProperties.length > 0 ? (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {favoriteProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                            <Heart className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                            No favorites yet
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Properties you mark as favorite will appear here. Start exploring to find your dream home!
                        </p>
                        <Link to="/properties">
                            <Button>Browse Properties</Button>
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
            <ChatBot />
        </div>
    );
}
