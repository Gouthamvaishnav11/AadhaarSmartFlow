import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, AlertTriangle, CheckCircle, Clock, Users, TrendingUp, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

const OfficerDashboard = () => {
  const [officerName, setOfficerName] = useState("Officer");
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  const API_BASE = "/api";

  useEffect(() => {
    const officerStr = localStorage.getItem("officer");
    if (officerStr) {
      try {
        const officerData = JSON.parse(officerStr);
        setOfficerName(officerData.name || "Officer");
      } catch (e) {
        console.error("Error parsing officer data", e);
      }
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    try {
      // Fetch Dashboard Stats
      const resStats = await fetch(`${API_BASE}/officer/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!resStats.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const dataStats = await resStats.json();
      setMetrics(dataStats);

      // Fetch Pending Requests
      const resPending = await fetch(`${API_BASE}/officer/pending-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataPending = await resPending.json();
      setPendingReviews(dataPending.requests || []);
    } catch (err) {
      console.error("Fetch dashboard data error:", err);
    }
  };

  const recentAutoApproved = [
    { id: "REQ-2024-007", type: "Address Change", time: "10 min ago" },
    { id: "REQ-2024-008", type: "Address Change", time: "25 min ago" },
    { id: "REQ-2024-009", type: "Address Change", time: "1 hour ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="officer" userName={officerName} />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Good Morning, <span className="text-primary">{officerName}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {metrics?.officer?.processing_center || "UIDAI Processing Center"} | Today's Overview
          </p>
        </div>

        {/* Workload Alert */}
        <div className="mb-8 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="text-warning" size={20} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{metrics?.stats?.high_risk_pending || "0"} high-priority requests pending review</p>
            <p className="text-sm text-muted-foreground">These require immediate attention</p>
          </div>
          <Link to="/officer/review">
            <Button variant="accent" size="sm">
              Review Now
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Pending"
            value={metrics?.stats?.pending || "0"}
            icon={FileText}
            variant="primary"
          />
          <StatCard
            title="High-Risk Pending"
            value={metrics?.stats?.high_risk_pending || "0"}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="Completed Today"
            value={metrics?.stats?.today_completed || "0"}
            icon={CheckCircle}
            variant="success"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Efficiency"
            value={`${metrics?.stats?.efficiency || "95"}%`}
            icon={Clock}
            variant="default"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/officer/review" className="block">
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4">
                    <Users size={24} />
                  </div>
                  <h3 className="text-lg font-semibold">Review Requests</h3>
                  <p className="text-primary-foreground/70 text-sm mt-1">{metrics?.stats?.pending || "0"} requests awaiting review</p>
                </div>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          <Link to="/officer/analytics" className="block">
            <div className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group h-full">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center mb-4">
                    <BarChart3 size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">View Analytics</h3>
                  <p className="text-muted-foreground text-sm mt-1">Performance metrics & trends</p>
                </div>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
              </div>
            </div>
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Reviews */}
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold text-foreground">Pending Reviews</h2>
              <Link to="/officer/review" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-border">
              {pendingReviews.map((request) => (
                <div key={request.request_id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{request.update_type}</p>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border",
                          request.risk_score > 0.7
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : request.risk_score > 0.4
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                        )}>
                          {request.risk_score > 0.7 ? "High" : request.risk_score > 0.4 ? "Medium" : "Low"} Risk
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.request_id} • {request.aadhaar_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{new Date(request.submitted_at).toLocaleDateString()}</p>
                      <Link to={`/officer/review/${request.request_id}`}>
                        <Button variant="ghost" size="sm" className="mt-1">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {pendingReviews.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No pending reviews available
                </div>
              )}
            </div>
          </div>

          {/* Auto-Approved */}
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold text-foreground">Recent Auto-Approvals</h2>
              <span className="text-xs text-muted-foreground">Read-only</span>
            </div>
            <div className="divide-y divide-border">
              {recentAutoApproved.map((request) => (
                <div key={request.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                        <CheckCircle className="text-success" size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{request.type}</p>
                        <p className="text-sm text-muted-foreground">{request.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status="approved" showIcon={false} />
                      <p className="text-xs text-muted-foreground mt-1">{request.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-muted/30 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp size={16} className="text-success" />
                <span>85% of low-risk updates auto-approved today</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficerDashboard;
