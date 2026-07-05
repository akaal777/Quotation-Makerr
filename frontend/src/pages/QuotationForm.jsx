import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  User,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Zap,
  Wrench,
  Calculator,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

import Header from "@/components/Header";
import VendorCard from "@/components/VendorCard";
import AmountField from "@/components/AmountField";
import DatePickerField from "@/components/DatePickerField";
import IncludeItemsEditor from "@/components/IncludeItemsEditor";

import {
  SERVICES,
  KW_RANGES,
  DEFAULT_ITEMS,
  applyKwToItems,
  computeBreakdown,
  formatINR,
  GST_RATE,
} from "@/lib/constants";
import { createQuotation } from "@/lib/api";

const HERO_MOTION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const SectionCard = ({ children, title, icon: Icon, testId }) => (
  <section
    data-testid={testId}
    className="rounded-2xl bg-white border border-stone-200 p-5 sm:p-7 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
  >
    <div className="flex items-center gap-2 mb-5">
      {Icon && <Icon className="w-4 h-4 text-[#D97706]" />}
      <h2 className="font-heading text-base font-semibold text-stone-900 tracking-tight">
        {title}
      </h2>
    </div>
    {children}
  </section>
);

const Field = ({ label, htmlFor, children, hint }) => (
  <div className="space-y-1.5">
    <Label
      htmlFor={htmlFor}
      className="tag !text-[0.65rem] !text-stone-500 block"
    >
      {label}
    </Label>
    {children}
    {hint && <p className="text-xs text-stone-500 font-body">{hint}</p>}
  </div>
);

