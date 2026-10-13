import { useState } from "react";
import { createRequest } from "../lib/api.js";
import { URGENCY, ACCESS, ITEMS, ITEM_LABEL } from "../lib/constants.js";
import MapView from "../components/MapView.jsx";
import ScoreBars from "../components/ScoreBars.jsx";

const empty = { area: "", population: "", urgency: "medium", vulnerable: false, accessibility: "easy" };

export default function RequesterPage() {
  const [form, setForm] = useState(empty);
  const [pin, setPin] = useState(null);
  const [qty, setQty] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function validate() {
    const e = {};
    if (!form.area.trim()) e.area = "Enter the area name";
    if (!pin) e.pin = "Click the map to drop a pin";
    if (!(+form.population > 0)) e.population = "Population must be greater than 0";
    if (!ITEMS.some((i) => +qty[i] > 0)) e.items = "Add a quantity for at least one supply";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const body = {
        area: form.area.trim(), ...pin, population: +form.population, urgency: form.urgency,
        vulnerable: form.vulnerable, accessibility: form.accessibility,
        items: ITEMS.filter((i) => +qty[i] > 0).map((i) => ({ item: i, qtyNeeded: +qty[i] })),
      };
      setCreated(await createRequest(body));
    } catch (e) {
      setErrors({ form: e.message });
    } finally {
      setSaving(false);
    }
  }

  if (created)
    return (
      <div className="mx-auto max-w-xl p-6">
        <div className="panel space-y-4 p-6">
          <h2 className="text-2xl font-bold">Request sent for {created.area}</h2>
          <p className="text-sm text-mute">Status: Pending. Your priority score is {created.score.total} out of 100.</p>
          <ScoreBars score={created.score} />
          <button className="btn-primary" onClick={() => { setCreated(null); setForm(empty); setPin(null); setQty({}); }}>Send another request</button>
        </div>
      </div>
    );

  return (
    <div className="grid h-full grid-cols-1 gap-4 p-4 lg:grid-cols-[420px_1fr]">
      <form onSubmit={submit} noValidate className="panel space-y-4 overflow-y-auto p-5">
        <h2 className="text-2xl font-bold">Ask for relief supplies</h2>
        <div>
          <label className="label" htmlFor="area">Area name</label>
          <input id="area" className="field" value={form.area} onChange={(e) => set("area", e.target.value)} />
          {errors.area && <p className="err">{errors.area}</p>}
        </div>
        <div>
          <span className="label">Location</span>
          <p className="text-sm text-mute">{pin ? `Pin at ${pin.lat}, ${pin.lng}` : "Click the map to place a pin."}</p>
          {errors.pin && <p className="err">{errors.pin}</p>}
        </div>
        <div>
          <label className="label" htmlFor="pop">People affected</label>
          <input id="pop" type="number" min="1" className="field" value={form.population} onChange={(e) => set("population", e.target.value)} />
          {errors.population && <p className="err">{errors.population}</p>}
        </div>
        <fieldset>
          <legend className="label">Urgency</legend>
          <div className="grid grid-cols-4 gap-2">
            {URGENCY.map((u) => (
              <button type="button" key={u} aria-pressed={form.urgency === u} onClick={() => set("urgency", u)}
                className={`btn text-xs capitalize border ${form.urgency === u ? "bg-ink text-white border-ink" : "bg-card border-line"}`}>{u}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="label">How hard is it to reach?</legend>
          <div className="grid grid-cols-3 gap-2">
            {ACCESS.map((a) => (
              <button type="button" key={a} aria-pressed={form.accessibility === a} onClick={() => set("accessibility", a)}
                className={`btn text-xs capitalize border ${form.accessibility === a ? "bg-ink text-white border-ink" : "bg-card border-line"}`}>{a}</button>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.vulnerable} onChange={(e) => set("vulnerable", e.target.checked)} className="accent-ink" />
          Children, elderly or medical patients are among those affected
        </label>
        <fieldset>
          <legend className="label">Supplies needed</legend>
          <div className="grid grid-cols-2 gap-3">
            {ITEMS.map((i) => (
              <label key={i} className="text-sm">
                {ITEM_LABEL[i]}
                <input type="number" min="0" className="field mt-1" value={qty[i] ?? ""} onChange={(e) => setQty((q) => ({ ...q, [i]: e.target.value }))} />
              </label>
            ))}
          </div>
          {errors.items && <p className="err">{errors.items}</p>}
        </fieldset>
        {errors.form && <p role="alert" className="err">{errors.form}</p>}
        <button className="btn-lime w-full" disabled={saving}>{saving ? "Sending..." : "Send request"}</button>
      </form>
      <MapView pin={pin} onPick={setPin} />
    </div>
  );
}
