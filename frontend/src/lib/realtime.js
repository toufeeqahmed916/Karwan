import { getDeliveries } from "./api.js";

// Phase 7 stays mock-only. This 2-second poller is also the required fallback
// boundary for Realtime when the delivery backend is connected later.
export function subscribeToDeliveryUpdates({ vehicleId, onData, onConnectionChange }) {
  let stopped = false;

  async function poll() {
    try {
      const deliveries = await getDeliveries(vehicleId);
      if (stopped) return;
      onData(deliveries);
      onConnectionChange?.({ paused: false, mode: "polling" });
    } catch (error) {
      if (stopped) return;
      onConnectionChange?.({ paused: true, mode: "polling", error });
    }
  }

  poll();
  const timer = window.setInterval(poll, 2000);
  return () => {
    stopped = true;
    window.clearInterval(timer);
  };
}
