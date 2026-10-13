import { ITEM_LABEL } from "../lib/constants.js";

export default function AllocationTable({ rows, selectedId, onSelect }) {
  if (!rows.length) return <div className="p-6 text-sm text-mute">No recommendation rows yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1320px] border-collapse text-left text-sm">
        <thead className="bg-paper text-xs uppercase tracking-wide text-mute">
          <tr>
            <th className="px-4 py-3">Request</th>
            <th className="px-4 py-3">Supply</th>
            <th className="px-4 py-3">Depot</th>
            <th className="px-4 py-3 text-right">Allocated</th>
            <th className="px-4 py-3 text-right">Unfulfilled</th>
            <th className="px-4 py-3">Fulfilment</th>
            <th className="px-4 py-3">Distance / ETA</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.id} onClick={() => onSelect(row.id)}
              className={`cursor-pointer hover:bg-paper ${selectedId === row.id ? "bg-lime/20" : ""}`}>
              <td className="px-4 py-3 font-semibold">{row.area}</td>
              <td className="px-4 py-3">{ITEM_LABEL[row.item]}</td>
              <td className="px-4 py-3">{row.depotName}</td>
              <td className="px-4 py-3 text-right font-semibold">{row.qty.toLocaleString()}</td>
              <td className={`px-4 py-3 text-right ${row.unfulfilled ? "font-semibold text-crit" : "text-mute"}`}>{row.unfulfilled.toLocaleString()}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-line"><div className="h-full bg-lime-dark" style={{ width: `${row.fulfilmentPct}%` }} /></div>
                  <strong>{row.fulfilmentPct}%</strong>
                </div>
              </td>
              <td className="px-4 py-3 text-mute">{row.distanceKm == null ? "—" : `${row.distanceKm} km · ${row.etaMin} min`}</td>
              <td className="max-w-[280px] px-4 py-3 text-mute"><span className="line-clamp-2">{row.reason}</span></td>
              <td className="px-4 py-3"><span className={`rounded-ui px-2 py-1 text-xs font-semibold capitalize ${row.status === "approved" ? "bg-done/10 text-done" : "bg-paper"}`}>{row.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
