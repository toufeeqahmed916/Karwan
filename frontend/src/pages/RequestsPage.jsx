import { useEffect, useRef, useState } from "react";
import { getRequests, getWeights, putWeights, getDepots } from "../lib/api.js";
import { ITEM_LABEL } from "../lib/constants.js";
import MapView from "../components/MapView.jsx";
import ScoreBars from "../components/ScoreBars.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import WeightSliders from "../components/WeightSliders.jsx";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [depots, setDepots] = useState([]);
  const [weights, setWeights] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const timer = useRef();

  useEffect(() => {
    Promise.all([getRequests(), getWeights(), getDepots()])
      .then(([r, w, d]) => { setRequests(r); setWeights(w); setDepots(d); setSelectedId(r[0]?.id ?? null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Re-rank live while sliders move (debounced so we do not spam the API)
  function onWeights(next) {
    setWeights(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      putWeights(next).then((res) => setRequests(res.requests)).catch((e) => setError(e.message));
    }, 150);
  }

  const selected = requests.find((r) => r.id === selectedId);

  if (loading) return <p className="p-6 text-mute">Loading requests...</p>;
  if (error) return <p role="alert" className="p-6 text-crit">{error}</p>;
  if (!requests.length) return <p className="p-6">No requests yet. Add one from the Requester screen or reset the demo data.</p>;

  return (
    <div className="grid h-full grid-cols-1 gap-4 p-4 lg:grid-cols-[380px_1fr_340px]">
      <section className="panel flex min-h-0 flex-col">
        <h2 className="border-b border-line px-4 py-3 text-lg font-bold">Request queue</h2>
        <ol className="min-h-0 flex-1 overflow-y-auto">
          {requests.map((r, i) => (
            <li key={r.id}>
              <button onClick={() => setSelectedId(r.id)}
                className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left hover:bg-paper ${r.id === selectedId ? "bg-lime/40" : ""}`}>
                <span className="w-6 text-sm text-mute">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{r.area}</span>
                  <span className="block text-sm text-mute">{r.population.toLocaleString()} people, {r.urgency}</span>
                </span>
                <span className="font-display text-2xl font-extrabold">{r.score.total}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="min-h-[360px] lg:min-h-0">
        <MapView requests={requests} depots={depots} selectedId={selectedId} onSelect={setSelectedId} />
      </section>

      <aside className="panel min-h-0 space-y-6 overflow-y-auto p-4">
        {selected && (
          <div>
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold">{selected.area}</h2>
                <p className="text-sm text-mute">Waiting {selected.hoursWaiting} h, access {selected.accessibility}{selected.vulnerable ? ", vulnerable group" : ""}</p>
              </div>
              <StatusBadge request={selected} />
            </div>
            <p className="mb-3 text-sm">Total score <strong>{selected.score.total}</strong> out of 100</p>
            <ScoreBars score={selected.score} weights={weights} />
            <ul className="mt-4 space-y-1 text-sm">
              {selected.items.map((i) => (
                <li key={i.item} className="flex justify-between">
                  <span>{ITEM_LABEL[i.item]}</span><span>{i.qtyAllocated} of {i.qtyNeeded}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="border-t border-line pt-4">
          <h3 className="mb-3 text-base font-bold">Priority weights</h3>
          {weights && <WeightSliders weights={weights} onChange={onWeights} />}
        </div>
      </aside>
    </div>
  );
}
