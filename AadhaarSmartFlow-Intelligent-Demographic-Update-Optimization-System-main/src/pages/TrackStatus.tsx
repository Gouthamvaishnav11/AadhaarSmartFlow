import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  CheckCircle,
  Clock,
  FileSearch,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

const API_BASE = "/api";

interface TimelineItem {
  step: string;
  status: "completed" | "current" | "pending";
  date?: string;
  description: string;
}

interface RequestSummary {
  id: number;
  request_id: string;
  type: string;
  status: "approved" | "pending" | "rejected" | "review" | "submitted" | "auto_approved" | "processing";
  date: string;
}

interface RequestDetails {
  id: number;
  request_id: string;
  type: string;
  status: "approved" | "pending" | "rejected" | "review" | "submitted" | "auto_approved" | "processing";
  submittedDate: string;
  estimatedTime: string;
  timeline: TimelineItem[];
}

const TrackStatus = () => {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [requests, setRequests] = useState<RequestSummary[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUserName(userData.name || "User");
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    if (!token) {
      navigate("/login");
      return;
    }
    fetchRequests();
  }, []);

  // 🔴 Fetch all user requests
  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/updates/my-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const requestList = data.requests || [];
      setRequests(requestList);
      if (requestList.length > 0) fetchRequestDetails(requestList[0].request_id || requestList[0].id);
    } catch (err) {
      console.error("Fetch requests error:", err);
      // alert("Failed to load requests");
    }
  };


  // 🔴 Fetch single request details
  const fetchRequestDetails = async (requestId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/updates/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setSelectedRequest(data);
    } catch {
      alert("Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Search by request ID
  const handleSearch = () => {
    if (!searchId.trim()) return;
    fetchRequestDetails(searchId.trim());
  };

  const timelineIcons = {
    Submitted: FileSearch,
    "Duplicate Check": Search,
    "AI Risk Assessment": Shield,
    "Officer Review": User,
    Completed: CheckCircle,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" userName={userName} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Track Update Status
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor the progress of your demographic update requests
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="flex gap-3 max-w-md">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search by Request ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Request List */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">All Requests</h2>
              </div>
              <div className="divide-y divide-border">
                {requests.map((request) => (
                  <button
                    key={request.request_id}
                    onClick={() => fetchRequestDetails(request.request_id)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-muted/50 transition-colors",
                      selectedRequest?.id === request.id &&
                      "bg-primary/5 border-l-2 border-primary"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {request.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {request.request_id}
                        </p>
                      </div>
                      <StatusBadge status={request.status} showIcon={false} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="lg:col-span-2">
            {selectedRequest && (
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-display font-semibold text-foreground">
                        {selectedRequest.type}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedRequest.id}
                      </p>
                    </div>
                    <StatusBadge status={selectedRequest.status} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        Submitted On
                      </p>
                      <p className="font-medium text-foreground">
                        {selectedRequest.submittedDate}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        Estimated Processing
                      </p>
                      <p className="font-medium text-foreground">
                        {selectedRequest.estimatedTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-6">
                    Progress Timeline
                  </h3>
                  <div className="space-y-1">
                    {selectedRequest.timeline.map((item, index) => {
                      const Icon =
                        timelineIcons[item.step as keyof typeof timelineIcons] ||
                        Clock;
                      const isLast =
                        index === selectedRequest.timeline.length - 1;

                      return (
                        <div key={item.step} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                item.status === "completed" &&
                                "bg-success text-success-foreground",
                                item.status === "current" &&
                                "bg-primary text-primary-foreground animate-pulse-soft",
                                item.status === "pending" &&
                                "bg-muted text-muted-foreground"
                              )}
                            >
                              <Icon size={18} />
                            </div>
                            {!isLast && (
                              <div
                                className={cn(
                                  "w-0.5 h-16",
                                  item.status === "completed"
                                    ? "bg-success"
                                    : "bg-muted"
                                )}
                              />
                            )}
                          </div>
                          <div className="pb-8">
                            <p
                              className={cn(
                                "font-medium",
                                item.status === "pending"
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                              )}
                            >
                              {item.step}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                            {item.date && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.date}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <p className="text-center text-muted-foreground mt-6">
                Loading request details...
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackStatus;
