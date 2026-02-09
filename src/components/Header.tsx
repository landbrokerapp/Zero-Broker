
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, User, LogOut, Building2, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const { favorites } = useFavorites();
    const location = useLocation();

    const navLinks = [
        { label: t('buy'), href: '/properties?intent=buy' },
        { label: t('rent'), href: '/properties?intent=rent' },
        { label: t('pg'), href: '/properties?intent=pg' },
    ];

    const isActive = (href: string) => location.pathname + location.search === href;

    return (
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
            <div className="container mx-auto px-4 relative">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="font-display font-bold text-xl text-foreground">
                            Zero<span className="text-primary">Broker</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`text-sm font-medium transition-colors ${isActive(link.href)
                                    ? 'text-primary font-semibold'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Location Badge */}
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">Coimbatore</span>
                        </div>

                        <div className="w-px h-6 bg-border mx-2 hidden lg:block" />

                        {/* Favorites Icon */}
                        <Link
                            to="/favorites"
                            className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-colors relative ${isActive('/favorites')
                                ? 'text-primary bg-primary/10'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                            title={t('favorites')}
                        >
                            <Heart className="w-5 h-5" />
                            {favorites.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {favorites.length}
                                </span>
                            )}
                        </Link>

                        {/* Language Switcher */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Globe className="w-5 h-5 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent/10 text-accent' : ''}>
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setLanguage('ta')} className={language === 'ta' ? 'bg-accent/10 text-accent' : ''}>
                                    தமிழ்
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link to="/post-property">
                            <Button variant="outline" className="hidden md:flex border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                                {t('postProperty')}
                            </Button>
                        </Link>

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary">
                                        <User className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-card border border-border">
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-medium text-foreground">{user?.phone}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/my-properties" className="cursor-pointer">
                                            {t('myProperties')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        {t('logout')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link to="/auth">
                                <Button className="bg-gradient-hero hover:opacity-90 text-primary-foreground">
                                    {t('login')}
                                </Button>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border animate-slide-in-up">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg h-12 flex items-center text-sm font-medium transition-colors ${isActive(link.href)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        } `}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                to="/favorites"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-3 h-12 flex items-center gap-3 rounded-xl text-sm font-medium transition-colors relative ${isActive('/favorites')
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    } `}
                            >
                                <div className="relative">
                                    <Heart className="w-5 h-5" />
                                    {favorites.length > 0 && (
                                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {favorites.length}
                                        </span>
                                    )}
                                </div>
                                {t('favorites')}
                            </Link>
                            <Link to="/post-property" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full mt-2 bg-gradient-accent text-accent-foreground">
                                    {t('postProperty')}
                                </Button>
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
