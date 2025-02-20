import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapContainerProps {
  location?: { lat: number; lng: number };
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    description: string;
  }>;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

export function MapContainer({
  location,
  markers = [],
  onLocationSelect,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      setGoogleMapsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!googleMapsLoaded || !mapRef.current) return;

    const initialLocation = location || { lat: -1.2921, lng: 36.8219 }; // Default to Nairobi

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: initialLocation,
      zoom: 12,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    setMap(mapInstance);

    if (onLocationSelect) {
      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          onLocationSelect({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
        }
      });
    }

    // Add markers
    markers.forEach((marker) => {
      const mapMarker = new google.maps.Marker({
        position: marker.position,
        map: mapInstance,
        title: marker.title,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3 class="font-semibold">${marker.title}</h3>
            <p>${marker.description}</p>
          </div>
        `,
      });

      mapMarker.addListener("click", () => {
        infoWindow.open(mapInstance, mapMarker);
      });
    });
  }, [googleMapsLoaded, location, markers]);

  return (
    <div ref={mapRef} className="w-full h-[400px] rounded-lg overflow-hidden" />
  );
}
