"use client";

import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamUrl: string;
  teamName: string;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  teamUrl,
  teamName,
}: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Scan to Vote
          </div>
          <h3 className="text-2xl font-extrabold text-slate-100">{teamName}</h3>
        </div>

        {/* The QR Code */}
        <div className="p-4 bg-white rounded-2xl shadow-inner mb-6">
          <QRCodeSVG
            value={teamUrl}
            size={240}
            level={"H"} // High error correction level for better scanning
            includeMargin={false}
          />
        </div>

        {/* URL Display */}
        <p className="text-xs text-slate-400 break-all w-full px-4 font-mono bg-slate-950 py-3 rounded-lg border border-slate-800">
          {teamUrl}
        </p>
      </div>
    </div>
  );
}