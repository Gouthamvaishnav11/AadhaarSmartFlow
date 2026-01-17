import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Shield,
    User,
    Lock,
    Mail,
    ArrowRight,
    Briefcase,
    Building2,
    Target
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

const API_BASE = "/api";

const RegisterOfficer = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        department: "Verification Department",
        designation: "Officer",
        processing_center: "Central Processing Center"
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/auth/register-officer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Officer registration failed");

            alert(`Officer registration successful! Your Officer ID is ${data.officer_id}. Please login.`);
            navigate("/login");
        } catch (err: any) {
            alert(err.message || "Officer registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="relative container mx-auto px-4 py-8">
                <div className="flex justify-center mb-6">
                    <Logo size="lg" />
                </div>

                <div className="max-w-md mx-auto">
                    <div className="bg-card rounded-2xl shadow-xl border border-border p-6 md:p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-display font-semibold text-foreground">
                                Officer Registration
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Create a UIDAI administration account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        id="name"
                                        placeholder="Officer Full Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="pl-10 h-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Officer Email (uidai.gov.in)</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="officer@uidai.gov.in"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="pl-10 h-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                        <select
                                            id="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option>Verification Dept</option>
                                            <option>Biometric Division</option>
                                            <option>Regional Center</option>
                                            <option>Data Quality</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="designation">Designation</Label>
                                    <div className="relative">
                                        <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                        <select
                                            id="designation"
                                            value={formData.designation}
                                            onChange={handleInputChange}
                                            className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option>Officer</option>
                                            <option>Senior Officer</option>
                                            <option>District Head</option>
                                            <option>Center In-charge</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Security Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="At least 8 characters"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="pl-10 h-10"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 flex gap-3 text-xs text-primary mb-2">
                                <Shield size={16} className="shrink-0" />
                                <p>
                                    Your account will require internal verification by the UIDAI Security Board before full access is granted.
                                </p>
                            </div>

                            <Button type="submit" className="w-full h-11" variant="hero">
                                Register as Officer
                                <ArrowRight size={18} />
                            </Button>

                            <div className="text-center pt-2">
                                <p className="text-sm text-muted-foreground">
                                    Back to Login?{" "}
                                    <Link to="/login" className="text-primary font-medium hover:underline">
                                        Click here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterOfficer;
