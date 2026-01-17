import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import SubmitUpdate from "./pages/SubmitUpdate";
import TrackStatus from "./pages/TrackStatus";
import Notifications from "./pages/Notifications";
import OfficerDashboard from "./pages/OfficerDashboard";
import OfficerReview from "./pages/OfficerReview";
import OfficerAnalytics from "./pages/OfficerAnalytics";
import OfficerAudit from "./pages/OfficerAudit";
import Register from "./pages/Register";
import RegisterOfficer from "./pages/RegisterOfficer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-officer" element={<RegisterOfficer />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/submit-update" element={<SubmitUpdate />} />
          <Route path="/track-status" element={<TrackStatus />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
          <Route path="/officer/review" element={<OfficerReview />} />
          <Route path="/officer/review/:requestId" element={<OfficerReview />} />
          <Route path="/officer/analytics" element={<OfficerAnalytics />} />
          <Route path="/officer/audit" element={<OfficerAudit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
