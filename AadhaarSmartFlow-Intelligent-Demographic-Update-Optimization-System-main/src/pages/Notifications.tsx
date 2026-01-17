import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Info, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
  requestId?: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "success",
      title: "Update Auto-Approved",
      message: "Your address update request (REQ-2024-001) has been automatically approved. Changes will reflect within 24 hours.",
      time: "2 hours ago",
      read: false,
      requestId: "REQ-2024-001",
    },
    {
      id: 2,
      type: "info",
      title: "Under Officer Review",
      message: "Your name correction request (REQ-2024-002) has been flagged for manual review due to medium risk assessment.",
      time: "1 day ago",
      read: false,
      requestId: "REQ-2024-002",
    },
    {
      id: 3,
      type: "warning",
      title: "Additional Documents Required",
      message: "Please upload a valid address proof document for your DOB correction request (REQ-2024-003).",
      time: "2 days ago",
      read: true,
      requestId: "REQ-2024-003",
    },
    {
      id: 4,
      type: "success",
      title: "Duplicate Request Prevented",
      message: "We detected and prevented a duplicate submission for address update. No action needed.",
      time: "3 days ago",
      read: true,
    },
    {
      id: 5,
      type: "error",
      title: "Request Rejected",
      message: "Your previous DOB correction request was rejected due to insufficient supporting documents.",
      time: "1 week ago",
      read: true,
      requestId: "REQ-2023-089",
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const typeConfig = {
    success: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
    warning: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10" },
    error: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
    info: { icon: Info, color: "text-info", bg: "bg-info/10" },
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" userName="Rahul Sharma" />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Notifications
              </h1>
              <p className="text-muted-foreground mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead}>
                <Check size={16} />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;

            return (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "p-5 rounded-xl border transition-all duration-200 cursor-pointer",
                  notification.read
                    ? "bg-card border-border hover:bg-muted/50"
                    : "bg-card border-primary/20 shadow-md hover:shadow-lg"
                )}
              >
                <div className="flex gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", config.bg)}>
                    <Icon className={config.color} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className={cn(
                          "font-semibold",
                          notification.read ? "text-foreground" : "text-foreground"
                        )}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    {notification.requestId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/track-status");
                        }}
                        className="text-sm text-primary hover:underline mt-2"
                      >
                        View Request →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bell className="text-muted-foreground" size={28} />
            </div>
            <h3 className="font-semibold text-foreground">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You're all caught up! We'll notify you about important updates.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
