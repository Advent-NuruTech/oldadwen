"use client";

import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ReactNode, useMemo, useState } from "react";

import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { db } from "@/lib/firebase";

export default function FinanceStructureView() {
  const { conferences, regions, churches, loading, error } = useFinanceRealtimeData({ includeTransactions: false, includeReceipts: false });

  const [conferenceName, setConferenceName] = useState("");
  const [conferenceCode, setConferenceCode] = useState("");
  const [regionName, setRegionName] = useState("");
  const [regionCode, setRegionCode] = useState("");
  const [regionConferenceId, setRegionConferenceId] = useState("");
  const [churchName, setChurchName] = useState("");
  const [churchCode, setChurchCode] = useState("");
  const [churchRegionId, setChurchRegionId] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const regionOptions = useMemo(() => regions.filter((region) => region.conferenceId === regionConferenceId || !regionConferenceId), [regions, regionConferenceId]);

  const addConference = async () => {
    if (!conferenceName.trim() || !conferenceCode.trim()) return;

    await addDoc(collection(db, "conferences"), {
      name: conferenceName.trim(),
      code: conferenceCode.trim().toUpperCase(),
      createdAt: serverTimestamp(),
    });

    setConferenceName("");
    setConferenceCode("");
    setMessage("Conference added.");
  };

  const addRegion = async () => {
    if (!regionConferenceId || !regionName.trim() || !regionCode.trim()) return;

    await addDoc(collection(db, "regions"), {
      name: regionName.trim(),
      code: regionCode.trim().toUpperCase(),
      conferenceId: regionConferenceId,
      createdAt: serverTimestamp(),
    });

    setRegionName("");
    setRegionCode("");
    setMessage("Region added.");
  };

  const addChurch = async () => {
    if (!churchRegionId || !churchName.trim() || !churchCode.trim()) return;

    const region = regions.find((entry) => entry.id === churchRegionId);
    if (!region) return;

    await addDoc(collection(db, "churches"), {
      name: churchName.trim(),
      code: churchCode.trim().toUpperCase(),
      regionId: churchRegionId,
      conferenceId: region.conferenceId,
      isActive: true,
      createdAt: serverTimestamp(),
    });

    setChurchName("");
    setChurchCode("");
    setMessage("Church added.");
  };

  const toggleChurchActive = async (churchId: string, isActive: boolean) => {
    await updateDoc(doc(db, "churches", churchId), {
      isActive: !isActive,
    });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Hierarchy Structure</h2>

      {loading && <p className="text-sm text-slate-600">Loading structure...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-slate-700">{message}</p>}

      <section className="grid gap-4 lg:grid-cols-3">
        <Panel title="Add Conference">
          <Input label="Conference Name" value={conferenceName} onChange={setConferenceName} />
          <Input label="Code" value={conferenceCode} onChange={setConferenceCode} />
          <button type="button" onClick={addConference} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add Conference</button>
        </Panel>

        <Panel title="Add Region">
          <Select
            label="Conference"
            value={regionConferenceId}
            onChange={setRegionConferenceId}
            options={conferences.map((conference) => ({ id: conference.id, name: conference.name }))}
          />
          <Input label="Region Name" value={regionName} onChange={setRegionName} />
          <Input label="Code" value={regionCode} onChange={setRegionCode} />
          <button type="button" onClick={addRegion} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add Region</button>
        </Panel>

        <Panel title="Add Church">
          <Select
            label="Region"
            value={churchRegionId}
            onChange={setChurchRegionId}
            options={regionOptions.map((region) => ({ id: region.id, name: region.name }))}
          />
          <Input label="Church Name" value={churchName} onChange={setChurchName} />
          <Input label="Code" value={churchCode} onChange={setChurchCode} />
          <button type="button" onClick={addChurch} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add Church</button>
        </Panel>
      </section>

      {churches.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Church Status</h3>
          <div className="space-y-2">
            {churches.map((church) => (
              <div key={church.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{church.name}</p>
                  <p className="text-xs text-slate-500">Code: {church.code}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChurchActive(church.id, church.isActive)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${church.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}
                >
                  {church.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
    </label>
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
  onChange: (value: string) => void;
  options: Array<{ id: string; name: string }>;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}

