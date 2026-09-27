"use client";

import { useMemo, useState } from "react";
import { formatFcfa } from "@/lib/format";

const DURATIONS = [
  { label: "20 ans (240 mois)", months: 240 },
  { label: "15 ans (180 mois)", months: 180 },
  { label: "25 ans (300 mois)", months: 300 },
];

const ANNUAL_RATE = 0.065;
const DEBT_RATIO = 0.35;

function parseAmount(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function LoanSimulator() {
  const [income, setIncome] = useState("2 500 000");
  const [apport, setApport] = useState("25 000 000");
  const [durationMonths, setDurationMonths] = useState(DURATIONS[0].months);

  const { loanCapacity, monthlyPayment } = useMemo(() => {
    const monthlyIncome = parseAmount(income);
    const monthly = monthlyIncome * DEBT_RATIO;
    const monthlyRate = ANNUAL_RATE / 12;
    const annuityFactor = (1 - Math.pow(1 + monthlyRate, -durationMonths)) / monthlyRate;
    return {
      monthlyPayment: Math.round(monthly),
      loanCapacity: Math.round(monthly * annuityFactor),
    };
  }, [income, durationMonths]);

  return (
    <div className="bg-surface-container-low rounded-xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-space-xl items-center shadow-sm">
      <div className="flex flex-col gap-space-sm">
        <span className="text-label-md text-secondary uppercase font-bold tracking-wider">
          Outil Financier
        </span>
        <h2 className="font-headline-lg text-headline-lg text-primary">
          Estimer sa capacité d&apos;achat
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Simulez votre prêt immobilier auprès de nos banques partenaires au Gabon (BGFI, UGB,
          BICIG) en quelques secondes.
        </p>
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label className="text-label-sm font-bold text-on-surface mb-1 block" htmlFor="loan-income">
              Revenu mensuel net (FCFA)
            </label>
            <input
              id="loan-income"
              className="w-full bg-surface p-3 rounded-xl border border-outline-variant/30 text-body-md font-medium focus:outline-none"
              type="text"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>
          <div>
            <label className="text-label-sm font-bold text-on-surface mb-1 block" htmlFor="loan-apport">
              Apport personnel (FCFA)
            </label>
            <input
              id="loan-apport"
              className="w-full bg-surface p-3 rounded-xl border border-outline-variant/30 text-body-md font-medium focus:outline-none"
              type="text"
              value={apport}
              onChange={(e) => setApport(e.target.value)}
            />
          </div>
          <div>
            <label className="text-label-sm font-bold text-on-surface mb-1 block" htmlFor="loan-duration">
              Durée du prêt
            </label>
            <select
              id="loan-duration"
              className="w-full bg-surface p-3 rounded-xl border border-outline-variant/30 text-body-md font-medium focus:outline-none"
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
            >
              {DURATIONS.map((option) => (
                <option key={option.months} value={option.months}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-between gap-6 shadow-md">
        <div>
          <div className="text-label-sm text-primary-fixed uppercase tracking-wider">
            Capacité d&apos;emprunt estimée
          </div>
          <div className="font-headline-xl text-headline-xl text-on-primary mt-2">
            {formatFcfa(loanCapacity)}
          </div>
          <p className="text-body-sm text-primary-fixed-dim mt-1">
            Mensualité estimée : {formatFcfa(monthlyPayment)} / mois
          </p>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-primary-fixed">Taux d&apos;intérêt moyen</span>
            <span className="font-bold text-on-primary">6.5%</span>
          </div>
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-primary-fixed">Frais de notaire estimés</span>
            <span className="font-bold text-on-primary">~8%</span>
          </div>
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-primary-fixed">Apport personnel renseigné</span>
            <span className="font-bold text-on-primary">{formatFcfa(parseAmount(apport))}</span>
          </div>
        </div>
        <a
          href="/connexion"
          className="w-full bg-secondary-fixed text-on-secondary-fixed py-3 rounded-xl font-label-md hover:bg-secondary-fixed-dim transition-all text-center"
        >
          Obtenir mon accord de principe
        </a>
      </div>
    </div>
  );
}
