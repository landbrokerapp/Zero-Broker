import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/data/mockProperties';
import { PropertyCard } from './PropertyCard';
import { MapPin } from 'lucide-react';
import { createRoot } from 'react-dom/client';

interface PropertyMapProps {
    properties: Property[];
    className?: string;
}

export function PropertyMap({ properties, className = '' }: PropertyMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [error, setError] = useState<string | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    useEffect(() => {
        if (!mapContainer.current) return;

        const mapToken = import.meta.env.VITE_MAPBOX_TOKEN;

        if (!mapToken) {
            setError('Missing Mapbox Token');
            return;
        }

        try {
            mapboxgl.accessToken = mapToken;

            if (map.current) return; // initialize map only once

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [76.9558, 11.0168], // Coimbatore
                zoom: 11
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        } catch (err) {
            console.error('Error initializing map:', err);
            setError('Failed to load map');
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Update markers when properties change
    useEffect(() => {
        if (!map.current || !properties.length) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        properties.forEach(property => {
            if (property.coordinates) {
                // Create custom marker element
                const el = document.createElement('div');
                el.className = 'cursor-pointer group';

                // Render simple price tag using React root API logic or just innerHTML for simplicity in this bridge
                // To be safe and framework-y, distinct React roots per marker is possible but heavy.
                // We'll use simple DOM strings for the marker visual to avoid complexity, 
                // and a React portal or separate render for the Popup if needed.
                // For simplicity here, we'll use standard DOM elements for the marker.

                const priceText = property.price >= 100000
                    ? `${(property.price / 100000).toFixed(1)}L`
                    : `${(property.price / 1000).toFixed(0)}k`;

                el.innerHTML = `
          <div style="background-color: hsl(224 76% 33%); color: white; padding: 6px 12px; border-radius: 9999px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; align-items: center; gap: 4px;">
            <span>₹${priceText}</span>
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid hsl(224 76% 33%); margin: 0 auto;"></div>
        `;

                const marker = new mapboxgl.Marker(el)
                    .setLngLat([property.coordinates.lng, property.coordinates.lat])
                    .addTo(map.current!);

                // Add popup
                const popupNode = document.createElement('div');
                const root = createRoot(popupNode);
                root.render(<div className="p-2"><PropertyCard property={property} /></div>);

                const popup = new mapboxgl.Popup({ offset: 25, maxWidth: '320px', className: 'hover-popup' })
                    .setDOMContent(popupNode);

                marker.setPopup(popup);
                markersRef.current.push(marker);
            }
        });

    }, [properties]);

    if (error) {
        return (
            <div className={`w-full h-[600px] bg-muted/30 rounded-2xl flex flex-col items-center justify-center p-8 text-center border border-border ${className}`}>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Map View Unavailable</h3>
                <p className="text-muted-foreground max-w-md">
                    {error === 'Missing Mapbox Token'
                        ? 'Please add a Mapbox Access Token to your environment variables (VITE_MAPBOX_TOKEN) to enable the interactive map view.'
                        : 'An error occurred while loading the map.'}
                </p>
            </div>
        );
    }

    return (
        <div className={`w-full h-[600px] rounded-2xl overflow-hidden border border-border ${className}`}>
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
}
