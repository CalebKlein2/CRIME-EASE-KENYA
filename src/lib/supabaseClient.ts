// src/lib/supabaseClient.ts
import { createClient, PostgrestError } from '@supabase/supabase-js';

// Get the Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Not found');
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Not found');

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing. Check your .env file and make sure it has:');
  console.error('VITE_SUPABASE_URL=your_supabase_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

// Define database schema types
export type Tables = {
  crime_reports: {
    Row: CrimeReportRecord;
    Insert: Omit<CrimeReportRecord, 'id' | 'created_at'>;
    Update: Partial<Omit<CrimeReportRecord, 'id' | 'created_at'>>;
  };
};

export type Database = {
  public: {
    Tables: Tables;
  };
};

// Create the Supabase client with proper types
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Define types for crime reports
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface CrimeReportFormData {
  description: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  incidentType: string;
  date: string;
  city: string;
  postalCode: string;
  name: string;
  contact: string;
  isAnonymous: boolean;
  userId?: string;
  mediaFiles?: any[];
}

export interface CrimeReportRecord {
  id: string;
  description: string;
  location: Location;
  incident_type: string;
  date: string;
  city: string;
  postal_code: string;
  name: string;
  contact: string;
  is_anonymous: boolean;
  user_id?: string | null;
  clerk_user_id?: string | null;
  status?: 'pending' | 'under_investigation' | 'resolved' | 'closed' | 'rejected';
  assigned_officer_id?: string;
  assigned_station_id?: string;
  media_files?: any[];
  created_at: string;
  updated_at?: string;
  title?: string; // Optional title for display purposes
  officer_name?: string; // Name of assigned officer
  station_name?: string; // Name of assigned station
  caseTypeId?: string; // ID of the case type
  caseTypeName?: string; // Name of the case type
}

// Transform form data to match Supabase column naming convention
function transformFormData(data: CrimeReportFormData): Tables['crime_reports']['Insert'] {
  // Create a user reference string that's compatible with Supabase
  // Clerk user IDs are in the format 'user_xyz' which isn't a valid UUID
  // We'll store the user ID as a string in a separate column
  const userReference = data.userId ? data.userId.toString() : null;
  
  return {
    description: data.description,
    location: {
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      address: data.address || '',
    },
    incident_type: data.incidentType,
    date: data.date,
    city: data.city,
    postal_code: data.postalCode,
    name: data.name,
    contact: data.contact,
    is_anonymous: data.isAnonymous,
    // Set user_id to null to avoid UUID validation errors
    user_id: null,
    // Store the actual Clerk user ID in a separate field
    clerk_user_id: userReference,
    media_files: data.mediaFiles
  };
}

// Police station interface
export interface PoliceStation {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  jurisdiction?: string;
  address: string;
  city: string;
  postal_code?: string;
  phone_number?: string;
  email?: string;
  station_head?: string;
  created_at?: string;
  updated_at?: string;
  distance?: number; // Add distance property for sorting by proximity
}

// Police station service
export const policeStationService = {
  // Get all police stations
  async getAllStations(): Promise<PoliceStation[]> {
    try {
      const { data, error } = await supabase
        .from('police_stations')
        .select('*');
      
      if (error) {
        console.error('Error fetching police stations:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Exception in getAllStations:', error);
      throw error;
    }
  },
  
  // Get police station by ID
  async getStationById(stationId: string): Promise<PoliceStation | null> {
    try {
      const { data, error } = await supabase
        .from('police_stations')
        .select('*')
        .eq('id', stationId)
        .single();
      
      if (error) {
        console.error('Error fetching police station:', error);
        throw error;
      }
      
      return data || null;
    } catch (error) {
      console.error('Exception in getStationById:', error);
      throw error;
    }
  },
  
  // Get nearest police stations based on coordinates
  async getNearestStations(latitude: number, longitude: number, limit: number = 5): Promise<PoliceStation[]> {
    try {
      // Fetch all stations first (in a real app with many stations, you would implement
      // a more efficient solution using PostGIS or a similar spatial database)
      const { data, error } = await supabase
        .from('police_stations')
        .select('*');
      
      if (error) {
        console.error('Error fetching police stations:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Calculate distance for each station and sort by distance
      const stationsWithDistance = data.map(station => {
        // Extract latitude and longitude from the location JSONB field
        const stationLat = station.location.latitude;
        const stationLng = station.location.longitude;
        
        // Calculate distance using Haversine formula
        const R = 6371; // Radius of the Earth in km
        const dLat = (stationLat - latitude) * Math.PI / 180;
        const dLon = (stationLng - longitude) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(latitude * Math.PI / 180) * Math.cos(stationLat * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in km
        
        return {
          ...station,
          distance
        };
      });
      
      // Sort by distance and limit results
      return stationsWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);
    } catch (error) {
      console.error('Exception in getNearestStations:', error);
      throw error;
    }
  }
};

// Notification interface
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  related_case_id?: string;
  notification_type?: string;
}

// Case tracking interface
export interface CaseUpdate {
  id: string;
  crime_report_id: string;
  update_text: string;
  status: string;
  officer_id?: string;
  officer_name?: string;
  created_at: string;
}

// Notification service
export const notificationService = {
  // Get all notifications for a user
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('clerk_user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Exception in getUserNotifications:', error);
      throw error;
    }
  },
  
  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Exception in markAsRead:', error);
      throw error;
    }
  },
  
  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('clerk_user_id', userId)
        .eq('is_read', false);
      
      if (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Exception in markAllAsRead:', error);
      throw error;
    }
  }
};

