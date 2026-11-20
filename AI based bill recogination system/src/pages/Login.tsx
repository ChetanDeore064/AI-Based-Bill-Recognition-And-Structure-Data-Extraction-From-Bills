import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Eye, EyeOff, ArrowRight, Scan, FileCheck, FileDown } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    if (login(email, password)) {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Use the demo account below.");
    }
    setLoading(false);
  };

  const fillDemo = () => {
    setEmail("demo@cabillmate.com");
    setPassword("demo123");
    setError("");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        {/* Animated background shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/3 rounded-full blur-2xl animate-float-slow" />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-2xl">
              <Receipt className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">CA BillMate</h1>
              <p className="text-sm text-blue-200">AI-Powered Invoice Recognition</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            Scan bills.<br />
            Extract data.<br />
            Verify. Export.
          </h2>

          <p className="text-lg text-blue-100 mb-10 max-w-md">
            The intelligent billing platform designed for Chartered Accountants. Process hundreds of invoices with AI-powered accuracy.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: Scan, text: "OCR-powered data extraction from any bill" },
              { icon: FileCheck, text: "AI confidence scoring & validation" },
              { icon: FileDown, text: "One-click export to Excel & CSV" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
              <Receipt className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CA BillMate</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-1 text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <Card className="border-dashed border-blue-300 bg-blue-50/50">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm text-blue-700">Demo Account</CardTitle>
              <CardDescription className="text-xs text-blue-600">
                Use these credentials to explore the app
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-1 text-sm">
                <p className="text-blue-800">
                  <span className="text-blue-500">Email:</span>{" "}
                  <code className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-xs">demo@cabillmate.com</code>
                </p>
                <p className="text-blue-800">
                  <span className="text-blue-500">Password:</span>{" "}
                  <code className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-xs">demo123</code>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fillDemo}
                className="mt-3 w-full border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Fill Demo Credentials
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            Forgot Password? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
}
