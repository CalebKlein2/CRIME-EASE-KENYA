import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface StationStats {
  totalCases: number;
  activeCases: number;
  totalOfficers: number;
  activeTeams: number;
}

interface Station {
  id: string;
  name: string;
  location: string;
  stats: StationStats;
}

export default function StationOverview() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock data instead of fetching from Supabase
    setStations([
      {
        id: '1',
        name: 'Central Police Station',
        location: 'Nairobi CBD',
        stats: {
          totalCases: 150,
          activeCases: 45,
          totalOfficers: 75,
          activeTeams: 12
        }
      },
      {
        id: '2',
        name: 'Kilimani Police Station',
        location: 'Kilimani',
        stats: {
          totalCases: 120,
          activeCases: 35,
          totalOfficers: 60,
          activeTeams: 8
        }
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading stations...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stations.map((station) => (
        <Card key={station.id} className="p-4">
          <h3 className="text-lg font-semibold mb-2">{station.name}</h3>
          <p className="text-gray-600 mb-4">{station.location}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Total Cases</p>
              <p className="text-xl font-bold">{station.stats.totalCases}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Cases</p>
              <p className="text-xl font-bold">{station.stats.activeCases}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Officers</p>
              <p className="text-xl font-bold">{station.stats.totalOfficers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Teams</p>
              <p className="text-xl font-bold">{station.stats.activeTeams}</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm">View Details</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}