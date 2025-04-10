import React, { useEffect, useState, useRef } from 'react';
import { policeStationService, PoliceStation as SupabasePoliceStation } from '../../lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface Location {
  latitude: number;
  longitude: number;
}

// Extend the SupabasePoliceStation interface to include distance property
interface PoliceStation extends SupabasePoliceStation {
  distance?: number;
}

export const PoliceStationFinder: React.FC = () => {
  const { user } = useUser();
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearestStations, setNearestStations] = useState<PoliceStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    // Initialize Google Maps
    const initMap = () => {
      const mapOptions: google.maps.MapOptions = {
        center: { lat: -1.2921, lng: 36.8219 }, // Default to Nairobi
        zoom: 12,
        styles: [
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }],
          },
        ],
      };

      const mapElement = document.getElementById('map');
      if (mapElement) {
        mapRef.current = new window.google.maps.Map(mapElement, mapOptions);
      }
    };

    const loadGoogleMaps = () => {
      if (!window.google?.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    loadGoogleMaps();

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    setStatus('Requesting location access...');

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus('Location acquired, finding nearest stations...');
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        findNearestStations(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
        setStatus('');
      }
    );
  };

  const findNearestStations = async (latitude: number, longitude: number) => {
    try {
      setStatus('Analyzing nearby police stations...');
      
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add user location marker
      const userMarker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: mapRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: 'Your Location'
      });
      markersRef.current.push(userMarker);

      // Center map on user location
      mapRef.current?.setCenter({ lat: latitude, lng: longitude });
      mapRef.current?.setZoom(13);

      // Get stations from Supabase
      const stations = await policeStationService.getNearestStations(latitude, longitude, 5);
      
      // Stations already have distances calculated and are sorted
      const stationsWithDistance = stations.slice(0, 3);

      // Add station markers
      stationsWithDistance.forEach((station, index) => {
        const marker = new google.maps.Marker({
          position: { 
            lat: station.location.latitude, 
            lng: station.location.longitude 
          },
          map: mapRef.current,
          title: station.name,
          label: {
            text: `${index + 1}`,
            color: 'white',
            fontWeight: 'bold'
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-2">${station.name}</h3>
              <div class="space-y-1">
                <p class="text-sm"><strong>Distance:</strong> ${station.distance?.toFixed(2)} km</p>
                <p class="text-sm"><strong>Address:</strong> ${station.address}</p>
                <p class="text-sm"><strong>Contact:</strong> ${station.phone_number || 'No contact information'}</p>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapRef.current, marker);
        });

        markersRef.current.push(marker);
      });

      setNearestStations(stationsWithDistance);
      setStatus('');
      setLoading(false);
    } catch (error) {
      setError("Error finding nearest stations");
      setStatus('');
      setLoading(false);
      console.error('Error in findNearestStations:', error);
    }
  };

  return (
    <div className="relative w-full h-screen bg-white dark:bg-gray-900">
      <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Welcome, {user?.firstName || 'User'}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Find the nearest police stations to your location</p>
      </div>

      <div id="map" className="w-full h-full"></div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex flex-col gap-4">
            <button
              onClick={getUserLocation}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? status || "Processing..." : "Find Nearest Police Stations"}
            </button>
            
            {error && (
              <div className="text-red-500 text-sm bg-red-100 dark:bg-red-900/20 p-3 rounded flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {nearestStations.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Nearest Police Stations:</h3>
                {nearestStations.map((station, index) => (
                  <div 
                    key={station.id} 
                    className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => {
                      mapRef.current?.setCenter({ 
                        lat: station.location.latitude, 
                        lng: station.location.longitude 
                      });
                      mapRef.current?.setZoom(15);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium">{station.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{station.address}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">{station.distance?.toFixed(2)} km</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{station.phone_number || 'No contact'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
