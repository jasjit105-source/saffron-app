"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { ActionButton, PageHeader } from "@/components/shared";

const WEDDING_TYPES = [
  { value: "SIKH", label: "Sikh" },
  { value: "HINDU", label: "Hindu" },
  { value: "SIKH_HINDU_MIXED", label: "Sikh + Hindu Mixed" },
  { value: "PUNJABI", label: "Punjabi" },
  { value: "NORTH_INDIAN", label: "North Indian" },
  { value: "GUJARATI", label: "Gujarati" },
  { value: "SOUTH_INDIAN", label: "South Indian" },
  { value: "CUSTOM", label: "Custom" },
];

const PLANNING_SCOPES = [
  { value: "FULL_SERVICE", label: "Full Service" },
  { value: "BOTH_SIDES", label: "Both Sides" },
  { value: "BRIDE_SIDE_ONLY", label: "Bride Side Only" },
  { value: "GROOM_SIDE_ONLY", label: "Groom Side Only" },
  { value: "EVENT_MANAGEMENT_ONLY", label: "Event Management Only" },
  { value: "DECOR_ONLY", label: "Decor Only" },
  { value: "CATERING_ONLY", label: "Catering Only" },
];

const STEPS = [
  "Couple Basics",
  "Wedding Identity",
  "Events Selection",
  "Finance & Team",
];

