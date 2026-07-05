import React from "react";
import { VENDOR } from "@/lib/constants";
import { MapPin, Phone, Sun } from "lucide-react";

export const VendorCard = ({ compact = false }) => {
  return (
    <div
      data-testid="vendor-card"
      className={`rounded-2xl border border-stone-200 bg-stone-900 text-stone-50 overflow-hidden ${
        compact ? "" : "shadow-sm"
      }`}
    >
      <div className="p-6 sm:p-7 relative">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#D97706]/30 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#D97706] grid place-items-center">
            <Sun className="w-5 h-5 text-white" strokeWidth={2.4} />
          </div>
          <div>
            <div className="tag text-stone-400">Vendor</div>
            <div
              data-testid="vendor-name"
              className="font-heading text-xl font-semibold text-white"
            >
              {VENDOR.name}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm text-stone-300 font-body leading-relaxed">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-[#F59E0B] shrink-0" />
            <div>
              <div>{VENDOR.officeLine1}</div>
              <div>{VENDOR.officeLine2}</div>
              <div className="mt-1 text-stone-400">{VENDOR.headOffice}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
            <Phone className="w-4 h-4 text-[#F59E0B]" />
            <a
              href={`tel:${VENDOR.contact}`}
              data-testid="vendor-contact"
              className="text-white font-medium tracking-wide"
            >
              {VENDOR.contact}
            </a>
          </div>
        </div>

        {!compact && (
          <p className="mt-5 text-xs text-stone-400 italic">
            {VENDOR.tagline}
          </p>
        )}
      </div>
    </div>
  );
};

export default VendorCard;
