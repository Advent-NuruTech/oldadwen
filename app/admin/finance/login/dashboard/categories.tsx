"use client";

import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { db } from "@/lib/firebase";
import { FinanceType, FinanceCategoryRecord } from "@/lib/financeTypes";

const TYPES: FinanceType[] = ["tithe1", "tithe2", "offering", "donation", "campaign"];

export default function FinanceCategoriesView() {
  const { categories } = useFinanceRealtimeData({ includeTransactions: false, includeReceipts: false });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<FinanceType>("offering");
  const [isPublic, setIsPublic] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState(100);
  const [saving, setSaving] = useState(false);

  const addCategory = async () => {
    if (!title.trim()) return;

    setSaving(true);
    try {
      await addDoc(collection(db, "finance_categories"), {
        title: title.trim(),
        description: description.trim() || null,
        type,
        isActive,
        isPublic,
        priority,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      setType("offering");
      setIsPublic(true);
      setIsActive(true);
      setPriority(100);
    } finally {
      setSaving(false);
    }
  };

  const patchCategory = async (id: string, patch: Record<string, unknown>) => {
    await updateDoc(doc(db, "finance_categories", id), patch);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Finance Categories</h2>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Add New Category</h3>
          <p className="text-sm text-slate-600">
            Create a category here, then use the list below to quickly set Active/Inactive, edit, or delete.
          </p>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          <span>Category Name</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: Sabbath Offering"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short note for users (optional)"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            rows={2}
          />
        </label>

        <div className="grid gap-3 md:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700">
            <span>Type</span>
            <select value={type} onChange={(event) => setType(event.target.value as FinanceType)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
              {TYPES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span>Priority</span>
            <input type="number" value={priority} onChange={(event) => setPriority(Number(event.target.value) || 100)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>

          <div className="space-y-2 pt-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} />
              Public
            </label>
          </div>
        </div>

        <button type="button" onClick={addCategory} disabled={saving} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {saving ? "Saving..." : "Add New Category"}
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="mb-1 text-lg font-semibold text-slate-900">Existing Categories</h3>
        <p className="mb-4 text-sm text-slate-600">Use Active checkbox to enable, uncheck to set inactive. Edit and Delete are beside each category.</p>

        {categories.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No categories yet. Add your first category above.
          </p>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <CategoryItem key={category.id} category={category} onSave={patchCategory} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CategoryItem({
  category,
  onSave,
}: {
  category: FinanceCategoryRecord;
  onSave: (id: string, patch: Record<string, unknown>) => Promise<void>;
}) {
  const [title, setTitle] = useState(category.title);
  const [description, setDescription] = useState(category.description || "");
  const [type, setType] = useState<FinanceType>(category.type);
  const [priority, setPriority] = useState(category.priority);
  const [isActive, setIsActive] = useState(category.isActive);
  const [isPublic, setIsPublic] = useState(category.isPublic);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(category.title);
    setDescription(category.description || "");
    setType(category.type);
    setPriority(category.priority);
    setIsActive(category.isActive);
    setIsPublic(category.isPublic);
  }, [category]);

  const saveChanges = async () => {
    setSaving(true);
    try {
      await onSave(category.id, {
        title: title.trim() || category.title,
        description: description.trim() || null,
        type,
        priority,
        isActive,
        isPublic,
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async () => {
    if (!window.confirm(`Delete category "${category.title}"? This cannot be undone.`)) {
      return;
    }

    await deleteDoc(doc(db, "finance_categories", category.id));
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_120px_120px_auto]">
        <label className="block text-sm font-medium text-slate-700">
          <span>Category Name</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span>Type</span>
          <select value={type} onChange={(event) => setType(event.target.value as FinanceType)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
            {TYPES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span>Priority</span>
          <input
            type="number"
            value={priority}
            onChange={(event) => setPriority(Number(event.target.value) || 100)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="pt-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="h-4 w-4" />
            Active
          </label>
          <label className="mt-2 flex items-center gap-2">
            <input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} className="h-4 w-4" />
            Public
          </label>
        </div>

        <div className="flex items-end gap-2 pt-6">
          <button
            type="button"
            onClick={saveChanges}
            disabled={saving}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Edit"}
          </button>
          <button
            type="button"
            onClick={deleteCategory}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      <label className="mt-3 block text-sm font-medium text-slate-700">
        <span>Description</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          rows={2}
        />
      </label>
      <div className="mt-3">
        <span className="rounded-full bg-slate-200 px-2 py-1 text-xs uppercase tracking-wide text-slate-600">
          ID: {category.id}
        </span>
      </div>
    </article>
  );
}