export default function NewWeddingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    brideName: "",
    groomName: "",
    bridePhone: "",
    groomPhone: "",
    brideCity: "",
    groomCity: "",
    title: "",
    weddingType: "SIKH",
    planningScope: "FULL_SERVICE",
    primaryCity: "",
    startDate: "",
    endDate: "",
    estimatedGuestCount: "",
    budgetCap: "",
    contractValue: "",
    specialNotes: "",
    selectedEvents: [] as string[],
  });

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const DEFAULT_EVENTS: Record<string, string[]> = {
    SIKH: ["Roka", "Kurmai", "Akhand Path", "Mehndi", "Maiyan", "Chooda", "Kaleere", "Jaggo", "Baraat", "Milni", "Anand Karaj", "Vidaai / Doli", "Reception"],
    HINDU: ["Roka", "Engagement", "Ganesh Puja", "Mehndi", "Haldi", "Sangeet", "Baraat", "Jaimala / Varmala", "Mandap Ceremony", "Pheras", "Kanyadaan", "Vidaai / Doli", "Reception"],
    SIKH_HINDU_MIXED: ["Roka", "Engagement", "Akhand Path", "Mehndi", "Haldi", "Maiyan", "Chooda", "Sangeet", "Baraat", "Milni", "Anand Karaj", "Pheras", "Vidaai / Doli", "Reception"],
    PUNJABI: ["Roka", "Kurmai", "Mehndi", "Maiyan", "Chooda", "Jaggo", "Ladies Sangeet", "Sangeet", "Baraat", "Milni", "Anand Karaj", "Vidaai / Doli", "Reception"],
    DEFAULT: ["Engagement", "Mehndi", "Sangeet", "Baraat", "Ceremony", "Reception"],
  };

  const suggestedEvents = DEFAULT_EVENTS[form.weddingType] || DEFAULT_EVENTS.DEFAULT;

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/weddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/weddings/${data.id}`);
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/weddings"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-3 transition"
        >
          <ArrowLeft size={12} /> Back to Weddings
        </Link>
        <PageHeader
          title="New Wedding"
          subtitle="Onboard a new wedding into the system"
        />
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition ${
                i < step
                  ? "bg-emerald-500 text-white"
                  : i === step
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                i === step ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px ${i < step ? "bg-emerald-300" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        {step === 0 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-gray-800">Couple Information</h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <div className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider mb-3">Bride</div>
                <div className="space-y-3">
                  <Input label="Full Name" value={form.brideName} onChange={(v) => update("brideName", v)} placeholder="e.g. Jasleen Khanna" />
                  <Input label="Phone" value={form.bridePhone} onChange={(v) => update("bridePhone", v)} placeholder="+91 98765 xxxxx" />
                  <Input label="City" value={form.brideCity} onChange={(v) => update("brideCity", v)} placeholder="e.g. Delhi" />
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-3">Groom</div>
                <div className="space-y-3">
                  <Input label="Full Name" value={form.groomName} onChange={(v) => update("groomName", v)} placeholder="e.g. Arjun Sethi" />
                  <Input label="Phone" value={form.groomPhone} onChange={(v) => update("groomPhone", v)} placeholder="+91 98765 xxxxx" />
                  <Input label="City" value={form.groomCity} onChange={(v) => update("groomCity", v)} placeholder="e.g. Chandigarh" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-gray-800">Wedding Identity</h3>
            <Input
              label="Wedding Title"
              value={form.title}
              onChange={(v) => update("title", v)}
              placeholder="e.g. Khanna–Sethi Royal Wedding"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Select label="Wedding Type" value={form.weddingType} onChange={(v) => update("weddingType", v)} options={WEDDING_TYPES} />
              <Select label="Planning Scope" value={form.planningScope} onChange={(v) => update("planningScope", v)} options={PLANNING_SCOPES} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Primary City" value={form.primaryCity} onChange={(v) => update("primaryCity", v)} placeholder="e.g. Delhi" />
              <Input label="Start Date" type="date" value={form.startDate} onChange={(v) => update("startDate", v)} />
              <Input label="End Date" type="date" value={form.endDate} onChange={(v) => update("endDate", v)} />
            </div>
            <Input
              label="Estimated Guest Count"
              type="number"
              value={form.estimatedGuestCount}
              onChange={(v) => update("estimatedGuestCount", v)}
              placeholder="e.g. 800"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-gray-800">Select Events</h3>
            <p className="text-xs text-gray-400">
              Based on your {WEDDING_TYPES.find((t) => t.value === form.weddingType)?.label} wedding type. Toggle events to include.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {suggestedEvents.map((evt) => {
                const selected = form.selectedEvents.includes(evt);
                return (
                  <button
                    key={evt}
                    onClick={() =>
                      update(
                        "selectedEvents",
                        selected
                          ? form.selectedEvents.filter((e) => e !== evt)
                          : [...form.selectedEvents, evt]
                      )
                    }
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition text-left ${
                      selected
                        ? "border-amber-300 bg-amber-50 text-amber-800"
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          selected ? "bg-amber-500 border-amber-500" : "border-gray-300"
                        }`}
                      >
                        {selected && <Check size={10} className="text-white" />}
                      </div>
                      {evt}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-300">
              {form.selectedEvents.length} events selected • You can add custom events later
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-gray-800">Finance & Notes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Budget Cap (₹)" type="number" value={form.budgetCap} onChange={(v) => update("budgetCap", v)} placeholder="e.g. 5000000" />
              <Input label="Contract Value (₹)" type="number" value={form.contractValue} onChange={(v) => update("contractValue", v)} placeholder="e.g. 6000000" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Special Notes
              </label>
              <textarea
                value={form.specialNotes}
                onChange={(e) => update("specialNotes", e.target.value)}
                placeholder="Any important notes about this wedding..."
                rows={4}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200 transition resize-none"
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Summary</div>
              <Row label="Couple" value={`${form.brideName || "—"} & ${form.groomName || "—"}`} />
              <Row label="Title" value={form.title || "—"} />
              <Row label="Type" value={WEDDING_TYPES.find((t) => t.value === form.weddingType)?.label || "—"} />
              <Row label="City" value={form.primaryCity || "—"} />
              <Row label="Dates" value={form.startDate ? `${form.startDate} → ${form.endDate || "TBD"}` : "TBD"} />
              <Row label="Guests" value={form.estimatedGuestCount || "—"} />
              <Row label="Events" value={`${form.selectedEvents.length} selected`} />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 disabled:opacity-30 transition flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Previous
        </button>
        {step < STEPS.length - 1 ? (
          <ActionButton onClick={() => setStep(step + 1)} icon={ArrowRight}>
            Next Step
          </ActionButton>
        ) : (
          <ActionButton onClick={handleSubmit} icon={Check} disabled={saving}>
            {saving ? "Creating..." : "Create Wedding"}
          </ActionButton>
        )}
      </div>
    </div>
  );
}

// ── Form helpers ──

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200 transition"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 block mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-200 transition"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  );
}
