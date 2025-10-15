import { useState } from "react";
import { uploadDocs } from "../api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, FileText, CheckCircle2 } from "lucide-react";

interface Props {
  username: string;
  password: string;
}

export default function UploadDocs({ username, password }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("doctor");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await uploadDocs(username, password, file, role);
      if (res.ok) {
        const data = await res.json();
        setSuccess(
          `Successfully uploaded: ${file.name}\nDocument ID: ${data.doc_id}\nAccessible to: ${data.accessible_to}`
        );
        setFile(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.detail || "Upload failed. Please try again.");
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
          <Upload className="h-6 w-6 text-red-500" />
          Upload Document
        </CardTitle>
        <CardDescription>
          Upload PDF documents for specific roles (Admin only)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-950/50 border-red-900">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-950/50 border-green-900 text-green-100">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="pdf-file">PDF Document</Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                id="pdf-file"
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  setError("");
                  setSuccess("");
                }}
                disabled={isLoading}
                className="w-full cursor-pointer rounded-md border border-red-900/20 bg-background/50 px-3 py-2 text-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-red-600 file:px-4 file:py-1 file:text-sm file:font-medium file:text-white hover:file:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {file && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 text-red-400" />
                <span className="max-w-[120px] truncate">{file.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role-select">Accessible To Role</Label>
          <Select value={role} onValueChange={setRole} disabled={isLoading}>
            <SelectTrigger
              id="role-select"
              className="bg-background/50 border-red-900/20 focus:border-red-500"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleUpload}
          disabled={isLoading || !file}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}