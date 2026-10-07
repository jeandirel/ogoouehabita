"use client";

import { useEffect, useState, type FormEvent } from "react";

type Setup = { enabled: boolean; verified?: boolean; secret?: string; uri?: string; error?: string };

export function AdminMfaForm() {
  const [setup, setSetup] = useState<Setup | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void fetch("/api/auth/admin-mfa/setup").then(async (response) => {
      const result = await response.json() as Setup;
      setSetup(response.ok ? result : { enabled: false, error: result.error ?? "Configuration indisponible." });
    }).catch(() => setSetup({ enabled: false, error: "Configuration indisponible." }));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null); setPending(true);
    try {
      const endpoint = setup?.enabled ? "/api/auth/admin-mfa/verify" : "/api/auth/admin-mfa/setup";
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) { setError(result.error ?? "Code refusé."); return; }
      setSetup({ enabled: true, verified: true }); setCode("");
    } catch { setError("Vérification indisponible."); }
    finally { setPending(false); }
  };

  if (!setup) return <p className="text-body-md text-on-surface-variant">Chargement de la sécurité…</p>;
  if (setup.error) return <p role="alert" className="text-body-md text-error">{setup.error}</p>;
  if (setup.enabled && setup.verified) return <p className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-body-md text-primary">Second facteur activé et vérifié pour cette session.</p>;

  return <div className="flex flex-col gap-space-lg">
    {!setup.enabled && <div className="flex flex-col gap-3">
      <p className="text-body-md text-on-surface-variant">Ajoutez un compte TOTP dans votre application d’authentification, puis confirmez avec le code à six chiffres. Le second facteur ne sera activé qu’après cette confirmation.</p>
      <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-4">
        <p className="text-label-md font-bold text-on-surface">Clé de configuration manuelle</p>
        <code className="mt-2 block break-all text-body-md text-primary">{setup.secret}</code>
        <details className="mt-3"><summary className="cursor-pointer text-label-md text-primary">Afficher l’URI pour générer un QR localement</summary><code className="mt-2 block break-all text-body-sm text-on-surface-variant">{setup.uri}</code></details>
      </div>
    </div>}
    {setup.enabled && <p className="text-body-md text-on-surface-variant">Saisissez le code actuel de votre application d’authentification pour renforcer cette session.</p>}
    <form onSubmit={submit} className="flex max-w-sm flex-col gap-space-md">
      <label className="flex flex-col gap-1.5"><span className="text-label-md font-bold text-on-surface">Code à six chiffres</span><input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="rounded-xl border border-outline-variant/40 bg-surface-container-low px-space-md py-3 text-body-md focus:border-ogooue-blue focus:outline-none" /></label>
      {error && <p role="alert" className="text-body-sm text-error">{error}</p>}
      <button type="submit" disabled={pending} className="rounded-xl bg-primary py-3 font-label-md text-on-primary shadow-sm transition-all hover:bg-forest-deep disabled:opacity-60">{pending ? "Vérification…" : setup.enabled ? "Vérifier cette session" : "Activer le second facteur"}</button>
    </form>
  </div>;
}
