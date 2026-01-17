import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Info, CheckCircle, ArrowLeft, ArrowRight, MapPin, User, Heart, Calendar, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

type UpdateType = "address_change" | "name_change" | "marital_status" | "dob_change" | "phone_change" | "email_change" | "";

const SubmitUpdate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [updateType, setUpdateType] = useState<UpdateType>("");
  const [formData, setFormData] = useState({
    newAddress: "",
    city: "",
    state: "",
    pincode: "",
    newName: "",
    maritalStatus: "",
    newDob: "",
    reason: "",
  });
  const [files, setFiles] = useState<File[]>([]);

  const updateTypes = [
    { value: "address_change", label: "Address Change", icon: MapPin, description: "Update your residential address" },
    { value: "name_change", label: "Name Correction", icon: User, description: "Correct spelling or change name" },
    { value: "marital_status", label: "Marital Status", icon: Heart, description: "Update marital status" },
    { value: "dob_change", label: "Date of Birth", icon: Calendar, description: "Correct date of birth" },
    { value: "phone_change", label: "Mobile Number", icon: Phone, description: "Update your mobile number" },
    { value: "email_change", label: "Email Address", icon: Mail, description: "Update your email address" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!updateType) return;

    try {
      const payload: any = {
        update_type: updateType,
        new_data: ""
      };

      if (updateType === "address_change") {
        payload.new_data = `${formData.newAddress}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      } else if (updateType === "name_change") {
        payload.new_data = formData.newName;
      } else if (updateType === "marital_status") {
        payload.new_data = formData.maritalStatus;
      } else if (updateType === "dob_change") {
        payload.new_data = formData.newDob;
      } else {
        payload.new_data = formData.reason; // Fallback for phone/email if input missing
      }

      // Backend expects 'update_type' and 'new_data' as per my previous check of app.py
      const token = localStorage.getItem("token");
      const res = await fetch("/api/updates/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Submission failed");

      alert("Update request submitted successfully!");
      navigate("/track-status");
    } catch (err: any) {
      alert(err.message || "Failed to submit update");
    }
  };

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
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Submit Demographic Update
          </h1>
          <p className="text-muted-foreground mt-1">
            Request changes to your Aadhaar details
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {step > s ? <CheckCircle size={20} /> : s}
                </div>
                {s < 3 && (
                  <div className={cn(
                    "w-16 md:w-32 h-1 mx-2",
                    step > s ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>Select Type</span>
            <span className={step >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>Enter Details</span>
            <span className={step >= 3 ? "text-primary font-medium" : "text-muted-foreground"}>Upload Docs</span>
          </div>
        </div>

        {/* Step 1: Select Update Type */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4">Select Update Type</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {updateTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setUpdateType(type.value as UpdateType)}
                    className={cn(
                      "p-5 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg",
                      updateType === type.value
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                      updateType === type.value ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-semibold text-foreground">{type.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!updateType} size="lg">
                Continue
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Enter Details */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Enter {updateTypes.find(t => t.value === updateType)?.label} Details
            </h2>

            <div className="bg-card rounded-xl border border-border p-6 space-y-5">
              {updateType === "address_change" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newAddress">New Address</Label>
                    <Textarea
                      id="newAddress"
                      placeholder="Enter your complete new address"
                      value={formData.newAddress}
                      onChange={(e) => setFormData({ ...formData, newAddress: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, state: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      placeholder="6-digit PIN Code"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                      maxLength={6}
                    />
                  </div>
                </>
              )}

              {updateType === "name_change" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newName">New Name</Label>
                    <Input
                      id="newName"
                      placeholder="Enter your correct/new name"
                      value={formData.newName}
                      onChange={(e) => setFormData({ ...formData, newName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Change</Label>
                    <Textarea
                      id="reason"
                      placeholder="Explain why you need this change"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={3}
                    />
                  </div>
                </>
              )}

              {updateType === "marital_status" && (
                <div className="space-y-2">
                  <Label>New Marital Status</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {updateType === "dob_change" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newDob">Correct Date of Birth</Label>
                    <Input
                      id="newDob"
                      type="date"
                      value={formData.newDob}
                      onChange={(e) => setFormData({ ...formData, newDob: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Correction</Label>
                    <Textarea
                      id="reason"
                      placeholder="Explain why the date of birth needs correction"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft size={18} />
                Back
              </Button>
              <Button onClick={() => setStep(3)} size="lg">
                Continue
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Upload Documents */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4">Upload Supporting Documents</h2>

            {/* Info Banner */}
            <div className="mb-6 p-4 rounded-xl bg-info/10 border border-info/20">
              <div className="flex items-start gap-3">
                <Info className="text-info flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm text-foreground font-medium">Auto-Approval Eligible</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Low-risk updates with valid documents may be auto-approved instantly using our AI system.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="text-primary" size={28} />
                  </div>
                  <p className="font-medium text-foreground">Click to upload documents</p>
                  <p className="text-sm text-muted-foreground mt-1">PDF, JPG or PNG (max 5MB each)</p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-foreground">Uploaded Files:</p>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="text-primary" size={20} />
                        <span className="text-sm text-foreground">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-sm text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft size={18} />
                Back
              </Button>
              <Button onClick={handleSubmit} size="lg" variant="accent">
                Submit Request
                <CheckCircle size={18} />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubmitUpdate;
