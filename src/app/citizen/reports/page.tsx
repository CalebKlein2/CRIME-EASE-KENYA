import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarCheck, FileText, MapPin, Bell, Home, User, Settings, 
  MessageCircle, HelpCircle, FileSearch, FileImage, FileAudio, 
  FileVideo, File, ExternalLink, Clock, Shield 
} from 'lucide-react';
import { crimeReportService, CrimeReportRecord } from '@/lib/supabaseClient';
import { getSeverityColor } from '@/data/caseTypes';

// Define navigation items for citizen dashboard
const navItems = [
  {
    label: "Dashboard",
    href: "/citizen-dashboard",
    icon: <Home className="h-5 w-5" />
  },
  {
    label: "My Reports",
    href: "/citizen-dashboard/reports",
    icon: <FileText className="h-5 w-5" />,
    active: true
  },
  {
    label: "Find Station",
    href: "/citizen-dashboard/find-station",
    icon: <MapPin className="h-5 w-5" />
  },
  {
    label: "Notifications",
    href: "/citizen-dashboard/notifications",
    icon: <Bell className="h-5 w-5" />
  },
  {
    label: "Track Case",
    href: "/citizen-dashboard/track",
    icon: <FileSearch className="h-5 w-5" />
  },
  {
    label: "Contact Support",
    href: "/citizen-dashboard/support",
    icon: <MessageCircle className="h-5 w-5" />
  },
  {
    label: "Help & FAQs",
    href: "/citizen-dashboard/help",
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    label: "Profile Settings",
    href: "/citizen-dashboard/settings",
    icon: <Settings className="h-5 w-5" />
  }
];

export default function CitizenReports() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<CrimeReportRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to main page if role doesn't match
  useEffect(() => {
    if (user && user.role !== "citizen") {
      console.log("[CitizenReports] User role doesn't match, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Fetch user reports when component mounts
  useEffect(() => {
    async function fetchReports() {
      try {
        if (user?.id) {
          console.log("Fetching reports for user ID:", user.id);
          const userReports = await crimeReportService.getUserReports(user.id);
          console.log("Fetched reports:", userReports);
          setReports(userReports);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchReports();
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }
  
  // Function to get appropriate status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'under_investigation':
        return <Badge className="bg-blue-100 text-blue-800">Under Investigation</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-purple-100 text-purple-800">Processing</Badge>;
    }
  };
  
  // Function to get appropriate icon for media type
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImage className="w-4 h-4 text-blue-500" />;
      case 'video':
        return <FileVideo className="w-4 h-4 text-purple-500" />;
      case 'audio':
        return <FileAudio className="w-4 h-4 text-green-500" />;
      case 'document':
      default:
        return <File className="w-4 h-4 text-orange-500" />;
    }
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <DashboardLayout
      title="My Reports"
      subtitle="View and manage your submitted reports"
      navItems={navItems}
      role="citizen"
      notifications={3}
    >
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Reports</CardTitle>
            <CardDescription>
              All your submitted reports and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                <span className="ml-3">Loading your reports...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-50 inline-flex rounded-full p-3 mb-4">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">No reports yet</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  You haven't submitted any reports yet. When you do, they'll appear here.
                </p>
                <button 
                  onClick={() => navigate('/citizen-dashboard/report')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  File a New Report
                </button>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-sm text-gray-600">
                  <div className="col-span-4">Case Details</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Evidence</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                {/* Table rows */}
                <div className="divide-y divide-gray-200">
                  {reports.map((report, index) => (
                    <div key={report.id} className={`p-4 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      {/* Mobile view (stacked) */}
                      <div className="md:hidden space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-blue-700">
                              {report.incident_type || report.caseTypeName || 'Case'}
                            </h3>
                            {report.is_anonymous && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                                <Shield className="w-3 h-3 mr-1" /> Anonymous
                              </span>
                            )}
                          </div>
                          {getStatusBadge(report.status || 'pending')}
                        </div>
                        
                        <p className="text-sm text-gray-600">#{report.id.substring(0, 8)}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(report.created_at)}
                        </p>
                        
                        <p className="text-sm">{report.description?.substring(0, 100)}{report.description?.length > 100 ? '...' : ''}</p>
                        
                        {/* Evidence */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Evidence:</span>
                          {report.media_files && report.media_files.length > 0 ? (
                            <div className="flex gap-1">
                              {report.media_files.map((file: any, index: number) => (
                                <span 
                                  key={index} 
                                  className="inline-flex items-center rounded-full p-1 bg-gray-100"
                                  title={file.name}
                                >
                                  {getMediaTypeIcon(file.type)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">None</span>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button 
                            onClick={() => navigate(`/citizen-dashboard/reports/${report.id}`)}
                            className="text-xs px-2 py-1.5 inline-flex items-center gap-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 border border-blue-200"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Details
                          </button>
                          
                          {report.assigned_officer_id && (
                            <button className="text-xs px-2 py-1 inline-flex items-center gap-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                              <MessageCircle className="w-3 h-3" />
                              Contact Officer
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Desktop view (table row) */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {report.incident_type || report.caseTypeName || 'Case'}
                              </h3>
                              {report.is_anonymous && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                                  <Shield className="w-3 h-3 mr-1" />
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">#{report.id.substring(0, 8)}</span>
                            <p className="text-sm mt-1 text-gray-600 line-clamp-2" title={report.description}>
                              {report.description?.substring(0, 80)}{report.description?.length > 80 ? '...' : ''}
                            </p>
                          </div>
                        </div>
                        
                        <div className="col-span-2 text-sm text-gray-600">
                          {formatDate(report.created_at)}
                        </div>
                        
                        <div className="col-span-2">
                          {getStatusBadge(report.status || 'pending')}
                        </div>
                        
                        <div className="col-span-2">
                          {report.media_files && report.media_files.length > 0 ? (
                            <div className="flex gap-1">
                              {report.media_files.map((file: any, index: number) => (
                                <span 
                                  key={index} 
                                  className="inline-flex items-center rounded-full p-1 bg-gray-100"
                                  title={file.name}
                                >
                                  {getMediaTypeIcon(file.type)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">None</span>
                          )}
                        </div>
                        
                        <div className="col-span-2 flex gap-2">
                          <button 
                            onClick={() => navigate(`/citizen-dashboard/reports/${report.id}`)}
                            className="text-xs px-2 py-1.5 inline-flex items-center gap-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 border border-blue-200"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Details
                          </button>
                          
                          {report.assigned_officer_id && (
                            <button className="text-xs px-2 py-1 inline-flex items-center gap-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                              <MessageCircle className="w-3 h-3" />
                              Contact
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Table footer */}
                <div className="p-4 bg-white border-t flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {reports.length} report{reports.length !== 1 ? 's' : ''} of {reports.length} total
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      className="px-3 py-1 text-sm border rounded bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={true}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">Page 1 of 1</span>
                    <button 
                      className="px-3 py-1 text-sm border rounded bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={true}
                    >
                      Next
                    </button>
                    <button 
                      onClick={() => navigate('/citizen-dashboard/report')}
                      className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      File a New Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
