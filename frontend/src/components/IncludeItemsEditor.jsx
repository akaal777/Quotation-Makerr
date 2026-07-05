import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Pencil, RotateCcw, Package } from "lucide-react";
import { DEFAULT_ITEMS, applyKwToItems } from "@/lib/constants";

export const IncludeItemsEditor = ({ items, setItems, kwRange }) => {
  const [open, setOpen] = useState(true);
  const [editingIdx, setEditingIdx] = useState(null);

  const handleChange = (idx, newLabel) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, label: newLabel } : it))
    );
  };

  const resetItems = () => {
    setItems(applyKwToItems(DEFAULT_ITEMS, kwRange));
    setEditingIdx(null);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          data-testid="include-items-toggle"
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-colors"
        >
          <span className="flex items-center gap-3">
            <Package className="w-4 h-4 text-[#D97706]" />
            <span className="font-heading font-medium text-stone-800">
              Include Items ({items.length})
            </span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-stone-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">
        <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-stone-50/60 border-b border-stone-200">
            <span className="tag">Editable Bill of Materials</span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              data-testid="items-reset-btn"
              onClick={resetItems}
              className="h-8 gap-1.5 text-stone-600 hover:text-stone-900"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>
          <ul>
            {items.map((it, idx) => (
              <li
                key={it.sr || `item-${idx}`}
                data-testid={`item-row-${idx}`}
                className="item-row flex items-start gap-3 px-4 py-3 border-b border-stone-100 last:border-0"
              >
                <span className="w-8 shrink-0 pt-2 text-xs font-semibold text-stone-500">
                  {it.sr}.
                </span>
                {editingIdx === idx ? (
                  <Input
                    data-testid={`item-input-${idx}`}
                    autoFocus
                    value={it.label}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onBlur={() => setEditingIdx(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingIdx(null);
                    }}
                    className="flex-1 bg-stone-50 border-stone-200"
                  />
                ) : (
                  <button
                    type="button"
                    data-testid={`item-label-${idx}`}
                    onClick={() => setEditingIdx(idx)}
                    className="flex-1 text-left font-body text-sm text-stone-800 hover:text-stone-950 leading-relaxed"
                  >
                    {it.label}
                  </button>
                )}
                <button
                  type="button"
                  data-testid={`item-edit-${idx}`}
                  onClick={() =>
                    setEditingIdx(editingIdx === idx ? null : idx)
                  }
                  className="mt-1 text-stone-400 hover:text-[#D97706] transition-colors"
                  aria-label="Edit item"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default IncludeItemsEditor;
