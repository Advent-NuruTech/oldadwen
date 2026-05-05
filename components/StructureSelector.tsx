"use client";

import { ChurchRecord, ConferenceRecord, RegionRecord } from "@/lib/financeTypes";

interface StructureSelectorProps {
  conferences: ConferenceRecord[];
  regions: RegionRecord[];
  churches: ChurchRecord[];

  conferenceId: string;
  regionId: string;
  churchId: string;
  isVisitor: boolean;

  onConferenceChange: (conferenceId: string) => void;
  onRegionChange: (regionId: string) => void;
  onChurchChange: (churchId: string) => void;
  onVisitorToggle: (isVisitor: boolean) => void;
}

export default function StructureSelector({
  conferences,
  regions,
  churches,
  conferenceId,
  regionId,
  churchId,
  isVisitor,
  onConferenceChange,
  onRegionChange,
  onChurchChange,
  onVisitorToggle,
}: StructureSelectorProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Church Structure</h3>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isVisitor}
            onChange={(event) => onVisitorToggle(event.target.checked)}
          />
          Visitor / Other
        </label>
      </div>

      {!isVisitor && (
        <div className="grid gap-3 md:grid-cols-3">
          <SelectField
            label="Conference"
            value={conferenceId}
            options={conferences.map((conference) => ({ id: conference.id, name: conference.name }))}
            onChange={(value) => onConferenceChange(value)}
          />

          <SelectField
            label="Region"
            value={regionId}
            options={regions.map((region) => ({ id: region.id, name: region.name }))}
            onChange={(value) => onRegionChange(value)}
            disabled={!conferenceId}
          />

          <SelectField
            label="Church"
            value={churchId}
            options={churches.map((church) => ({ id: church.id, name: church.name }))}
            onChange={(value) => onChurchChange(value)}
            disabled={!regionId}
          />
        </div>
      )}

      {isVisitor && (
        <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-600">
          Visitor contributions are saved under Visitor / Other for full audit trace.
        </div>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: Array<{ id: string; name: string }>;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function SelectField({ label, value, options, onChange, disabled = false }: SelectFieldProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:bg-slate-100"
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
