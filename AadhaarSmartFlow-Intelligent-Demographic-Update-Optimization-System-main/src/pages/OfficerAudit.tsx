import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Download, Filter, Calendar, User, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  timestamp: string;
  officer: string;
  action: "approved" | "rejected" | "reviewed" | "info_requested";
  requestId: string;
  updateType: string;
  aadhaar: string;
  comment?: string;
}

const OfficerAudit = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [officerName, setOfficerName] = useState("Officer");

  const API_BASE = "http://localhost:5000/api";
  const token = localStorage.getItem("token");

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
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async (filterAction = "all") => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/officer/audit-logs?action=${filterAction}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch (err) {
      console.error("Fetch audit logs error:", err);
    } finally {
      setLoading(false);
    }
  };

  const actionConfig = {
    approved: { label: "Approved", icon: CheckCircle, color: "text-success bg-success/10" },
    rejected: { label: "Rejected", icon: XCircle, color: "text-destructive bg-destructive/10" },
    reviewed: { label: "Reviewed", icon: FileText, color: "text-info bg-info/10" },
    info_requested: { label: "Info Requested", icon: Clock, color: "text-warning bg-warning/10" },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="officer" userName={officerName} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() => navigate("/officer/dashboard")}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Audit Logs
              </h1>
              <p className="text-muted-foreground mt-1">
                Complete action history for compliance tracking
              </p>
            </div>
            <Button variant="accent">
              <Download size={16} />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border shadow-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by Request ID, Officer, or Aadhaar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select onValueChange={(value) => fetchAuditLogs(value)} defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Officer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Officers</SelectItem>
                  <SelectItem value="singh">Officer Singh</SelectItem>
                  <SelectItem value="patel">Officer Patel</SelectItem>
                  <SelectItem value="kumar">Officer Kumar</SelectItem>
                  <SelectItem value="sharma">Officer Sharma</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Calendar size={16} />
                Date Range
              </Button>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Timestamp</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Officer</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Action</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Request ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Update Type</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Aadhaar</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Comment</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs
                  .filter(log =>
                    log.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    log.officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    log.comment?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((log) => {
                    const config = actionConfig[log.action as keyof typeof actionConfig] || actionConfig.reviewed;
                    const Icon = config.icon;

                    return (
                      <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <p className="font-medium text-foreground">{log.timestamp.split(" ")[0]}</p>
                            <p className="text-muted-foreground">{log.timestamp.split(" ")[1]}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User size={14} className="text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{log.officer}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                            config.color
                          )}>
                            <Icon size={12} />
                            {config.label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-primary">{log.requestId}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-foreground">{log.updateType}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-muted-foreground">{log.aadhaar}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-muted-foreground max-w-xs truncate block">
                            {log.comment || "-"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                {loading && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      Loading audit logs...
                    </td>
                  </tr>
                )}
                {!loading && auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      No audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {auditLogs.length} entries
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Compliance Notice:</strong> All audit logs are retained for 7 years in accordance with UIDAI data retention policies.
            Logs are immutable and cryptographically signed for integrity verification.
          </p>
        </div>
      </main>
    </div>
  );
};

export default OfficerAudit;
