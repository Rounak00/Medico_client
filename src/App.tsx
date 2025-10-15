import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import UploadDocs from "./components/UploadDocs";
import Chat from "./components/Chat";
import type { UserSession } from "./types";
import { capitalizeFirstLetter } from "./utils/capitalFirst";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Shield } from "lucide-react";

const initialSession: UserSession = {
  username: "",
  password: "",
  role: "",
  loggedIn: false,
};

export default function App() {
  const [session, setSession] = useState<UserSession>(() => {
    const raw = sessionStorage.getItem("rag_session");
    return raw ? (JSON.parse(raw) as UserSession) : initialSession;
  });

  useEffect(() => {
    sessionStorage.setItem("rag_session", JSON.stringify(session));
  }, [session]);

  function setLoggedIn(username: string, password: string, role: string) {
    setSession({ username, password, role, loggedIn: true });
  }

  function logout() {
    setSession(initialSession);
    sessionStorage.removeItem("rag_session");
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-5xl mx-auto">
        {!session.loggedIn ? (
          <Auth onLogin={setLoggedIn} />
        ) : (
          <div className="space-y-6">
            <Card className="border-red-900/20 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <User className="h-6 w-6 text-red-500" />
                      Welcome, {session.username}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <Shield className="h-4 w-4 text-red-400" />
                      Role: <span className="font-semibold text-red-400">{capitalizeFirstLetter(session.role)}</span>
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={logout} 
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {session.role === "admin" && (
              <UploadDocs
                username={session.username}
                password={session.password}
              />
            )}

            <Chat username={session.username} password={session.password} />
          </div>
        )}
      </div>
    </div>
  );
}