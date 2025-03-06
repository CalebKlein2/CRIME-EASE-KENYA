import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  className?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, className = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapContainerRef.current) return;

      try {
        const mapOptions: google.maps.MapOptions = {
          center: { lat: -1.2921, lng: 36.8219 }, // Default to Nairobi
          zoom: 13,
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
          ],
        };

        mapRef.current = new window.google.maps.Map(mapContainerRef.current, mapOptions);

        // Add click listener to map
        mapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
          const position = e.latLng;
          if (position) {
            updateMarkerPosition(position);
            reverseGeocode(position);
          }
        });

        // Try to get user's current location
        if (navigator.geolocation) {
          setLoading(true);
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              if (mapRef.current) {
                mapRef.current.setCenter(pos);
                updateMarkerPosition(pos);
                reverseGeocode(pos);
              }
              setLoading(false);
            },
            () => {
              setError("Error getting your location");
              setLoading(false);
            }
          );
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Error loading map');
        setLoading(false);
      }
    };

    const loadGoogleMaps = async () => {
      if (!window.google?.maps) {
        try {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Google Maps'));
            document.head.appendChild(script);
          });
        } catch (err) {
          console.error('Error loading Google Maps:', err);
          setError('Error loading Google Maps');
          return;
        }
      }
      await initMap();
    };

    loadGoogleMaps();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, []);

  const updateMarkerPosition = (position: google.maps.LatLng | google.maps.LatLngLiteral) => {
    if (!mapRef.current) return;

    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        position,
        map: mapRef.current,
        draggable: true,
      });

      // Add drag end listener
      markerRef.current.addListener('dragend', () => {
        const position = markerRef.current?.getPosition();
        if (position) {
          reverseGeocode(position);
        }
      });
    } else {
      markerRef.current.setPosition(position);
    }
  };

  const reverseGeocode = async (position: google.maps.LatLng | google.maps.LatLngLiteral) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: position });
      
      if (response.results && response.results.length > 0) {
        const address = response.results[0].formatted_address;
        onLocationSelect({
          latitude: typeof position.lat === 'function' ? position.lat() : position.lat,
          longitude: typeof position.lng === 'function' ? position.lng() : position.lng,
          address
        });
      } else {
        onLocationSelect({
          latitude: typeof position.lat === 'function' ? position.lat() : position.lat,
          longitude: typeof position.lng === 'function' ? position.lng() : position.lng,
        });
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
      onLocationSelect({
        latitude: typeof position.lat === 'function' ? position.lat() : position.lat,
        longitude: typeof position.lng === 'function' ? position.lng() : position.lng,
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full rounded-lg overflow-hidden"></div>
      {loading && (
        <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span>Getting your location...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 dark:bg-red-900/20 text-red-500 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};