export default function QuotationForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    address: "",
    quotation_date: format(new Date(), "yyyy-MM-dd"),
    service: "Solar Rooftop",
    kw_range: "3 KW",
    total_amount: "",
    notes: "",
  });

  const [items, setItems] = useState(applyKwToItems(DEFAULT_ITEMS, "3 KW"));

  // When kw_range changes, auto-update inverter row
  useEffect(() => {
    setItems((prev) => applyKwToItems(prev, form.kw_range));
  }, [form.kw_range]);

  const breakdown = useMemo(
    () => computeBreakdown(form.total_amount, GST_RATE),
    [form.total_amount]
  );

  const update = useCallback(
    (key, val) => setForm((p) => ({ ...p, [key]: val })),
    []
  );

  const validate = () => {
    if (!form.customer_name.trim()) return "Please enter customer name.";
    if (!form.phone.trim() || form.phone.trim().length < 7)
      return "Please enter a valid phone number.";
    if (!form.address.trim()) return "Please enter address.";
    if (!form.quotation_date) return "Please pick a date.";
    if (!form.kw_range) return "Please select KW range.";
    const t = Number(form.total_amount);
    if (!t || t <= 0) return "Please enter a valid Total Amount and press OK.";
    return null;
  };

  const onGenerate = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        quotation_date: form.quotation_date,
        service: form.service,
        kw_range: form.kw_range,
        total_amount: Number(form.total_amount),
        items,
        notes: form.notes || "",
      };
      const created = await createQuotation(payload);
      toast.success(`Quotation ${created.quote_no} generated`);
      navigate(`/quotation/${created.id}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate quotation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment grain relative">
      <Header />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Hero */}
        <motion.div {...HERO_MOTION} className="mb-8 sm:mb-10">
          <div className="tag mb-2">Solar Rooftop • Punjab</div>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.05]">
            Build a professional quotation
            <span className="block text-[#D97706]">in under a minute.</span>
          </h1>
          <p className="mt-3 text-stone-600 font-body max-w-2xl">
            Fill customer details, pick a KW range, enter the total amount and
            press OK — GST is applied automatically. Edit the bill of materials
            inline before you generate.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Form */}
          <div className="lg:col-span-2 space-y-6">
            <SectionCard
              title="Customer Details"
              icon={User}
              testId="section-customer"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Name" htmlFor="customer_name">
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <Input
                      id="customer_name"
                      data-testid="customer-name-input"
                      placeholder="Full name"
                      className="pl-9 h-11 bg-stone-50 border-stone-200"
                      value={form.customer_name}
                      onChange={(e) => update("customer_name", e.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Phone No." htmlFor="phone">
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <Input
                      id="phone"
                      data-testid="customer-phone-input"
                      placeholder="98724-XXXXX"
                      className="pl-9 h-11 bg-stone-50 border-stone-200"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Address" htmlFor="address">
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-stone-400" />
                      <Textarea
                        id="address"
                        data-testid="customer-address-input"
                        placeholder="Village / Town, District, State"
                        rows={2}
                        className="pl-9 bg-stone-50 border-stone-200 resize-none"
                        value={form.address}
                        onChange={(e) => update("address", e.target.value)}
                      />
                    </div>
                  </Field>
                </div>
                <Field label="Quotation Date" htmlFor="quotation_date">
                  <DatePickerField
                    value={form.quotation_date}
                    onChange={(v) => update("quotation_date", v)}
                    testId="quotation-date"
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard
              title="Service & Capacity"
              icon={Zap}
              testId="section-service"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Service">
                  <Select
                    value={form.service}
                    onValueChange={(v) => update("service", v)}
                  >
                    <SelectTrigger
                      data-testid="service-select"
                      className="h-11 bg-stone-50 border-stone-200"
                    >
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem
                          key={s.value}
                          value={s.value}
                          data-testid={`service-option-${s.value}`}
                        >
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field
                  label="Solar Rooftop Range"
                  hint="Auto-fills inverter capacity in the Include Items list."
                >
                  <Select
                    value={form.kw_range}
                    onValueChange={(v) => update("kw_range", v)}
                  >
                    <SelectTrigger
                      data-testid="kw-range-select"
                      className="h-11 bg-stone-50 border-stone-200"
                    >
                      <SelectValue placeholder="Select KW" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {KW_RANGES.map((k) => (
                        <SelectItem
                          key={k}
                          value={k}
                          data-testid={`kw-option-${k.replace(/\s/g, "")}`}
                        >
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </SectionCard>

            <SectionCard
              title="Amount & GST"
              icon={Calculator}
              testId="section-amount"
            >
              <AmountField
                value={form.total_amount}
                onChange={(v) => update("total_amount", v)}
              />

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  data-testid="breakdown-basic"
                  className="rounded-xl border border-stone-200 bg-stone-50 p-4"
                >
                  <div className="tag mb-1">Basic Price</div>
                  <div className="font-heading text-xl font-semibold text-stone-900">
                    {formatINR(breakdown.basic)}
                  </div>
                </div>
                <div
                  data-testid="breakdown-gst"
                  className="rounded-xl border border-stone-200 bg-stone-50 p-4"
                >
                  <div className="tag mb-1">GST @ {GST_RATE}%</div>
                  <div className="font-heading text-xl font-semibold text-stone-900">
                    {formatINR(breakdown.gst)}
                  </div>
                </div>
                <div
                  data-testid="breakdown-total"
                  className="rounded-xl border border-[#D97706]/40 bg-[#FEF3C7]/50 p-4"
                >
                  <div className="tag mb-1 !text-[#B45309]">Total Amount</div>
                  <div className="font-heading text-xl font-semibold text-stone-900">
                    {formatINR(breakdown.total)}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Include Items"
              icon={Wrench}
              testId="section-items"
            >
              <IncludeItemsEditor
                items={items}
                setItems={setItems}
                kwRange={form.kw_range}
              />
              <div className="mt-5">
                <Field label="Notes / Remarks (optional)">
                  <Textarea
                    data-testid="notes-input"
                    placeholder="e.g. Warranty terms, delivery timeline"
                    rows={3}
                    className="bg-stone-50 border-stone-200 resize-none"
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                  />
                </Field>
              </div>
            </SectionCard>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <p className="text-xs text-stone-500 font-body">
                GST = Total × {GST_RATE}%. Basic Price = Total − GST.
              </p>
              <Button
                type="button"
                onClick={onGenerate}
                disabled={submitting}
                data-testid="generate-quote-btn"
                className="h-12 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium gap-2 shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    Generate Quotation
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* RIGHT: Vendor + Summary */}
          <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <VendorCard />
            <div
              data-testid="live-preview-card"
              className="rounded-2xl border border-stone-200 bg-white p-6"
            >
              <div className="tag mb-2">Live Summary</div>
              <div className="font-heading text-lg font-semibold text-stone-900">
                {form.customer_name || "Customer Name"}
              </div>
              <div className="text-sm text-stone-600 font-body">
                {form.service} · {form.kw_range}
              </div>
              <div className="my-4 border-t border-stone-200" />
              <div className="space-y-2 text-sm">
                <Row
                  label="Basic Price"
                  value={formatINR(breakdown.basic)}
                />
                <Row
                  label={`GST @ ${GST_RATE}%`}
                  value={formatINR(breakdown.gst)}
                />
                <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                  <span className="font-heading font-semibold text-stone-900">
                    Total
                  </span>
                  <span className="font-heading text-lg font-semibold text-[#D97706]">
                    {formatINR(breakdown.total)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-stone-600 font-body">{label}</span>
    <span className="font-body font-medium text-stone-900">{value}</span>
  </div>
);
