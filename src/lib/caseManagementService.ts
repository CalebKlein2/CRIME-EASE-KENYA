// src/lib/caseManagementService.ts
import { supabase } from './supabaseClient';
import type { CrimeReportRecord } from './supabaseClient';

export interface CaseStatusUpdate {
  id?: string;
  report_id: string;
  status: string;
  notes: string;
  assigned_officer_id?: string;
  updated_by: string;
  created_at?: string;
}

export const caseStatus = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  UNDER_INVESTIGATION: 'under_investigation',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REJECTED: 'rejected'
};

// Get all cases for a station
export async function getStationCases(stationId?: string): Promise<CrimeReportRecord[]> {
  try {
    let query = supabase
      .from('crime_reports')
      .select(`
        *,
        case_updates:case_status_updates(*)
      `)
      .order('created_at', { ascending: false });
    
    // If stationId is provided, filter by station
    if (stationId) {
      query = query.eq('assigned_station_id', stationId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching station cases:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in getStationCases:', error);
    return [];
  }
}

// Assign an officer to a case
export async function assignCaseToOfficer(
  caseId: string,
  officerId: string,
  officerName: string,
  notes: string = 'Case assigned',
  updatedBy: string
): Promise<boolean> {
  try {
    // Update the crime report
    const { error: updateError } = await supabase
      .from('crime_reports')
      .update({ 
        assigned_officer_id: officerId,
        officer_name: officerName,
        status: caseStatus.ASSIGNED
      })
      .eq('id', caseId);
    
    if (updateError) {
      console.error('Error assigning case to officer:', updateError);
      return false;
    }
    
    // Add a case status update record
    const statusUpdate: CaseStatusUpdate = {
      report_id: caseId,
      status: caseStatus.ASSIGNED,
      notes: notes,
      assigned_officer_id: officerId,
      updated_by: updatedBy
    };
    
    const { error: statusError } = await supabase
      .from('case_status_updates')
      .insert(statusUpdate);
    
    if (statusError) {
      console.error('Error adding case status update:', statusError);
      // The main update succeeded, so still return true
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in assignCaseToOfficer:', error);
    return false;
  }
}

// Update case status
export async function updateCaseStatus(
  caseId: string,
  status: string,
  notes: string,
  updatedBy: string
): Promise<boolean> {
  try {
    // Update the crime report
    const { error: updateError } = await supabase
      .from('crime_reports')
      .update({ status })
      .eq('id', caseId);
    
    if (updateError) {
      console.error('Error updating case status:', updateError);
      return false;
    }
    
    // Add a case status update record
    const statusUpdate: CaseStatusUpdate = {
      report_id: caseId,
      status,
      notes,
      updated_by: updatedBy
    };
    
    const { error: statusError } = await supabase
      .from('case_status_updates')
      .insert(statusUpdate);
    
    if (statusError) {
      console.error('Error adding case status update:', statusError);
      // The main update succeeded, so still return true
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in updateCaseStatus:', error);
    return false;
  }
}

// Get case history (status updates)
export async function getCaseHistory(caseId: string): Promise<CaseStatusUpdate[]> {
  try {
    const { data, error } = await supabase
      .from('case_status_updates')
      .select('*')
      .eq('report_id', caseId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching case history:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in getCaseHistory:', error);
    return [];
  }
}

// Get cases by status
export async function getCasesByStatus(status: string, stationId?: string): Promise<CrimeReportRecord[]> {
  try {
    let query = supabase
      .from('crime_reports')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    // If stationId is provided, filter by station
    if (stationId) {
      query = query.eq('assigned_station_id', stationId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${status} cases:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`Exception in getCasesByStatus for ${status}:`, error);
    return [];
  }
}

// Get cases assigned to specific officer
export async function getOfficerCases(officerId: string): Promise<CrimeReportRecord[]> {
  try {
    const { data, error } = await supabase
      .from('crime_reports')
      .select('*')
      .eq('assigned_officer_id', officerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching officer cases:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception in getOfficerCases:', error);
    return [];
  }
}

// Get case statistics for a station
export async function getCaseStatistics(stationId?: string) {
  try {
    // Get all cases
    let query = supabase
      .from('crime_reports')
      .select('id, status');
    
    // If stationId is provided, filter by station
    if (stationId) {
      query = query.eq('assigned_station_id', stationId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching case statistics:', error);
      return {
        total: 0,
        pending: 0,
        assigned: 0,
        under_investigation: 0,
        resolved: 0,
        closed: 0,
        rejected: 0
      };
    }
    
    // Count cases by status
    const total = data.length;
    const pending = data.filter(c => c.status === caseStatus.PENDING).length;
    const assigned = data.filter(c => c.status === caseStatus.ASSIGNED).length;
    const under_investigation = data.filter(c => c.status === caseStatus.UNDER_INVESTIGATION).length;
    const resolved = data.filter(c => c.status === caseStatus.RESOLVED).length;
    const closed = data.filter(c => c.status === caseStatus.CLOSED).length;
    const rejected = data.filter(c => c.status === caseStatus.REJECTED).length;
    
    return {
      total,
      pending,
      assigned,
      under_investigation,
      resolved,
      closed,
      rejected
    };
  } catch (error) {
    console.error('Exception in getCaseStatistics:', error);
    return {
      total: 0,
      pending: 0,
      assigned: 0,
      under_investigation: 0,
      resolved: 0,
      closed: 0,
      rejected: 0
    };
  }
}
