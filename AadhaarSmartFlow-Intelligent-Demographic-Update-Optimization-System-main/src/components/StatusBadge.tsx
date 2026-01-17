import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, AlertCircle, Search } from "lucide-react";

type StatusType = "approved" | "pending" | "rejected" | "review" | "submitted" | "auto_approved" | "processing";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
}

const statusConfig = {
  approved: {
    label: "Approved",
    className: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
    icon: Clock,
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
  review: {
    label: "Under Review",
    className: "bg-info/10 text-info border-info/20",
    icon: Search,
  },
  submitted: {
    label: "Submitted",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: AlertCircle,
  },
  auto_approved: {
    label: "Auto-Approved",
    className: "bg-success/20 text-success border-success/30 font-bold",
    icon: CheckCircle,
  },
  processing: {
    label: "Processing",
    className: "bg-info/20 text-info border-info/30",
    icon: Clock,
  },
};

const StatusBadge = ({ status, className, showIcon = true }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {showIcon && <Icon size={12} />}
      {config.label}
    </span>
  );
};

export default StatusBadge;
