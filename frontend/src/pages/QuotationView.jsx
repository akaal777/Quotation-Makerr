import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { format, parseISO, isValid } from "date-fns";
import {
  ArrowLeft,
  Printer,
  Download,
  Loader2,
  MapPin,
  Phone,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import Header from "@/components/Header";
import { getQuotation } from "@/lib/api";
import { VENDOR, formatINR } from "@/lib/constants";

const safeDate = (s) => {
  if (!s) return "";
  const d = parseISO(s);
  return isValid(d) ? format(d, "dd MMM yyyy") : s;
};

export default function QuotationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [q, setQ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getQuotation(id);
        setQ(data);
      } catch (e) {
        console.error(e);
        toast.error("Quotation not found");
        navigate("/history");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-stone-500" />
      </div>
    );
  }
  if (!q) return null;

  return (
    <div className="min-h-screen bg-parchment relative">
      <Header />

      {/* Toolbar */}
      <div className="no-print max-w-5xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Link
          to="/"
          data-testid="back-to-form-link"
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to form
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            data-testid="print-btn"
            onClick={handlePrint}
            className="h-10 gap-2 border-stone-300 bg-white"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button
            data-testid="download-pdf-btn"
            onClick={handlePrint}
            className="h-10 gap-2 bg-[#D97706] hover:bg-[#B45309] text-white"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Printable document */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <article
          data-testid="quotation-document"
          className="print-area bg-white rounded-2xl border border-stone-200 shadow-sm p-8 sm:p-12 relative overflow-hidden"
        >
          {/* Watermark strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#D97706]" />

          {/* Header */}
          <header className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-stone-200">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#D97706] text-white grid place-items-center">
                <Sun className="w-6 h-6" strokeWidth={2.4} />
              </div>
              <div>
                <div className="font-heading text-2xl font-semibold text-stone-900">
                  {VENDOR.name}
                </div>
                <div className="text-sm text-stone-600 font-body leading-relaxed mt-1">
                  {VENDOR.officeLine1}
                  <br />
                  {VENDOR.officeLine2}
                  <br />
                  {VENDOR.headOffice}
                </div>
                <div className="text-sm text-stone-800 font-medium mt-2 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D97706]" />
                  {VENDOR.contact}
                </div>
              </div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <div className="tag !text-stone-400">Quotation</div>
              <div
                data-testid="doc-quote-no"
                className="font-heading text-xl font-semibold text-stone-900"
              >
                {q.quote_no}
              </div>
              <div className="text-sm text-stone-600 mt-1">
                Date: <span data-testid="doc-date">{safeDate(q.quotation_date)}</span>
              </div>
            </div>
          </header>

          {/* Bill To */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-stone-200">
            <div>
              <div className="tag mb-2">Bill To</div>
              <div
                data-testid="doc-customer-name"
                className="font-heading text-lg font-semibold text-stone-900"
              >
                {q.customer_name}
              </div>
              <div className="text-sm text-stone-700 mt-1 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span data-testid="doc-customer-phone">{q.phone}</span>
              </div>
              <div className="text-sm text-stone-700 mt-1 flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-500 mt-0.5" />
                <span data-testid="doc-customer-address" className="whitespace-pre-line">
                  {q.address}
                </span>
              </div>
            </div>
            <div>
              <div className="tag mb-2">Project</div>
              <div className="text-sm text-stone-700">
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Service</span>
                  <span className="font-medium text-stone-900" data-testid="doc-service">
                    {q.service}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Capacity</span>
                  <span className="font-medium text-stone-900" data-testid="doc-kw">
                    {q.kw_range}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">GST Rate</span>
                  <span className="font-medium text-stone-900">{q.gst_rate}%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Items */}
          <section className="py-6 border-b border-stone-200">
            <div className="tag mb-3">Scope of Supply — Include Items</div>
            <ol className="space-y-2">
              {q.items.map((it, idx) => (
                <li
                  key={it.sr || `item-${idx}`}
                  data-testid={`doc-item-${idx}`}
                  className="flex gap-3 text-sm text-stone-800 font-body leading-relaxed"
                >
                  <span className="w-8 shrink-0 font-semibold text-stone-500">
                    {it.sr}.
                  </span>
                  <span>{it.label}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Totals */}
          <section className="py-6 flex flex-col sm:flex-row justify-end">
            <div className="w-full sm:w-96 space-y-2">
              <div className="flex justify-between text-sm text-stone-700 py-1">
                <span>Basic Price</span>
                <span data-testid="doc-basic" className="font-medium text-stone-900">
                  {formatINR(q.basic_price)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-stone-700 py-1">
                <span>GST @ {q.gst_rate}%</span>
                <span data-testid="doc-gst" className="font-medium text-stone-900">
                  {formatINR(q.gst_amount)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-stone-300">
                <span className="font-heading font-semibold text-stone-900">
                  Grand Total
                </span>
                <span
                  data-testid="doc-total"
                  className="font-heading text-xl font-semibold text-[#D97706]"
                >
                  {formatINR(q.total_amount)}
                </span>
              </div>
            </div>
          </section>

          {q.notes && (
            <section className="pt-2 pb-6 border-t border-stone-200">
              <div className="tag mb-2">Notes</div>
              <p className="text-sm text-stone-700 whitespace-pre-line" data-testid="doc-notes">
                {q.notes}
              </p>
            </section>
          )}

          {/* Footer */}
          <footer className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="tag mb-2">Terms & Conditions</div>
              <ul className="text-xs text-stone-600 space-y-1 font-body list-disc pl-4">
                <li>Prices are inclusive of {q.gst_rate}% GST.</li>
                <li>50% advance, balance on installation.</li>
                <li>Warranty as per manufacturer's terms.</li>
                <li>Quotation valid for 30 days from date of issue.</li>
              </ul>
            </div>
            <div className="text-right flex flex-col justify-end">
              <div className="tag mb-6">For {VENDOR.name}</div>
              <div className="h-10 border-b border-stone-400 w-56 ml-auto" />
              <div className="text-xs text-stone-600 mt-2">
                Authorised Signatory
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
