// @ts-nocheck
import { useEffect, useRef, useState } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface MapContainerProps {
  center?: Location;
  zoom?: number;
  markers?: Location[];
  onMarkerClick?: (location: Location) => void;
}

export const MapContainer = ({
  center = { lat: -1.2921, lng: 36.8219 }, // Default to Nairobi
  zoom = 12,
  markers = [],
  onMarkerClick,
}: MapContainerProps) => {
  const [error, setError] = useState<string | null>(null);

  // For now, just display a message that maps are disabled
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '400px', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd'
      }}
    >
      <p style={{ color: '#666', textAlign: 'center' }}>
        Map view temporarily disabled.<br/>
        <small>Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}</small><br/>
        <small>Markers: {markers.length}</small>
      </p>
    </div>
  );
}
