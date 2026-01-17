import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Download, CheckCircle, XCircle, MessageSquare, Shield, AlertTriangle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

interface Request {
  id: string;
  type: string;
  risk: "High" | "Medium" | "Low";
  riskScore: number;
  aadhaar: string;
  name: string;
  submittedDate: string;
  details: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  documents: string[];
  aiAnalysis: string;
}

const OfficerReview = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [officerName, setOfficerName] = useState("Officer");
  const API_BASE = "/api";
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
    fetchPendingRequests();
    if (requestId) {
      fetchRequestDetails(requestId);
    } else {
      setLoading(false);
    }
  }, [requestId]);

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/officer/pending-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPendingRequests(data.requests || []);
    } catch (err) {
      console.error("Fetch pending requests error", err);
    }
  };

  const fetchRequestDetails = async (reqId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/updates/${reqId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      // Transform backend data to frontend Request format
      const transformed: Request = {
        id: data.request_id,
        type: data.update_type || data.type,
        risk: data.risk_score > 0.7 ? "High" : data.risk_score > 0.4 ? "Medium" : "Low",
        riskScore: Math.round(data.risk_score * 100),
        aadhaar: data.aadhaar_id,
        name: data.applicant_name || "Applicant", // We might need to add name to the response
        submittedDate: new Date(data.submitted_at).toLocaleDateString(),
        details: data.details || [],
        documents: data.documents ? (typeof data.documents === 'string' ? JSON.parse(data.documents) : data.documents) : [],
        aiAnalysis: data.ai_analysis || "AI Analysis pending or unavailable."
      };
      setSelectedRequest(transformed);
    } catch (err) {
      console.error("Fetch request details error", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (action: string, reason: string = "") => {
    try {
      const res = await fetch(`${API_BASE}/officer/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          request_id: requestId,
          action: action,
          reason: reason || comment
        })
      });

      if (res.ok) {
        navigate("/officer/dashboard");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Update status error", err);
    }
  };

  const handleApprove = () => {
    updateStatus("approve");
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    updateStatus("rejected", rejectionReason);
  };

  const riskColors: Record<string, string> = {
    High: "bg-destructive/10 text-destructive border-destructive/20",
    Medium: "bg-warning/10 text-warning border-warning/20",
    Low: "bg-success/10 text-success border-success/20",
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
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Review Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Verify and process demographic update requests
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Request Queue */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden sticky top-24">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Pending Queue</h2>
                <p className="text-xs text-muted-foreground">{pendingRequests.length} requests</p>
              </div>
              <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                {pendingRequests.map((request) => (
                  <button
                    key={request.request_id}
                    onClick={() => navigate(`/officer/review/${request.request_id}`)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-muted/50 transition-colors",
                      requestId === request.request_id && "bg-primary/5 border-l-2 border-primary"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground text-sm">{request.update_type}</p>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full border",
                        request.risk_score > 0.7
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : request.risk_score > 0.4
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-success/10 text-success border-success/20"
                      )}>
                        {request.risk_score > 0.7 ? "High" : request.risk_score > 0.4 ? "Medium" : "Low"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{request.request_id}</p>
                    <p className="text-xs text-muted-foreground">{request.aadhaar_id}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-card rounded-xl border border-border shadow-card p-12 text-center text-muted-foreground animate-pulse">
                Loading request details...
              </div>
            ) : !selectedRequest ? (
              <div className="bg-card rounded-xl border border-border shadow-card p-12 text-center text-muted-foreground">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Select a request from the queue to review</p>
                <p className="text-sm mt-1">Pending verification required for {pendingRequests.length} updates</p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Request Header */}
                <div className="bg-card rounded-xl border border-border shadow-card p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-display font-semibold text-foreground">
                        {selectedRequest.type}
                      </h2>
                      <p className="text-sm text-muted-foreground">{selectedRequest.id}</p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full border text-sm font-medium",
                      riskColors[selectedRequest.risk]
                    )}>
                      {selectedRequest.risk} Risk
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Aadhaar Number</p>
                      <p className="font-medium text-foreground">{selectedRequest.aadhaar}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Applicant Name</p>
                      <p className="font-medium text-foreground">{selectedRequest.name}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Submitted On</p>
                      <p className="font-medium text-foreground">{selectedRequest.submittedDate}</p>
                    </div>
                  </div>
                </div>

                {/* AI Risk Analysis */}
                <div className="bg-card rounded-xl border border-border shadow-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">AI Risk Assessment</h3>
                      <p className="text-xs text-muted-foreground">Automated analysis results</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Risk Score</span>
                      <span className="text-sm font-medium">{selectedRequest.riskScore}/100</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          selectedRequest.riskScore > 70 ? "bg-destructive" :
                            selectedRequest.riskScore > 40 ? "bg-warning" : "bg-success"
                        )}
                        style={{ width: `${selectedRequest.riskScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-foreground">{selectedRequest.aiAnalysis}</p>
                  </div>
                </div>

                {/* Change Details */}
                <div className="bg-card rounded-xl border border-border shadow-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">Requested Changes</h3>
                  <div className="space-y-3">
                    {selectedRequest.details.map((detail, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-2">{detail.field}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Old Value</p>
                            <p className="font-medium text-foreground line-through opacity-60">{detail.oldValue}</p>
                          </div>
                          <ArrowLeft className="text-primary rotate-180" size={20} />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">New Value</p>
                            <p className="font-medium text-foreground">{detail.newValue}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-card rounded-xl border border-border shadow-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">Submitted Documents</h3>
                  <div className="space-y-3">
                    {selectedRequest.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="text-primary" size={20} />
                          <span className="text-sm text-foreground">{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download size={16} />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-card rounded-xl border border-border shadow-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">Officer Actions</h3>

                  <div className="mb-4">
                    <label className="text-sm text-muted-foreground mb-2 block">Add Comment (optional)</label>
                    <Textarea
                      placeholder="Enter any notes or comments..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleApprove} className="flex-1" variant="success">
                      <CheckCircle size={18} />
                      Approve Request
                    </Button>
                    <Button onClick={handleReject} className="flex-1" variant="destructive">
                      <XCircle size={18} />
                      Reject Request
                    </Button>
                    <Button variant="outline">
                      <MessageSquare size={18} />
                      Request Info
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="text-destructive" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Confirm Rejection</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Please provide a reason for rejecting this request. This will be communicated to the applicant.
            </p>
            <Textarea
              placeholder="Enter rejection reason..."
              rows={3}
              className="mb-4"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowRejectModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmReject} className="flex-1">
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerReview;
