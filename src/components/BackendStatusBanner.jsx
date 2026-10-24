import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function BackendStatusBanner() {
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10_000);

    async function checkBackend() {
      try {
        const result = await api("/heartbeat", {
          auth: false,
          signal: controller.signal,
        });
        if (active) setBackendDown(result?.status !== "ok");
      } catch {
        if (active) setBackendDown(true);
      } finally {
        window.clearTimeout(timeout);
      }
    }

    checkBackend();
    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return backendDown ? (
    <div className="backend-status-banner" role="alert">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10.3 3.9 2.1 18.1A2 2 0 0 0 3.8 21h16.4a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4m0 4h.01" />
      </svg>
      <span><strong>The service is currently unavailable.</strong> Please try again later.</span>
    </div>
  ) : null;
}
