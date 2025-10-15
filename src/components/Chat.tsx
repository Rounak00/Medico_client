import { useState } from "react";
import { chat } from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send, MessageSquare, FileText } from "lucide-react";

interface Props {
  username: string;
  password: string;
}

export default function Chat({ username, password }: Props) {
  const [msg, setMsg] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    if (!msg.trim()) {
      setError("Please enter a query");
      return;
    }

    setIsLoading(true);
    setError("");
    setAnswer(null);
    setSources([]);

    try {
      const res = await chat(username, password, msg);
      if (res.ok) {
        const data = await res.json();
        setAnswer(data.answer);
        setSources(data.sources ?? []);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.detail || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-red-900/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-red-500" />
          Ask a Healthcare Question
        </CardTitle>
        <CardDescription>
          Query the RAG system for healthcare information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-950/50 border-red-900">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Enter your healthcare query..."
            disabled={isLoading}
            className="bg-background/50 border-red-900/20 focus:border-red-500"
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !msg.trim()}
            className="bg-red-600 hover:bg-red-700 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>

        {answer && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <Card className="border-red-900/20 bg-red-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 leading-relaxed">{answer}</p>
              </CardContent>
            </Card>

            {sources.length > 0 && (
              <Card className="border-red-900/20 bg-background/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-400" />
                    Sources ({sources.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sources.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-red-400 font-semibold shrink-0">
                          {i + 1}.
                        </span>
                        <span className="break-all">{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}