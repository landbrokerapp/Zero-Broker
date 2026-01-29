import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                Zero<span className="text-secondary">Broker</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Find your perfect property without any brokerage. Buy, rent, or find PG accommodations directly from owners.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/properties?intent=buy" className="text-muted-foreground hover:text-secondary text-sm transition-colors">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link to="/properties?intent=rent" className="text-muted-foreground hover:text-secondary text-sm transition-colors">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link to="/properties?intent=pg" className="text-muted-foreground hover:text-secondary text-sm transition-colors">
                  PG / Co-Living
                </Link>
              </li>
              <li>
                <Link to="/post-property" className="text-muted-foreground hover:text-secondary text-sm transition-colors">
                  Post Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Localities */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Popular Localities</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/properties?locality=Saravanampatti" className="text-muted-foreground hover:text-secondary text-sm transition-colors">
                  Saravanampatti
                </Link>
              </li>
              <li>
                <Link to="/properties?locality=Peelamedu" className="text-muted-foreground hover:text-secondary text-sm transition-colors">
                  Peelamedu
                </Link>
              </li>
              <li>
                <Link to="/properties?locality=RS Puram" className="text-muted-foreground hover:text-secondary text-sm transition-colors">
                  RS Puram
                </Link>
              </li>
              <li>
                <Link to="/properties?locality=Gandhipuram" className="text-muted-foreground hover:text-secondary text-sm transition-colors">
                  Gandhipuram
                </Link>
              </li>
              <li>
                <Link to="/properties?locality=Vadavalli" className="text-muted-foreground hover:text-secondary text-sm transition-colors">
                  Vadavalli
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  Coimbatore, Tamil Nadu, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary" />
                <span className="text-muted-foreground text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <span className="text-muted-foreground text-sm">hello@zerobroker.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 ZeroBroker. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
