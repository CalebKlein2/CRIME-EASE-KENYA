import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  CalendarCheck, 
  FileText, 
  MapPin, 
  Bell, 
  Home, 
  User, 
  Settings, 
  MessageCircle, 
  HelpCircle, 
  FileSearch, 
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

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
    icon: <FileText className="h-5 w-5" />
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
    icon: <HelpCircle className="h-5 w-5" />,
    active: true
  },
  {
    label: "Profile Settings",
    href: "/citizen-dashboard/settings",
    icon: <Settings className="h-5 w-5" />
  }
];

// FAQ categories and questions
const faqCategories = [
  {
    id: "reporting",
    title: "Reporting Incidents",
    faqs: [
      {
        question: "How do I report a crime?",
        answer: "You can report a crime by clicking on the 'New Report' button on your dashboard. Follow the step-by-step form to provide all necessary details. You can also report in person at your nearest police station."
      },
      {
        question: "What information should I include when reporting?",
        answer: "Include as many details as possible: date and time of the incident, location, description of what happened, descriptions of any suspects, details of stolen/damaged property, witness information, and any photos or videos if available."
      },
      {
        question: "Can I report anonymously?",
        answer: "Yes, you can report anonymously, but this may limit our ability to follow up with you or get additional information. Anonymous reports are still investigated, but providing contact information is encouraged."
      },
      {
        question: "How long does it take for my report to be processed?",
        answer: "Reports are typically reviewed within 24-48 hours. Urgent cases may be prioritized. You'll receive a notification when an officer is assigned to your case."
      }
    ]
  },
  {
    id: "cases",
    title: "Case Management & Tracking",
    faqs: [
      {
        question: "How do I check the status of my case?",
        answer: "You can check your case status using the 'Track Case' feature. Enter your case number to see all updates, assigned officers, and investigation progress."
      },
      {
        question: "What do the different case statuses mean?",
        answer: "Case statuses include: 'Reported' (initial submission), 'Assigned' (officer assigned), 'Under Investigation' (actively being worked on), 'In Progress' (ongoing investigation), 'Resolved' (case concluded with outcome), and 'Closed' (no further action required)."
      },
      {
        question: "How can I provide additional information for my case?",
        answer: "You can add new information to your case by going to 'My Reports', finding your case, and clicking on 'Update' or by contacting the assigned officer directly."
      },
      {
        question: "How long are cases typically active?",
        answer: "Case duration varies widely depending on complexity. Minor incidents may be resolved within days, while complex cases could take weeks or months. You'll receive updates on any significant changes in status."
      }
    ]
  },
  {
    id: "account",
    title: "Account & Security",
    faqs: [
      {
        question: "How do I update my personal information?",
        answer: "You can update your personal information by going to 'Profile Settings'. This includes your contact details, address, and notification preferences."
      },
      {
        question: "Is my personal information kept confidential?",
        answer: "Yes, all personal information is encrypted and kept confidential. It is only accessible to authorized law enforcement personnel directly involved in your case."
      },
      {
        question: "What should I do if I forgot my password?",
        answer: "On the login page, click 'Forgot Password' and follow the instructions to reset it. A secure reset link will be sent to your registered email address."
      },
      {
        question: "Can someone else access my reports?",
        answer: "Only you and authorized officers can access your reports. If you need to share access with a family member or legal representative, contact support to set up appropriate permissions."
      }
    ]
  },
  {
    id: "general",
    title: "General Information",
    faqs: [
      {
        question: "How do I find the nearest police station?",
        answer: "Use the 'Find Station' feature in the sidebar to locate the nearest police stations to your current location or any address you enter."
      },
      {
        question: "How can I contact an officer?",
        answer: "You can contact the officer assigned to your case through the case details page. Look for the 'Contact Officer' button or use the messaging feature."
      },
      {
        question: "What are the emergency contact numbers?",
        answer: "For emergencies, always call 999 or 112. For non-emergency police matters, call the station directly or use the 'Contact Support' feature."
      },
      {
        question: "How can I provide feedback on the service?",
        answer: "We welcome your feedback. You can provide feedback on specific cases or the overall service through the 'Contact Support' page."
      }
    ]
  }
];

export default function CitizenHelp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState({});

  // Redirect to main page if role doesn't match
  useEffect(() => {
    if (user && user.role !== "citizen") {
      console.log("[CitizenHelp] User role doesn't match, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Toggle FAQ expanded state
  const toggleFaq = (categoryId, index) => {
    setExpandedFaqs(prev => {
      const key = `${categoryId}-${index}`;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery.trim() ? 
    faqCategories.map(category => ({
      ...category,
      faqs: category.faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.faqs.length > 0) 
    : faqCategories;

  return (
    <DashboardLayout
      title="Help & FAQs"
      subtitle="Find answers to common questions"
      navItems={navItems}
      role="citizen"
      notifications={3}
    >
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Search for answers or browse by category
            </CardDescription>
            <div className="mt-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search help articles..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No results found</h3>
                  <p className="mt-1 text-gray-500">
                    Try searching with different keywords or browse the categories below
                  </p>
                </div>
              ) : (
                filteredFaqs.map(category => (
                  <div key={category.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="font-medium">{category.title}</h3>
                    </div>
                    <div className="divide-y">
                      {category.faqs.map((faq, index) => {
                        const isExpanded = expandedFaqs[`${category.id}-${index}`];
                        return (
                          <div key={index} className="px-4 py-3">
                            <button 
                              className="flex w-full justify-between items-center text-left"
                              onClick={() => toggleFaq(category.id, index)}
                            >
                              <span className="font-medium">{faq.question}</span>
                              {isExpanded ? 
                                <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                              }
                            </button>
                            {isExpanded && (
                              <div className="mt-2 text-gray-600 text-sm">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Tutorials</CardTitle>
            <CardDescription>
              Watch instructional videos on how to use Crime Ease
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <div className="p-3">
                  <h4 className="font-medium">How to Submit a Report</h4>
                  <p className="text-sm text-gray-500 mt-1">Learn how to create and submit incident reports quickly and accurately.</p>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <FileSearch className="h-10 w-10 text-gray-400" />
                </div>
                <div className="p-3">
                  <h4 className="font-medium">Tracking Your Case</h4>
                  <p className="text-sm text-gray-500 mt-1">How to effectively track and monitor the progress of your case.</p>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <div className="p-3">
                  <h4 className="font-medium">Managing Your Account</h4>
                  <p className="text-sm text-gray-500 mt-1">Tips for keeping your account secure and updating your information.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-gray-500">Can't find what you're looking for?</p>
          <Button
            variant="link"
            onClick={() => navigate('/citizen-dashboard/support')}
            className="mt-1"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
