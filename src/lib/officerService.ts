// src/lib/officerService.ts
import { supabase } from './supabaseClient';

export interface Officer {
  id: string;
  name: string;
  badge: string;
  rank: string;
  status: string;
  cases: number;
  phone: string;
  email?: string;
  department?: string;
  station_id?: string;
}

// Get all officers
export async function getAllOfficers(stationId?: string): Promise<Officer[]> {
  try {
    let query = supabase
      .from('officers')
      .select('*');
      
    // If stationId is provided, filter by station
    if (stationId) {
      query = query.eq('station_id', stationId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching officers:', error);
      console.log('Using mock data for officers');
      return getMockOfficers();
    }
    
    if (!data || data.length === 0) {
      console.log('No officers found. Using mock data.');
      return getMockOfficers();
    }
    
    // Transform data if needed
    return data.map(officer => ({
      id: officer.id,
      name: officer.name || 'Unknown Officer',
      badge: officer.badge_number || `KPS-${Math.floor(1000 + Math.random() * 9000)}`,
      rank: officer.rank || 'Constable',
      status: officer.status || 'On duty',
      cases: officer.active_cases || Math.floor(Math.random() * 5),
      phone: officer.phone || `+254 ${Math.floor(700 + Math.random() * 100)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`,
      email: officer.email || `${officer.name?.toLowerCase().replace(/\s+/g, '.')}@police.gov.ke`,
      department: officer.department || 'General Duties'
    }));
  } catch (error) {
    console.error('Exception in getAllOfficers:', error);
    return getMockOfficers();
  }
}

// Get officer by ID
export async function getOfficerById(officerId: string): Promise<Officer | null> {
  try {
    const { data, error } = await supabase
      .from('officers')
      .select('*')
      .eq('id', officerId)
      .single();
    
    if (error) {
      console.error('Error fetching officer details:', error);
      const mockOfficers = getMockOfficers();
      return mockOfficers.find(officer => officer.id === officerId) || null;
    }
    
    if (!data) {
      return null;
    }
    
    // Transform data if needed
    return {
      id: data.id,
      name: data.name || 'Unknown Officer',
      badge: data.badge_number || `KPS-${Math.floor(1000 + Math.random() * 9000)}`,
      rank: data.rank || 'Constable',
      status: data.status || 'On duty',
      cases: data.active_cases || Math.floor(Math.random() * 5),
      phone: data.phone || `+254 ${Math.floor(700 + Math.random() * 100)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`,
      email: data.email || `${data.name?.toLowerCase().replace(/\s+/g, '.')}@police.gov.ke`,
      department: data.department || 'General Duties'
    };
  } catch (error) {
    console.error('Exception in getOfficerById:', error);
    const mockOfficers = getMockOfficers();
    return mockOfficers.find(officer => officer.id === officerId) || null;
  }
}

// Add new officer
export async function addOfficer(officerData: Omit<Officer, 'id'>): Promise<string | null> {
  try {
    console.log('Starting addOfficer function with data:', officerData);
    const officerDataToInsert = {
      name: officerData.name,
      badge_number: officerData.badge,
      rank: officerData.rank,
      status: officerData.status,
      active_cases: officerData.cases,
      phone: officerData.phone,
      email: officerData.email,
      department: officerData.department,
      station_id: officerData.station_id
    };
    
    console.log('Inserting officer data:', officerDataToInsert);
    
    const { data, error } = await supabase
      .from('officers')
      .insert(officerDataToInsert)
      .select('id')
      .single();
    
    if (error) {
      console.error('Error adding officer to database:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      return null;
    }
    
    console.log('Successfully added officer to database with ID:', data?.id);
    return data?.id || null;
  } catch (error) {
    console.error('Exception in addOfficer:', error);
    return null;
  }
}

// Mock officers data
function getMockOfficers(): Officer[] {
  return [
    {
      id: "1",
      name: "Officer Johnson",
      badge: "KPS-1234",
      rank: "Sergeant",
      status: "On duty",
      cases: 5,
      phone: "+254 712 345 678",
      email: "johnson@police.gov.ke",
      department: "Patrol",
    },
    {
      id: "2",
      name: "Officer Chen",
      badge: "KPS-2345",
      rank: "Corporal",
      status: "On duty",
      cases: 3,
      phone: "+254 723 456 789",
      email: "chen@police.gov.ke",
      department: "Investigations",
    },
    {
      id: "3",
      name: "Officer Garcia",
      badge: "KPS-3456",
      rank: "Constable",
      status: "Off duty",
      cases: 0,
      phone: "+254 734 567 890",
      email: "garcia@police.gov.ke",
      department: "Traffic",
    },
    {
      id: "4",
      name: "Officer Patel",
      badge: "KPS-4567",
      rank: "Constable",
      status: "On leave",
      cases: 0,
      phone: "+254 745 678 901",
      email: "patel@police.gov.ke",
      department: "Community Policing",
    },
    {
      id: "5",
      name: "Officer Nguyen",
      badge: "KPS-5678",
      rank: "Sergeant",
      status: "On duty",
      cases: 4,
      phone: "+254 756 789 012",
      email: "nguyen@police.gov.ke",
      department: "Cybercrime",
    },
  ];
}
