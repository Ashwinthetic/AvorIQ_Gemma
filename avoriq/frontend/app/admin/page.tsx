"use client";

import { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  HelpCircle, 
  Database,
  ArrowRight,
  RefreshCw,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../../components/ui/Badge";

// Expected columns for validation and display
const expectedColumns = [
  { name: "id", required: true, desc: "Unique identifier (e.g. 'sch-001')" },
  { name: "name", required: true, desc: "Title of the scholarship" },
  { name: "provider", required: true, desc: "Provider organisation" },
  { name: "amount", required: true, desc: "Numeric value (e.g., 25000)" },
  { name: "description", required: true, desc: "Detailed eligibility & requirements text" },
  { name: "amountFormatted", required: false, desc: "Display amount (e.g. '₹25,000')" },
  { name: "deadline", required: false, desc: "Date format YYYY-MM-DD (e.g. '2026-12-31')" },
  { name: "category", required: false, desc: "e.g. 'SC/ST', 'Girls Education', 'Merit'" },
  { name: "gender", required: false, desc: "e.g. 'Male', 'Female', 'All'" },
  { name: "familyIncomeMax", required: false, desc: "Max household income limit (e.g., 500000)" },
  { name: "educationLevel", required: false, desc: "Semicolon separated list (e.g., 'UG;PG')" },
  { name: "states", required: false, desc: "Semicolon separated list (e.g., 'Bihar;Delhi')" },
  { name: "castes", required: false, desc: "Semicolon separated list (e.g., 'SC;ST')" },
  { name: "fieldsOfStudy", required: false, desc: "Semicolon separated list (e.g., 'Engineering;Medical')" },
  { name: "documents", required: false, desc: "Semicolon separated list (e.g., 'Marksheet;Aadhaar')" }
];

interface UploadResult {
  message: string;
  added: number;
  skipped: number;
  failed: number;
  errors: string[];
}

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminId, setAdminId] = useState(process.env.NEXT_PUBLIC_ADMIN_ID || "");
  const [adminPassword, setAdminPassword] = useState(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
        setError(null);
        setResult(null);
      } else {
        setError("Only CSV files are supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError("Only CSV files are supported.");
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) return;

    if (!adminId || !adminPassword) {
      setError("Admin ID and Admin Password are required.");
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const headers: Record<string, string> = {};
      if (adminId) headers["X-Admin-Id"] = adminId;
      if (adminPassword) headers["X-Admin-Password"] = adminPassword;

      const response = await fetch(`${apiBase}/api/admin/upload-csv`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `Upload failed with status ${response.status}`);
      }

      const data: UploadResult = await response.json();
      setResult(data);
      setFile(null); // Clear selected file on success
    } catch (err: any) {
      logger.error("Upload error details:", err);
      setError(err.message || "Something went wrong while uploading the file.");
    } finally {
      setUploading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="mb-12">
          <Badge variant="red" className="mb-6">
            <Database className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </Badge>
          <h1 className="text-foreground font-black text-5xl sm:text-6xl uppercase leading-[0.9] tracking-tight">
            DATASET
          </h1>
          <h1 className="text-bauhaus-red font-black text-5xl sm:text-6xl uppercase leading-[0.9] tracking-tight mt-2">
            UPLOADER
          </h1>
          
          <div className="w-full h-[3px] bg-foreground my-8" />
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            Upload custom scholarship databases in CSV format. The system will automatically parse the data, connect to the local Ollama service to generate 1024-dimension vectors (`bge-m3`), and store them in the `pgvector` container database.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Upload Tool */}
          <div className="lg:col-span-7 space-y-6">
            {/* Credentials Section */}
            <div className="border-3 border-foreground p-6 bg-surface brutal-shadow">
              <h3 className="font-black text-sm uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-bauhaus-red" />
                Admin Authentication
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">
                    Admin ID
                  </label>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full bg-[#111] border-2 border-[#333] focus:border-foreground text-foreground px-4 py-2.5 text-xs font-mono focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-[#111] border-2 border-[#333] focus:border-foreground text-foreground px-4 py-2.5 text-xs font-mono focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-3 border-dashed p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${
                dragActive 
                  ? "border-bauhaus-red bg-bauhaus-red/5" 
                  : file 
                    ? "border-foreground bg-foreground/5" 
                    : "border-[#333] hover:border-foreground"
              }`}
              onClick={onButtonClick}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".csv"
                onChange={handleFileChange}
                disabled={uploading}
              />
              
              {file ? (
                <div className="text-center">
                  <FileText className="w-16 h-16 text-bauhaus-yellow mx-auto mb-4" />
                  <p className="font-black text-sm uppercase text-foreground truncate max-w-md">
                    {file.name}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-16 h-16 text-slate-500 mx-auto mb-4 group-hover:text-foreground transition-all" />
                  <p className="font-black text-sm uppercase text-foreground">
                    Drag & Drop CSV File
                  </p>
                  <p className="text-slate-500 text-xs mt-2 uppercase tracking-wider font-bold">
                    Or click to browse files
                  </p>
                </div>
              )}
            </div>

            {/* Error notifications */}
            {error && (
              <div className="border-2 border-bauhaus-red bg-bauhaus-red/10 p-4 text-xs font-bold uppercase tracking-wider text-bauhaus-red flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4">
              {file && !uploading && (
                <>
                  <button 
                    onClick={handleUpload}
                    className="px-6 py-3 bg-bauhaus-red text-white font-black text-xs uppercase tracking-widest border-2 border-bauhaus-red brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#D92A2A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-2"
                  >
                    Start Importing
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={resetState}
                    className="px-6 py-3 border-2 border-[#333] text-slate-400 font-black text-xs uppercase tracking-widest hover:border-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}

              {uploading && (
                <div className="px-6 py-3 border-2 border-foreground bg-foreground/10 text-foreground font-black text-xs uppercase tracking-widest flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-bauhaus-yellow" />
                  <span>Processing database & generating vectors...</span>
                </div>
              )}
            </div>

            {/* Results Dashboard */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-6"
                >
                  <div className="border-3 border-foreground p-6 bg-surface brutal-shadow-lg">
                    <h3 className="font-black text-base uppercase tracking-wider text-foreground mb-6 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      Import complete
                    </h3>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-0 border-2 border-[#333]">
                      <div className="p-4 text-center border-r-2 border-[#333] bg-emerald-500/10">
                        <div className="text-2xl font-black text-emerald-500">{result.added}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Added</div>
                      </div>
                      <div className="p-4 text-center border-r-2 border-[#333] bg-bauhaus-yellow/10">
                        <div className="text-2xl font-black text-bauhaus-yellow">{result.skipped}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Skipped</div>
                      </div>
                      <div className="p-4 text-center bg-bauhaus-red/10">
                        <div className="text-2xl font-black text-bauhaus-red">{result.failed}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Failed</div>
                      </div>
                    </div>

                    <button 
                      onClick={resetState}
                      className="mt-6 w-full py-3 bg-foreground text-background text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-transparent hover:text-foreground transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Upload Another File
                    </button>
                  </div>

                  {/* Errors log */}
                  {result.errors.length > 0 && (
                    <div className="border-2 border-bauhaus-red p-6 bg-surface">
                      <h4 className="font-black text-xs uppercase tracking-wider text-bauhaus-red mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4.5 h-4.5" />
                        Import warnings & errors ({result.errors.length})
                      </h4>
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-2 text-xs font-mono text-slate-400">
                        {result.errors.map((err, i) => (
                          <div key={i} className="p-2 border-b border-[#333] last:border-b-0 leading-normal">
                            • {err}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel: Template instructions */}
          <div className="lg:col-span-5 border-2 border-[#333] p-6 bg-surface text-foreground space-y-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-2 border-b-2 border-[#333] pb-3">
              <HelpCircle className="w-5 h-5 text-bauhaus-yellow" />
              CSV Schema Requirements
            </h3>

            <p className="text-slate-500 text-xs leading-relaxed">
              Your CSV file must contain a header row. The following fields are recognized by the database parser:
            </p>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {expectedColumns.map((col) => (
                <div key={col.name} className="text-xs border-b border-[#333] pb-3 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-foreground">{col.name}</span>
                    {col.required ? (
                      <span className="text-[10px] bg-bauhaus-red/20 text-bauhaus-red px-1.5 py-0.5 font-bold uppercase tracking-wider">Required</span>
                    ) : (
                      <span className="text-[10px] bg-foreground/10 text-slate-400 px-1.5 py-0.5 font-bold uppercase tracking-wider">Optional</span>
                    )}
                  </div>
                  <p className="text-slate-500 mt-1 leading-normal">{col.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Global logger stub to satisfy typescript compilations
const logger = {
  error: (...args: any[]) => console.error("[AdminPage]", ...args)
};
