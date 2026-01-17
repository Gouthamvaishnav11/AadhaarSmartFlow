import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Search, Bell, Plus, CheckCircle, Clock, XCircle, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";

const UserDashboard = () => {
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({
    stats: { total: 0, approved: 0, review: 0, rejected: 0 },
    recent_requests: [],
    notifications: []
  });

  const API_BASE = "http://localhost:5000/api";
  const token = localStorage.getItem("token");

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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Fetch user dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" userName={userName} />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Welcome back, <span className="text-primary">{userName.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your Aadhaar demographic updates seamlessly
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link to="/submit-update" className="block">
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Plus size={80} />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4">
                    <Plus size={24} />
                  </div>
                  <h3 className="text-lg font-semibold">Submit New Update</h3>
                  <p className="text-primary-foreground/70 text-sm mt-1">Request a demographic change</p>
                </div>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          <Link to="/track-status" className="block">
            <div className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center mb-4">
                    <Search size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Track Status</h3>
                  <p className="text-muted-foreground text-sm mt-1">Check your request progress</p>
                </div>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
              </div>
            </div>
          </Link>

          <Link to="/notifications" className="block">
            <div className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative">
              {dashboardData.notifications.length > 0 && <span className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full animate-pulse" />}
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                    <Bell size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                  <p className="text-muted-foreground text-sm mt-1">{dashboardData.notifications.length} notifications</p>
                </div>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Requests"
            value={dashboardData.stats.total.toString()}
            icon={FileText}
            variant="default"
          />
          <StatCard
            title="Approved"
            value={dashboardData.stats.approved.toString()}
            icon={CheckCircle}
            variant="success"
            trend={{ value: dashboardData.stats.approved > 0 ? 12 : 0, isPositive: true }}
          />
          <StatCard
            title="Under Review"
            value={dashboardData.stats.review.toString()}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Rejected"
            value={dashboardData.stats.rejected.toString()}
            icon={XCircle}
            variant="default"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Requests */}
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold text-foreground">Recent Requests</h2>
              <Link to="/track-status" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-border min-h-[200px]">
              {dashboardData.recent_requests.map((request: any) => (
                <div key={request.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{request.type}</p>
                      <p className="text-sm text-muted-foreground">{request.id}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={request.status} />
                      <p className="text-xs text-muted-foreground mt-1">{request.date}</p>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && dashboardData.recent_requests.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No recent update requests.
                </div>
              )}
              {loading && <div className="p-8 text-center text-muted-foreground">Loading...</div>}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold text-foreground">Recent Notifications</h2>
              <Link to="/notifications" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-border min-h-[200px]">
              {dashboardData.notifications.map((notification: any) => (
                <div key={notification.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === "success" ? "bg-success" : "bg-info"}`} />
                    <div>
                      <p className="text-sm text-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && dashboardData.notifications.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No new notifications.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <FileText className="text-accent" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Faster Processing with Auto-Approval</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Low-risk updates like minor address corrections are now auto-approved using AI,
                reducing wait times from days to minutes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
