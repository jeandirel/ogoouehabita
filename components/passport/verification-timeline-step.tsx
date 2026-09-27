import { Icon } from "@/components/ui/icon";
import type { PassportStep } from "@/data/passport-timeline";

export function VerificationTimelineStep({ step }: { step: PassportStep }) {
  return (
    <div className="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-md shadow-sm">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${
          step.validated ? "bg-forest-deep text-on-primary" : "bg-surface-variant text-on-surface-variant"
        }`}
      >
        <Icon name={step.icon} />
      </div>
      <div className="flex flex-col flex-grow gap-1">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-on-surface">{step.title}</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-label-sm font-bold flex items-center gap-1 ${
              step.validated
                ? "bg-primary-fixed text-on-primary-fixed"
                : "bg-surface-variant text-on-surface-variant"
            }`}
          >
            <Icon name={step.validated ? "check" : "remove"} className="text-[14px]" />
            {step.validated ? "Validé" : "Non disponible"}
          </span>
        </div>
        <p className="text-body-sm text-on-surface-variant">{step.description}</p>
        {step.proof && (
          <div className="mt-2 text-body-sm text-primary font-medium flex items-center gap-2 bg-surface p-2 rounded-lg w-fit">
            <Icon name={step.proof.icon} className="text-[16px]" /> {step.proof.text}
          </div>
        )}
      </div>
    </div>
  );
}
