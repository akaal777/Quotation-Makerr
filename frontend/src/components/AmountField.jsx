import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, IndianRupee, Check } from "lucide-react";
import { AMOUNT_PRESETS, formatINR } from "@/lib/constants";

/**
 * Amount field with a dropdown for presets.
 * User can type a value or pick from presets, then press OK to apply GST calc (handled by parent via `onApply`).
 */
export const AmountField = ({ value, onChange, onApply }) => {
  const [draft, setDraft] = useState(value || "");

  React.useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  const handleApply = () => {
    const n = Number(draft);
    if (!isNaN(n) && n > 0) {
      onChange(n);
      onApply && onApply(n);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            data-testid="total-amount-input"
            inputMode="decimal"
            placeholder="Enter Total Amount (incl. GST)"
            className="pl-9 h-11 bg-stone-50 border-stone-200 font-body"
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/[^0-9.]/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApply();
              }
            }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              data-testid="amount-preset-trigger"
              className="h-11 gap-2 border-stone-300 bg-white text-stone-800"
            >
              Presets <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 max-h-72 overflow-y-auto"
          >
            <DropdownMenuLabel className="text-xs uppercase tracking-widest text-stone-500">
              Common Amounts
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {AMOUNT_PRESETS.map((amt) => (
              <DropdownMenuItem
                key={amt}
                data-testid={`amount-preset-${amt}`}
                onSelect={() => setDraft(String(amt))}
                className="cursor-pointer"
              >
                {formatINR(amt)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          type="button"
          data-testid="apply-amount-btn"
          onClick={handleApply}
          className="h-11 bg-[#D97706] hover:bg-[#B45309] text-white font-medium gap-2"
        >
          <Check className="w-4 h-4" />
          OK
        </Button>
      </div>
      <p className="text-xs text-stone-500 font-body">
        Press <kbd className="px-1.5 py-0.5 border rounded bg-white">OK</kbd> to
        apply 8.9% GST. GST is 8.9% of the entered Total; Basic Price = Total −
        GST.
      </p>
    </div>
  );
};

export default AmountField;
