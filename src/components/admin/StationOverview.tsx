import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { MapContainer } from './MapContainer';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function StationOverview() {
  const [stationData, setStationData] = useState(null);
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    totalOfficers: 0,
    activeTeams: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    loadStationData();
    loadStats();
  }, []);

  const loadStationData = async () => {
    try {
      const { data, error } = await supabase
        .from('police_stations')
        .select('*')
        .eq('id', user?.station_id)
        .single();

      if (error) throw error;
      setStationData(data);
    } catch (error) {
      console.error('Error loading station data:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Get total cases
      const { count: totalCases } = await supabase
        .from('cases')
        .select('*', { count: 'exact' })
        .eq('station_id', user?.station_id);

      // Get active cases
      const { count: activeCases } = await supabase
        .from('cases')
        .select('*', { count: 'exact' })
        .eq('station_id', user?.station_id)
        .in('status', ['open', 'in-progress']);

      // Get total officers
      const { count: totalOfficers } = await supabase
        .from('police_officers')
        .select('*', { count: 'exact' })
        .eq('station_id', user?.station_id);

      // Get active teams
      const { count: activeTeams } = await supabase
        .from('investigation_teams')
        .select('*', { count: 'exact' })
        .eq('station_id', user?.station_id)
        .eq('status', 'active');

      setStats({
        totalCases: totalCases || 0,
        activeCases: activeCases || 0,
        totalOfficers: totalOfficers || 0,
        activeTeams: activeTeams || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Total Cases</h3>
          <p className="text-3xl font-bold">{stats.totalCases}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Active Cases</h3>
          <p className="text-3xl font-bold">{stats.activeCases}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Total Officers</h3>
          <p className="text-3xl font-bold">{stats.totalOfficers}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Active Teams</h3>
          <p className="text-3xl font-bold">{stats.activeTeams}</p>
        </Card>
      </div>

      {stationData && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Station Location</h3>
          <MapContainer
            location={stationData.location}
            markers={[{
              position: stationData.location,
              title: stationData.name,
              description: stationData.address
            }]}
          />
        </Card>
      )}
    </div>