import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/button';

interface MapLocationPickerProps {
    onLocationSelect: (coords: { lat: number; lng: number; address?: string }) => void;
    initialLocation?: { lat: number; lng: number };
    className?: string;
}

export function MapLocationPicker({ onLocationSelect, initialLocation, className = '' }: MapLocationPickerProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(
        initialLocation || null
    );

    useEffect(() => {
        if (!mapContainer.current) return;

        const mapToken = import.meta.env.VITE_MAPBOX_TOKEN;

        if (!mapToken) {
            setError('Missing Mapbox Token');
            return;
        }

        try {
            mapboxgl.accessToken = mapToken;

            if (map.current) return;

            const initialCenter = initialLocation || { lng: 76.9558, lat: 11.0168 }; // Coimbatore

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [initialCenter.lng, initialCenter.lat],
                zoom: 13
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Create draggable marker
            const markerElement = document.createElement('div');
            markerElement.className = 'cursor-move';
            markerElement.innerHTML = `
        <div style="width: 40px; height: 40px; background-color: hsl(224 76% 33%); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);">
          <div style="transform: rotate(45deg); color: white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      `;

            marker.current = new mapboxgl.Marker({
                element: markerElement,
                draggable: true
            })
                .setLngLat([initialCenter.lng, initialCenter.lat])
                .addTo(map.current);

            // Update coordinates when marker is dragged
            marker.current.on('dragend', () => {
                const lngLat = marker.current!.getLngLat();
                const coords = { lat: lngLat.lat, lng: lngLat.lng };
                setSelectedCoords(coords);
                onLocationSelect(coords);
            });

            // Click on map to place marker
            map.current.on('click', (e) => {
                const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
                marker.current?.setLngLat([coords.lng, coords.lat]);
                setSelectedCoords(coords);
                onLocationSelect(coords);
            });

            // Set initial location if provided
            if (initialLocation) {
                setSelectedCoords(initialLocation);
                onLocationSelect(initialLocation);
            }

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

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    if (map.current && marker.current) {
                        map.current.flyTo({ center: [coords.lng, coords.lat], zoom: 15 });
                        marker.current.setLngLat([coords.lng, coords.lat]);
                        setSelectedCoords(coords);
                        onLocationSelect(coords);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please select manually on the map.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    if (error) {
        return (
            <div className={`w-full h-[400px] bg-muted/30 rounded-xl flex flex-col items-center justify-center p-8 text-center border border-border ${className}`}>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Map Unavailable</h3>
                <p className="text-muted-foreground max-w-md text-sm">
                    {error === 'Missing Mapbox Token'
                        ? 'Map functionality requires a Mapbox token. Please contact support.'
                        : 'An error occurred while loading the map.'}
                </p>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <div className="w-full h-[400px] rounded-xl overflow-hidden border border-border">
                <div ref={mapContainer} className="w-full h-full" />
            </div>

            <div className="absolute top-4 left-4 z-10">
                <Button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="bg-card hover:bg-card/90 text-foreground border border-border shadow-lg"
                    size="sm"
                >
                    <Navigation className="w-4 h-4 mr-2" />
                    Use My Location
                </Button>
            </div>

            {selectedCoords && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Selected Location:</p>
                    <p className="text-sm font-mono">
                        Lat: {selectedCoords.lat.toFixed(6)}, Lng: {selectedCoords.lng.toFixed(6)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Click on the map or drag the marker to adjust the location
                    </p>
                </div>
            )}
        </div>
    );
}
