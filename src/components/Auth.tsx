import { useState } from "react";
import { login, signup } from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShieldCheck, UserPlus, LogIn } from "lucide-react";

interface Props {
  onLogin: (username: string, password: string, role: string) => void;
}

export default function Auth({ onLogin }: Props) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupRole, setSignupRole] = useState("doctor");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!loginUser || !loginPass) {
      setError("Please enter your credentials");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await login(loginUser, loginPass);
      if (res.ok) {
        const data = await res.json();
        onLogin(loginUser, loginPass, data.role || "");
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.detail || "Login failed");
      }
    } catch (_) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignup() {
    if (!signupUser || !signupPass) {
      setError("Please enter signup credentials");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await signup(signupUser, signupPass, signupRole);
      if (res.ok) {
        setError("");
        setTab("login");
        setLoginUser(signupUser);
        alert("Signup successful! Please login.");
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.detail || "Signup failed");
      }
    } catch (_) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md border-red-900/20 bg-card/50 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <ShieldCheck className="h-8 w-8 text-red-500" />
            Medico
          </CardTitle>
          <CardDescription className="text-center">
            Role-based AI health assisstant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-red-950/20">
              <TabsTrigger value="login" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                Signup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              {error && (
                <Alert variant="destructive" className="bg-red-950/50 border-red-900">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="login-username">Username</Label>
                <Input
                  id="login-username"
                  placeholder="Enter username"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  disabled={isLoading}
                  className="bg-background/50 border-red-900/20 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  disabled={isLoading}
                  className="bg-background/50 border-red-900/20 focus:border-red-500"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-4">
              {error && (
                <Alert variant="destructive" className="bg-red-950/50 border-red-900">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  placeholder="Choose username"
                  value={signupUser}
                  onChange={(e) => setSignupUser(e.target.value)}
                  disabled={isLoading}
                  className="bg-background/50 border-red-900/20 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Choose password"
                  value={signupPass}
                  onChange={(e) => setSignupPass(e.target.value)}
                  disabled={isLoading}
                  className="bg-background/50 border-red-900/20 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-role">Role</Label>
                <Select value={signupRole} onValueChange={setSignupRole} disabled={isLoading}>
                  <SelectTrigger className="bg-background/50 border-red-900/20 focus:border-red-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    {/* <SelectItem value="nurse">Nurse</SelectItem> */}
                    <SelectItem value="patient">Patient</SelectItem>
                    {/* <SelectItem value="other">Other</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}