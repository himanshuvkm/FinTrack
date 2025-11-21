"use client";

import { useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { scanReceipt } from "@/actions/transaction";
import useFetch from "@/hooks/usefetch";
import { motion } from "framer-motion";

// ---- Types ----
interface ReceiptScannerProps {
  onScanComplete: (data: any) => void;
}


export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Assuming scanReceipt returns any (you can refine later)
  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    await scanReceiptFn(file);
  };


// inside ReceiptScanner:
const lastScannedRef = useRef<any>(null);

useEffect(() => {
    
  if (!scannedData || scanReceiptLoading) return;

   const sd = scannedData as {
    amount?: number | string;
    date?: string;
    merchantName?: string;
  } | null;

  // simple deep-check key: if scannedData is an object, you can compare JSON string
  const scannedId = (() => {
    try {
      // Prefer specific stable fields if available (amount+date+merchantName)
      return `${sd?.amount ?? ""}-${sd?.date ?? ""}-${
        sd?.merchantName ?? ""
      }`;
    } catch {
      return JSON.stringify(scannedData);
    }
  })();

  if (lastScannedRef.current === scannedId) {
    // already handled this scan result
    return;
  }

  lastScannedRef.current = scannedId;

  try {
    onScanComplete(scannedData);
    toast.success("Receipt scanned successfully");
  } catch (err) {
    console.error("onScanComplete handler threw:", err);
  }
}, [scanReceiptLoading, scannedData, onScanComplete]);


  return (

<div className="px-4 bg-gradient-to-r from-blue-50/40 to-emerald-50/40 backdrop-blur-sm  flex gap-4">

  <input
    type="file"
    ref={fileInputRef}
    className="hidden"
    accept="image/*"
    capture="environment"
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleReceiptScan(file);
    }}
  />

  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="w-full"
  >
    <Button
      type="button"
      className="
        w-full h-12 rounded-lg
        bg-gradient-to-r from-blue-600 to-emerald-500
        shadow-md text-white
        hover:opacity-95 transition
        flex items-center justify-center gap-2
      "
      onClick={() => fileInputRef.current?.click()}
      disabled={scanReceiptLoading}
    >
      {scanReceiptLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Scanning Receipt...</span>
        </>
      ) : (
        <>
          <Camera className="h-4 w-4" />
          <span>Scan Receipt with AI</span>
        </>
      )}
    </Button>
  </motion.div>

</div>

  );
}
