"use client";

import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";

import { useFinanceRealtimeData } from "@/hooks/useFinanceRealtimeData";
import { db } from "@/lib/firebase";
import { FinanceType } from "@/lib/financeTypes";

const TYPES: FinanceType[] = ["tithe1", "tithe2", "offering", "donation", "campaign"];

export default function FinanceCategoriesView() {
  const { categories } = useFinanceRealtimeData({ includeTransactions: false, includeReceipts: false });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<FinanceType>("offering");
  const [isPublic, setIsPublic] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState(100);

  const addCategory = async () => {
    if (!title.trim()) return;

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
  };

  const patchCategory = async (id: string, patch: Record<string, unknown>) => {
    await updateDoc(doc(db, "finance_categories", id), patch);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Finance Categories</h2>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Add Category</h3>

        <label className="block text-sm font-medium text-slate-700">
          <span>Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span>Description</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" rows={3} />
        </label>

        <div className="grid gap-3 md:grid-cols-3">
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

          <div className="space-y-2 pt-1 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} /> Active</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} /> Public</label>
          </div>
        </div>

        <button type="button" onClick={addCategory} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add Category</button>
      </section>

      {categories.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Category List</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <article key={category.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-slate-900">{category.title}</h4>
                    <p className="text-xs text-slate-500">{category.type} | Priority {category.priority}</p>
                    {category.description && <p className="text-sm text-slate-600">{category.description}</p>}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => patchCategory(category.id, { isActive: !category.isActive })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${category.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </button>
                    <button
                      type="button"
                      onClick={() => patchCategory(category.id, { isPublic: !category.isPublic })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${category.isPublic ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-700"}`}
                    >
                      {category.isPublic ? "Public" : "Internal"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