// Case tracking service
export const caseTrackingService = {
  // Get case updates for a specific crime report
  async getCaseUpdates(crimeReportId: string): Promise<CaseUpdate[]> {
    try {
      const { data, error } = await supabase
        .from('case_updates')
        .select('*')
        .eq('crime_report_id', crimeReportId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching case updates:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Exception in getCaseUpdates:', error);
      throw error;
    }
  },
  
  // Track a case by reference number
  async trackCaseByReference(referenceNumber: string): Promise<CrimeReportRecord | null> {
    try {
      const { data, error } = await supabase
        .from('crime_reports')
        .select('*')
        .eq('id', referenceNumber)
        .single();
      
      if (error) {
        console.error('Error tracking case by reference:', error);
        throw error;
      }
      
      return data || null;
    } catch (error) {
      console.error('Exception in trackCaseByReference:', error);
      throw error;
    }
  }
};

// Crime reporting service
export const crimeReportService = {
  // Create a crime report
  async createReport(data: CrimeReportFormData): Promise<string | null> {
    try {
      console.log('Creating crime report with Supabase:', data);
      
      // Transform the data to match Supabase schema
      const supabaseData = transformFormData(data);
      
      // Insert the data into Supabase and return the ID
      const result = await supabase
        .from('crime_reports')
        .insert(supabaseData)
        .select('id')
        .single();
      
      if (result.error) {
        console.error('Error creating crime report:', result.error);
        throw result.error;
      }
      
      console.log('Created report with ID:', result.data?.id);
      return result.data?.id || null;
    } catch (error) {
      console.error('Exception in createReport:', error);
      throw error;
    }
  },
  
  // Get all crime reports
  async getAllReports(): Promise<CrimeReportRecord[]> {
    try {
      const result = await supabase
        .from('crime_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (result.error) {
        console.error('Error fetching crime reports:', result.error);
        throw result.error;
      }
      
      return result.data || [];
    } catch (error) {
      console.error('Exception in getAllReports:', error);
      return [];
    }
  },
  
  // Get reports by user ID
  async getReportsByUserId(userId: string): Promise<CrimeReportRecord[]> {
    try {
      const result = await supabase
        .from('crime_reports')
        .select('*')
        .eq('clerk_user_id', userId)
        .order('created_at', { ascending: false });
      
      if (result.error) {
        console.error('Error fetching user reports:', result.error);
        throw result.error;
      }
      
      return result.data || [];
    } catch (error) {
      console.error('Exception in getReportsByUserId:', error);
      return [];
    }
  },

  // Get crime report by ID
  async getReportById(reportId: string): Promise<CrimeReportRecord | null> {
    try {
      const result = await supabase
        .from('crime_reports')
        .select('*')
        .eq('id', reportId)
        .single();
      
      if (result.error) {
        console.error('Error fetching crime report by ID:', result.error);
        throw result.error;
      }
      
      return result.data || null;
    } catch (error) {
      console.error('Error in getReportById:', error);
      return null;
    }
  },
  
  // Update a crime report
  async updateReport(reportId: string, updateData: Partial<Omit<CrimeReportRecord, 'id' | 'created_at'>>): Promise<boolean> {
    try {
      const result = await supabase
        .from('crime_reports')
        .update(updateData)
        .eq('id', reportId);
      
      if (result.error) {
        console.error('Error updating crime report:', result.error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateReport:', error);
      return false;
    }
  },
  
  // Delete a crime report
  async deleteReport(reportId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('crime_reports')
        .delete()
        .eq('id', reportId);
      
      if (error) {
        console.error('Error deleting crime report:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Exception in deleteReport:', error);
      throw error;
    }
  },

  // Get reports by user ID with additional details
  async getUserReports(userId: string): Promise<CrimeReportRecord[]> {
    try {
      const { data, error } = await supabase
        .from('crime_reports')
        .select(`
          *,
          police_stations!crime_reports_assigned_station_id_fkey(name)
        `)
        .eq('clerk_user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user reports:', error);
        throw error;
      }
      
      // Process the data to format it correctly
      const reports = data?.map(report => {
        // Generate a title if not present
        const title = report.title || `${report.incident_type} Report`;
        
        // Extract station name if available
        const stationName = report.police_stations?.name || 'Unassigned';
        
        return {
          ...report,
          title,
          station_name: stationName
        };
      }) || [];
      
      return reports;
    } catch (error) {
      console.error('Exception in getUserReports:', error);
      throw error;
    }
  },

  // Get recent reports for dashboard
  async getRecentReports(userId: string, limit: number = 5): Promise<CrimeReportRecord[]> {
    try {
      const { data, error } = await supabase
        .from('crime_reports')
        .select(`
          *,
          police_stations!crime_reports_assigned_station_id_fkey(name)
        `)
        .eq('clerk_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching recent reports:', error);
        throw error;
      }
      
      // Process the data to format it correctly
      const reports = data?.map(report => {
        // Generate a title if not present
        const title = report.title || `${report.incident_type} Report`;
        
        // Extract station name if available
        const stationName = report.police_stations?.name || 'Unassigned';
        
        return {
          ...report,
          title,
          station_name: stationName
        };
      }) || [];
      
      return reports;
    } catch (error) {
      console.error('Exception in getRecentReports:', error);
      throw error;
    }
  }
};
