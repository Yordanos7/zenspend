"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, Loader2, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // Assuming sonner is used for toasts based on package.json

interface ReceiptUploaderProps {
  onUpload?: (file: File) => Promise<void>;
}

export function ReceiptUploader({ onUpload }: ReceiptUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setIsSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      if (onUpload) {
        await onUpload(file);
      } else {
        // Simulate upload for now if no handler provided
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
      setIsSuccess(true);
      toast.success("Receipt uploaded successfully!");
      // Reset after a delay
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload receipt.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            {...getRootProps()}
            className={cn(
              "relative overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-8 transition-colors hover:bg-muted/10 cursor-pointer",
              isDragActive && "border-primary/50 bg-primary/5"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-background shadow-sm ring-1 ring-border">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">
                  Upload Receipt
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag & drop or click to scan
                </p>
              </div>
            </div>
            {/* Animated scanning line effect for "idle" state */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"
              initial={{ top: "-100%" }}
              animate={{ top: "200%" }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
                delay: 1,
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-lg"
          >
            <div className="relative aspect-[4/3] w-full bg-black/5">
              {/* Image Preview */}
              {preview && (
                <img
                  src={preview}
                  alt="Receipt preview"
                  className="w-full h-full object-contain"
                />
              )}

              {/* Scanning Animation Overlay */}
              {isUploading && (
                <div className="absolute inset-0 z-10">
                  <motion.div
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 1.5,
                      ease: "linear",
                    }}
                    className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_2px_rgba(var(--primary),0.5)]"
                  >
                    <div className="absolute right-0 bottom-full bg-primary/20 text-xs px-2 py-0.5 text-primary-foreground rounded-tl-md font-mono">
                      AI SCANNING...
                    </div>
                  </motion.div>
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                </div>
              )}

              {/* Actions */}
              {!isUploading && !isSuccess && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Footer / Status */}
            <div className="p-4 bg-card border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isSuccess
                      ? "bg-green-500/10 text-green-500"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isSuccess ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ScanLine className="w-4 h-4" />
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    {isSuccess
                      ? "Scanned Successfully"
                      : isUploading
                      ? "Processing Receipt..."
                      : file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isSuccess
                      ? "Added to transactions"
                      : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                  </p>
                </div>
              </div>

              {!isSuccess && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isUploading
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg"
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Scan Verification"
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
