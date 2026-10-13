import { useEffect, useState } from "react";
import AllocationTable from "../components/AllocationTable.jsx";
import BaselineCard from "../components/BaselineCard.jsx";
import MapView from "../components/MapView.jsx";
import RouteLayer from "../components/RouteLayer.jsx";
import {
  approveAllocation, generateAllocation, getAllocation, getCoordinatorOverview, getRoute,
} from "../lib/api.js";

export default function AllocationPage() {
  const [plan, setPlan] = useState(null);
  const [overview, setOverview] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [route, setRoute] = useState(null);

  useEffect(() => {
    Promise.all([getCoordinatorOverview(), getAllocation()])
      .then(([overviewData, savedRows]) => {
        setOverview(overviewData);
        if (savedRows.length) {
          setPlan({ rows: savedRows, summary: null, baseline: null });
          setApproved(true);
          setSelectedId(savedRows[0].id);
        }
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const row = plan?.rows.find((entry) => entry.id === selectedId);
    if (!row?.depotId || !row.requestId) {
      setRoute(null);
      return;
    }
    getRoute(row.depotId, row.requestId).then(setRoute).catch(() => setRoute(null));
  }, [plan, selectedId]);

  async function generate() {
    setWorking(true);
    setError("");
    setNotice("");
    try {
      const result = await generateAllocation();
      setPlan(result);
      setSelectedId(result.rows[0]?.id ?? null);
      setApproved(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorking(false);
    }
  }

  async function approve() {
    setWorking(true);
    setError("");
    setNotice("");
    try {
      const result = await approveAllocation({ all: true });
      setPlan((current) => ({ ...current, rows: current.rows.map((row) => ({ ...row, status: "approved" })) }));
      setApproved(true);
      setNotice(`${result.approved} allocation rows approved. Stock and request statuses were updated.`);
      setOverview(await getCoordinatorOverview());
    } catch (requestError) {
      setError(requestError.code === "INSUFFICIENT_STOCK"
        ? "Inventory changed after generation. Regenerate the plan before approving."
        : requestError.message);
    } finally {
      setWorking(false);
    }
  }

  if (loading) return <p className="p-6 text-mute">Loading allocation workspace...</p>;

  const selected = plan?.rows.find((row) => row.id === selectedId);
  const request = overview?.requests.find((entry) => entry.id === selected?.requestId);
  const depot = overview?.depots.find((entry) => entry.id === selected?.depotId);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-mute">Phase 4 · Recommendation workspace</p>
            <h1 className="mt-1 text-3xl font-extrabold">Resource allocation</h1>
            <p className="mt-1 text-sm text-mute">Generate, inspect and approve a transparent supply plan.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={generate} disabled={working}>{plan ? "Regenerate" : "Generate allocation"}</button>
            <button className="btn-lime" onClick={approve} disabled={working || !plan?.rows.length || approved}>{working ? "Working..." : approved ? "Approved" : "Approve all"}</button>
          </div>
        </div>

        {error && <p role="alert" className="mb-4 rounded-ui border border-crit/20 bg-crit/10 px-4 py-3 text-sm text-crit">{error}</p>}
        {notice && <p role="status" className="mb-4 rounded-ui border border-done/20 bg-done/10 px-4 py-3 text-sm text-done">{notice}</p>}

        {!plan ? (
          <section className="panel flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-2xl font-extrabold">↗</span>
            <h2 className="mt-4 text-2xl font-bold">Ready to build a relief plan</h2>
            <p className="mt-2 max-w-lg text-sm text-mute">The mock optimizer will consider priority, stock, depot capacity, vehicles and distance without changing inventory.</p>
            <button className="btn-primary mt-5" onClick={generate} disabled={working}>{working ? "Generating..." : "Generate allocation"}</button>
          </section>
        ) : (
          <>
            {plan.summary && (
              <div className="mb-4 grid gap-4 xl:grid-cols-[1fr_420px]">
                <section className="panel grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
                  <div><p className="text-sm text-mute">Overall fulfilment</p><strong className="mt-1 block text-3xl">{plan.summary.overallFulfilmentPct}%</strong></div>
                  <div><p className="text-sm text-mute">Critical fulfilment</p><strong className="mt-1 block text-3xl">{plan.summary.criticalFulfilmentPct}%</strong></div>
                  <div><p className="text-sm text-mute">Allocated units</p><strong className="mt-1 block text-3xl">{plan.summary.totalAllocated.toLocaleString()}</strong></div>
                  <div><p className="text-sm text-mute">Needed units</p><strong className="mt-1 block text-3xl">{plan.summary.totalNeeded.toLocaleString()}</strong></div>
                </section>
                <BaselineCard summary={plan.summary} baseline={plan.baseline} />
              </div>
            )}

            <section className="panel mb-4 overflow-hidden">
              <div className="border-b border-line px-5 py-4">
                <h2 className="text-lg font-bold">Recommended allocations</h2>
                <p className="mt-1 text-sm text-mute">Click a row to inspect its reason and estimated route.</p>
              </div>
              <AllocationTable rows={plan.rows} selectedId={selectedId} onSelect={setSelectedId} />
            </section>

            {selected && (
              <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
                <section className="panel p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-mute">Why this recommendation</p>
                  <h2 className="mt-1 text-xl font-bold">{selected.area} · {selected.depotName}</h2>
                  <p className="mt-3 text-sm leading-6">{selected.reason}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-3 rounded-panel bg-paper p-4 text-sm">
                    <div><dt className="text-mute">Vehicle</dt><dd className="font-semibold">{selected.vehicleId || "Not assigned"}</dd></div>
                    <div><dt className="text-mute">Remaining need</dt><dd className="font-semibold">{selected.unfulfilled.toLocaleString()} units</dd></div>
                    <div><dt className="text-mute">Distance</dt><dd className="font-semibold">{selected.distanceKm == null ? "Unavailable" : `${selected.distanceKm} km`}</dd></div>
                    <div><dt className="text-mute">ETA</dt><dd className="font-semibold">{selected.etaMin == null ? "Unavailable" : `${selected.etaMin} min`}</dd></div>
                  </dl>
                </section>
                <section className="panel overflow-hidden">
                  <div className="border-b border-line px-4 py-3">
                    <h2 className="font-bold">Route preview</h2>
                    <p className="text-xs text-mute">Dashed lines indicate the mock estimated-route fallback.</p>
                  </div>
                  <div className="h-[340px]">
                    <MapView requests={request ? [request] : []} depots={depot ? [depot] : []} selectedId={request?.id}>
                      <RouteLayer routes={route ? [route] : []} selectedId={request?.id} />
                    </MapView>
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
