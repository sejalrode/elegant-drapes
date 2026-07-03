"use client";

import { useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { demoSourceGroups } from "@/lib/demoData";
import { createClient } from "@/lib/supabaseClient";
import type { SourceGroup } from "@/types/sourceGroup";

type FormValues = {
  name: string;
  contact_person: string;
  phone: string;
  notes: string;
};

const emptyValues: FormValues = {
  name: "",
  contact_person: "",
  phone: "",
  notes: ""
};

export function SourceGroupsClient() {
  const [groups, setGroups] = useState<SourceGroup[]>(demoSourceGroups);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState("Demo data");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadGroups() {
    const supabase = createClient();
    if (!supabase) return;

    setLoading(true);
    setStatus("");
    const { data, error } = await supabase.from("source_groups").select("*").order("name");
    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setGroups((data ?? []) as SourceGroup[]);
    setMode("Live Supabase data");
    setLoading(false);
  }

  useEffect(() => {
    loadGroups();
  }, []);

  function update(name: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function edit(group: SourceGroup) {
    setEditingId(group.id);
    setValues({
      name: group.name,
      contact_person: group.contact_person ?? "",
      phone: group.phone ?? "",
      notes: group.notes ?? ""
    });
  }

  async function saveGroup() {
    const supabase = createClient();
    if (!supabase) {
      setStatus("Add Supabase keys in .env.local before saving source groups.");
      return;
    }

    if (!values.name.trim()) {
      setStatus("Group name is required.");
      return;
    }

    const payload = {
      name: values.name.trim(),
      contact_person: values.contact_person || null,
      phone: values.phone || null,
      notes: values.notes || null
    };

    setSaving(true);
    const result = editingId
      ? await supabase.from("source_groups").update(payload).eq("id", editingId)
      : await supabase.from("source_groups").insert(payload);

    if (result.error) {
      setStatus(result.error.message);
      setSaving(false);
      return;
    }

    setValues(emptyValues);
    setEditingId(null);
    setStatus("");
    setSaving(false);
    await loadGroups();
  }

  async function deleteGroup(id: string) {
    const supabase = createClient();
    if (!supabase) {
      setStatus("Add Supabase keys in .env.local before deleting source groups.");
      return;
    }

    const { error } = await supabase.from("source_groups").delete().eq("id", id);
    if (error) {
      setStatus(error.message);
      return;
    }
    await loadGroups();
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-palm">Suppliers and friends</p>
        <h1 className="text-2xl font-bold text-ink">Source Groups</h1>
        <p className="text-xs font-semibold text-slate-500">{mode}</p>
      </div>
      <form className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-semibold text-slate-700">Group Name</span>
            <input value={values.name} onChange={(event) => update("name", event.target.value)} className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm" placeholder="Pune Saree Group" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-semibold text-slate-700">Contact Person</span>
            <input value={values.contact_person} onChange={(event) => update("contact_person", event.target.value)} className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm" placeholder="Meena" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-semibold text-slate-700">Phone Number</span>
          <input value={values.phone} onChange={(event) => update("phone", event.target.value)} inputMode="tel" className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm" placeholder="9876543210" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-semibold text-slate-700">Notes</span>
          <textarea value={values.notes} onChange={(event) => update("notes", event.target.value)} className="min-h-20 w-full rounded-md border border-slate-300 px-3 py-3 text-base outline-none focus:border-palm" placeholder="What this supplier is best for" />
        </label>
        {status ? <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">{status}</p> : null}
        <div className="flex flex-col gap-2 md:flex-row">
          <button type="button" onClick={saveGroup} disabled={saving} className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-palm px-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 md:w-auto">
            {editingId ? <Save className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
            {saving ? "Saving..." : editingId ? "Save Group" : "Add Source Group"}
          </button>
          {editingId ? (
            <button type="button" onClick={() => { setEditingId(null); setValues(emptyValues); }} className="h-12 rounded-md border border-slate-300 px-4 text-base font-bold text-slate-700">
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      {loading ? <p className="rounded-lg bg-white p-4 text-sm font-semibold text-slate-500 shadow-soft">Loading source groups...</p> : null}
      {!loading && groups.length === 0 ? (
        <EmptyState title="No source groups yet" message="Add the WhatsApp or supplier groups your mom buys from." />
      ) : (
        <section className="grid gap-3 md:grid-cols-2">
          {groups.map((group) => (
            <article key={group.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <h2 className="font-bold text-ink">{group.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{group.contact_person || "No contact person"} {group.phone ? `- ${group.phone}` : ""}</p>
              <p className="mt-2 text-sm text-slate-500">{group.notes}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => edit(group)} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold">Edit</button>
                <button onClick={() => window.confirm("Delete this source group? Existing orders will keep working without this source.") && deleteGroup(group.id)} className="rounded-md border border-rose-200 px-3 py-2 text-sm font-semibold text-rosewood">Delete</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
