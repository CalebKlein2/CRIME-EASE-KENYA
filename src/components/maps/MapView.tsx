// src/components/maps/MapView.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
}

interface MapMarker extends Location {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}

interface MapViewProps {
  center?: Location;
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  showControls?: boolean;
}

export function MapView({
  center = { lat: -1.2921, lng: 36.8219 }, // Default to Nairobi
  zoom = 12,
  markers = [],
  height = "400px",
  onMarkerClick,
  showControls = true,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;

      try {
        // Initialize the map
        googleMapRef.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: !showControls,
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Error loading map');
        setLoading(false);
      }
    };

    // Load Google Maps API if it's not already loaded
    const loadGoogleMaps = () => {
      if (!window.google?.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        script.onerror = () => {
          setError('Failed to load Google Maps');
          setLoading(false);
        };
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    loadGoogleMaps();

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current.clear();
    };
  }, []);

  // Update map center and zoom if they change
  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setCenter(center);
      googleMapRef.current.setZoom(zoom);
    }
  }, [center, zoom]);

  // Update markers when they change
  useEffect(() => {
    if (!googleMapRef.current) return;

    // Remove markers that are no longer in the list
    markersRef.current.forEach((marker, id) => {
      if (!markers.find(m => m.id === id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    });

    // Add or update markers
    markers.forEach(markerData => {
      if (markersRef.current.has(markerData.id)) {
        // Update existing marker
        const marker = markersRef.current.get(markerData.id)!;
        marker.setPosition({ lat: markerData.lat, lng: markerData.lng });
      } else {
        // Create new marker
        const marker = new google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map: googleMapRef.current,
          title: markerData.title,
          animation: google.maps.Animation.DROP,
        });

        // Add click listener
        if (onMarkerClick) {
          marker.addListener('click', () => {
            onMarkerClick(markerData);
          });
        }

        // Add info window if there's a description
        if (markerData.description) {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3 class="font-semibold">${markerData.title}</h3>
                <p>${markerData.description}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(googleMapRef.current, marker);
          });
        }

        markersRef.current.set(markerData.id, marker);
      }
    });
  }, [markers, onMarkerClick]);

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Loading map...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      )}
    </div>
  );
}