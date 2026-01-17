import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Users, Clock, CheckCircle, BarChart3, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPie, Pie, Cell } from "recharts";

const OfficerAnalytics = () => {
  const navigate = useNavigate();
  const [officerName, setOfficerName] = useState("Officer");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const officerStr = localStorage.getItem("officer");
    if (officerStr) {
      try {
        const officerData = JSON.parse(officerStr);
        setOfficerName(officerData.name || "Officer");
      } catch (e) { }
    }
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error("Fetch analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  const dailyStats = stats?.daily_stats || [
    { day: "Mon", autoApproved: 45, manualReview: 12, rejected: 3 },
    { day: "Tue", autoApproved: 52, manualReview: 15, rejected: 5 },
    { day: "Wed", autoApproved: 38, manualReview: 18, rejected: 2 },
    { day: "Thu", autoApproved: 61, manualReview: 10, rejected: 4 },
    { day: "Fri", autoApproved: 55, manualReview: 14, rejected: 3 },
    { day: "Sat", autoApproved: 30, manualReview: 8, rejected: 1 },
    { day: "Sun", autoApproved: 22, manualReview: 5, rejected: 2 },
  ];

  const updateTypes = stats?.distributions?.update_types?.map((t: any, i: number) => ({
    name: t.type.replace('_', ' '),
    value: t.count,
    color: [`hsl(222, 65%, 25%)`, `hsl(28, 90%, 55%)`, `hsl(142, 70%, 45%)`, `hsl(200, 90%, 50%)`][i % 4]
  })) || [
      { name: "Address", value: 45, color: "hsl(222, 65%, 25%)" },
      { name: "Name", value: 30, color: "hsl(28, 90%, 55%)" },
      { name: "DOB", value: 15, color: "hsl(142, 70%, 45%)" },
      { name: "Marital", value: 10, color: "hsl(200, 90%, 50%)" },
    ];

  const processingTrend = [
    { hour: "9AM", time: 15 },
    { hour: "10AM", time: 12 },
    { hour: "11AM", time: 18 },
    { hour: "12PM", time: 22 },
    { hour: "1PM", time: 14 },
    { hour: "2PM", time: 11 },
    { hour: "3PM", time: 9 },
    { hour: "4PM", time: 13 },
    { hour: "5PM", time: 16 },
  ];

  const centerWorkload = [
    { center: "Mumbai", requests: 245, efficiency: 92 },
    { center: "Delhi", requests: 198, efficiency: 88 },
    { center: "Bangalore", requests: 176, efficiency: 95 },
    { center: "Chennai", requests: 152, efficiency: 90 },
    { center: "Kolkata", requests: 134, efficiency: 85 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="officer" userName={officerName} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button variant="ghost" className="mb-2" onClick={() => navigate("/officer/dashboard")}>
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time performance metrics and trends
            </p>
          </div>
          <Select defaultValue="7d">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Requests"
            value={stats?.real_time_stats?.total_requests || "0"}
            icon={CheckCircle}
            variant="primary"
          />
          <StatCard
            title="Auto-Approved"
            value={stats?.real_time_stats?.auto_approved || "0"}
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            title="Pending Review"
            value={stats?.real_time_stats?.pending || "0"}
            icon={Clock}
            variant="accent"
          />
          <StatCard
            title="ML Model Accuracy"
            value={`${stats?.metrics?.find((m: any) => m.model_type === 'duplicate_detector')?.accuracy * 100 || 98.4}%`}
            icon={BarChart3}
            variant="default"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Request Volume Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-foreground">Request Volume</h3>
                <p className="text-sm text-muted-foreground">Daily breakdown by status</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-success" />
                  <span className="text-muted-foreground">Auto-Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-warning" />
                  <span className="text-muted-foreground">Manual Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-destructive" />
                  <span className="text-muted-foreground">Rejected</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="autoApproved" fill="hsl(142, 70%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="manualReview" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Update Types Pie Chart */}
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <div className="mb-6">
              <h3 className="font-display font-semibold text-foreground">Update Types</h3>
              <p className="text-sm text-muted-foreground">Distribution by category</p>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={updateTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {updateTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {updateTypes.map((type) => (
                <div key={type.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: type.color }} />
                  <span className="text-muted-foreground">{type.name}</span>
                  <span className="font-medium text-foreground ml-auto">{type.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Processing Time Trend */}
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <div className="mb-6">
              <h3 className="font-display font-semibold text-foreground">Processing Time Trend</h3>
              <p className="text-sm text-muted-foreground">Average time in minutes (today)</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processingTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="time"
                    stroke="hsl(222, 65%, 25%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(222, 65%, 25%)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Center Workload Table */}
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <div className="mb-6">
              <h3 className="font-display font-semibold text-foreground">Center-wise Performance</h3>
              <p className="text-sm text-muted-foreground">Workload distribution and efficiency</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Center</th>
                    <th className="text-right py-3 text-sm font-medium text-muted-foreground">Requests</th>
                    <th className="text-right py-3 text-sm font-medium text-muted-foreground">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {centerWorkload.map((center) => (
                    <tr key={center.center} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-muted-foreground" />
                          <span className="font-medium text-foreground">{center.center}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 text-foreground">{center.requests}</td>
                      <td className="text-right py-3">
                        <span className={`font-medium ${center.efficiency >= 90 ? "text-success" : center.efficiency >= 85 ? "text-warning" : "text-destructive"}`}>
                          {center.efficiency}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficerAnalytics;
