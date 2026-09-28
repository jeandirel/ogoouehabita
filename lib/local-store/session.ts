const DEVICE_ID_KEY = "ogooue-habitat:device-id";

/**
 * Anonymous, per-device identifier — not a login. Every record created
 * locally (published listing, lead submission, ...) is stamped with this
 * so real owner relations exist from day one, without fabricating an
 * auth session (see components/auth/login-form.tsx, signup-form.tsx,
 * which stay honest "demo environment" forms).
 */
export function getDeviceOwnerId(): string {
  if (typeof window === "undefined") return "server";
  const existing = window.localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}
