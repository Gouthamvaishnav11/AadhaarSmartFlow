import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Shield,
    User,
    Lock,
    Mail,
    Fingerprint,
    ArrowRight,
    Phone,
    MapPin,
    Calendar
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

const API_BASE = "/api";

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        aadhaar_id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        gender: "Male",
        date_of_birth: ""
    });

    const formatAadhaar = (value: string) =>
        value.replace(/\D/g, "").slice(0, 12).replace(/(.{4})/g, "$1 ").trim();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "aadhaar_id") {
            setFormData({ ...formData, [id]: formatAadhaar(value) });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    aadhaar_id: formData.aadhaar_id.replace(/\s/g, "")
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");

            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (err: any) {
            alert(err.message || "Registration failed");
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
                                Create Account
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Register for Aadhaar Smart Flow
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="aadhaar_id">Aadhaar Number</Label>
                                <div className="relative">
                                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        id="aadhaar_id"
                                        placeholder="XXXX XXXX XXXX"
                                        value={formData.aadhaar_id}
                                        onChange={handleInputChange}
                                        className="pl-10 h-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        id="name"
                                        placeholder="Your official name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="pl-10 h-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        placeholder="10-digit mobile"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    value={formData.date_of_birth}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="At least 6 characters"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="pl-10 h-10"
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11" variant="hero">
                                Register
                                <ArrowRight size={18} />
                            </Button>

                            <div className="text-center pt-2">
                                <p className="text-sm text-muted-foreground">
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-primary font-medium hover:underline">
                                        Login here
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

export default Register;
