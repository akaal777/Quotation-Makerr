import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format, parseISO, isValid } from "date-fns";
import { Eye, Trash2, FileText, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Header from "@/components/Header";
import { listQuotations, deleteQuotation } from "@/lib/api";
import { formatINR } from "@/lib/constants";

const fmt = (d) => {
  if (!d) return "-";
  const p = parseISO(d);
  return isValid(p) ? format(p, "dd MMM yyyy") : d;
};

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listQuotations();
      setRows(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onDelete = async (id) => {
    try {
      await deleteQuotation(id);
      toast.success("Quotation deleted");
      setRows((r) => r.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete");
    }
  };

  const renderBody = () => {
    if (loading) {
      return (
        <div className="py-24 grid place-items-center">
          <Loader2 className="w-6 h-6 animate-spin text-stone-500" />
        </div>
      );
    }
    if (rows.length === 0) {
      return (
        <div
          data-testid="history-empty"
          className="rounded-2xl border border-dashed border-stone-300 bg-white p-16 text-center"
        >
          <FileText className="w-8 h-8 mx-auto text-stone-400" />
          <div className="mt-3 font-heading font-semibold text-stone-800">
            No quotations yet
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Generate your first quotation to see it here.
          </p>
          <Link to="/">
            <Button className="mt-5 bg-[#D97706] hover:bg-[#B45309] text-white">
              Create a Quotation
            </Button>
          </Link>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-stone-50 border-b border-stone-200 tag">
          <div className="col-span-3">Quote #</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">KW</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        <ul>
          {rows.map((r) => (
            <HistoryRow key={r.id} row={r} onDelete={onDelete} />
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-parchment grain relative">
      <Header />
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="tag mb-2">History</div>
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Saved quotations
            </h1>
            <p className="text-stone-600 mt-1 font-body">
              Every generated quote is saved here. Open one to reprint or share.
            </p>
          </div>
          <Link to="/">
            <Button
              data-testid="history-new-btn"
              className="h-10 gap-2 bg-stone-900 hover:bg-stone-800 text-white"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Quote</span>
            </Button>
          </Link>
        </div>

        {renderBody()}
      </main>
    </div>
  );
}

const HistoryRow = ({ row: r, onDelete }) => (
  <li
    data-testid={`history-row-${r.id}`}
    className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-stone-100 last:border-0 items-center item-row"
  >
    <div className="col-span-12 md:col-span-3 font-heading font-medium text-stone-900">
      {r.quote_no}
    </div>
    <div className="col-span-12 md:col-span-3 text-stone-800">
      <div className="font-medium">{r.customer_name}</div>
      <div className="text-xs text-stone-500">{r.phone}</div>
    </div>
    <div className="col-span-6 md:col-span-2 text-sm text-stone-700">
      {fmt(r.quotation_date)}
    </div>
    <div className="col-span-6 md:col-span-1 text-sm text-stone-700">
      {r.kw_range}
    </div>
    <div className="col-span-8 md:col-span-2 text-right font-heading font-semibold text-[#D97706]">
      {formatINR(r.total_amount)}
    </div>
    <div className="col-span-4 md:col-span-1 flex justify-end gap-2">
      <Link to={`/quotation/${r.id}`}>
        <Button
          size="icon"
          variant="ghost"
          data-testid={`history-view-${r.id}`}
          className="h-8 w-8 text-stone-600 hover:text-stone-900"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            data-testid={`history-delete-${r.id}`}
            className="h-8 w-8 text-stone-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this quotation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {r.quote_no} from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid={`confirm-cancel-${r.id}`}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-testid={`confirm-delete-${r.id}`}
              onClick={() => onDelete(r.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </li>
);
