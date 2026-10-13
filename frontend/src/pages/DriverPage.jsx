import { useEffect, useMemo, useState } from "react";
import MapView from "../components/MapView.jsx";
import RouteLayer from "../components/RouteLayer.jsx";
import TruckLayer from "../components/TruckLayer.jsx";
import { completeDelivery, getCoordinatorOverview, getDeliveries, startDeliveries } from "../lib/api.js";
import { subscribeToDeliveryUpdates } from "../lib/realtime.js";
import { ITEM_LABEL } from "../lib/constants.js";

export default function DriverPage() {
  const [overview, setOverview] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [connection, setConnection] = useState({ paused: false, mode: "polling" });
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCoordinatorOverview().then(setOverview).catch((requestError) => setError(requestError.message));
    return subscribeToDeliveryUpdates({
      onData(data) {
        setDeliveries(data);
        setVehicleId((current) => current || data[0]?.vehicleId || "");
        setLoading(false);
      },
      onConnectionChange: setConnection,
    });
  }, []);

  const vehicles = useMemo(() => [...new Map(deliveries.map((delivery) => [delivery.vehicleId, delivery])).values()], [deliveries]);
  const delivery = deliveries.find((entry) => entry.vehicleId === vehicleId) || deliveries[0];
  const request = overview?.requests.find((entry) => entry.id === delivery?.requestId);
  const depot = overview?.depots.find((entry) => entry.id === delivery?.depotId);
  const route = delivery ? {
    depotId: delivery.depotId,
    requestId: delivery.requestId,
    polyline: delivery.route,
    distanceKm: delivery.distanceKm,
    durationMin: delivery.etaMin,
    estimated: true,
  } : null;

  async function refresh() {
    setDeliveries(await getDeliveries());
    setOverview(await getCoordinatorOverview());
  }

  async function startTrip() {
    setWorking(true);
    setError("");
    try {
      await startDeliveries({ allocationIds: [delivery.allocationId] });
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorking(false);
    }
  }

  async function markDelivered() {
    setWorking(true);
    setError("");
    try {
      await completeDelivery(delivery.allocationId);
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorking(false);
    }
  }

  if (loading) return <p className="p-6 text-mute">Loading assigned delivery...</p>;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-mute">Phase 7 · Driver operations</p>
            <h1 className="mt-1 text-3xl font-extrabold">Delivery run</h1>
            <p className="mt-1 text-sm text-mute">Follow the route, update the trip and confirm arrival.</p>
          </div>
          {!!vehicles.length && (
            <label className="text-sm">Assigned vehicle
              <select className="field mt-1 min-w-48" value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}>
                {vehicles.map((entry) => <option key={entry.vehicleId} value={entry.vehicleId}>{entry.vehicleId} · {entry.area}</option>)}
              </select>
            </label>
          )}
        </div>

        {connection.paused && <p role="alert" className="mb-4 rounded-ui border border-wait bg-wait/10 px-4 py-3 text-sm">Live updates paused. Retrying automatically every 2 seconds.</p>}
        {error && <p role="alert" className="mb-4 rounded-ui border border-crit/20 bg-crit/10 px-4 py-3 text-sm text-crit">{error}</p>}

        {!delivery ? (
          <section className="panel p-8 text-center"><h2 className="text-xl font-bold">No delivery assigned</h2><p className="mt-2 text-sm text-mute">Approve an allocation to create a driver load.</p></section>
        ) : (
          <div className="grid items-start gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
            <section className="panel overflow-hidden">
              <div className="border-b border-line p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-xs font-semibold uppercase tracking-wider text-mute">Destination</p><h2 className="mt-1 text-2xl font-bold">{delivery.area}</h2></div>
                  <span className={`rounded-ui px-2 py-1 text-xs font-semibold capitalize ${delivery.status === "delivered" ? "bg-done/10 text-done" : delivery.status === "in_transit" ? "bg-transit/10 text-transit" : "bg-paper"}`}>{delivery.status.replace("_", " ")}</span>
                </div>
                <p className="mt-2 text-sm text-mute">From {delivery.depotName} · {delivery.distanceKm} km · {delivery.etaMin} min</p>
              </div>

              <div className="p-5">
                <div className="flex justify-between text-sm"><span className="text-mute">Trip progress</span><strong>{delivery.progressPct}%</strong></div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-line"><div className={`h-full rounded-full transition-all ${delivery.status === "delivered" ? "bg-done" : "bg-transit"}`} style={{ width: `${delivery.progressPct}%` }} /></div>

                <h3 className="mt-5 font-bold">Load</h3>
                <ul className="mt-2 divide-y divide-line rounded-ui border border-line">
                  {delivery.items.map((item) => <li key={item.item} className="flex justify-between px-3 py-2 text-sm"><span>{ITEM_LABEL[item.item]}</span><strong>{item.qty} units</strong></li>)}
                </ul>

                <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  <button className="btn-primary w-full" onClick={startTrip} disabled={working || delivery.status !== "approved"}>Start trip</button>
                  <button className="btn-lime w-full" onClick={markDelivered} disabled={working || delivery.status !== "in_transit"}>Mark delivered</button>
                </div>
                <p className="mt-3 text-center text-xs text-mute">Updates every 2 seconds · {connection.mode} fallback active</p>
              </div>
            </section>

            <section className="panel overflow-hidden">
              <div className="border-b border-line px-4 py-3"><h2 className="font-bold">Route and truck position</h2><p className="text-xs text-mute">The truck marker moves while the trip is active.</p></div>
              <div className="h-[520px] min-h-[420px]">
                <MapView requests={request ? [request] : []} depots={depot ? [depot] : []} selectedId={request?.id}>
                  <RouteLayer routes={route ? [route] : []} selectedId={request?.id} />
                  <TruckLayer deliveries={[delivery]} />
                </MapView>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
