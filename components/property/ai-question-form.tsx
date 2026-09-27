"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";

export function AiQuestionForm() {
  const [question, setQuestion] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim()) return;
    setSent(true);
  };

  return (
    <div className="bg-surface text-on-surface p-space-md rounded-xl mt-space-md flex flex-col gap-3">
      <div className="flex items-center gap-2 text-body-sm text-on-surface-variant bg-surface-container p-2 rounded-lg">
        <Icon name="lightbulb" className="text-[18px]" />
        Ex: &quot;Quel est le montant des charges de copropriété ?&quot; ou &quot;Le groupe électrogène
        prend-il toute la maison ?&quot;
      </div>
      {sent ? (
        <div className="flex items-center gap-2 text-body-sm text-primary font-medium bg-primary-fixed/30 p-3 rounded-lg">
          <Icon name="check_circle" className="text-[18px]" />
          Question transmise. Ogooué AI et l&apos;agence vous répondront directement dans votre espace
          message.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="w-full bg-sand border border-anthracite/20 px-space-md py-2.5 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
            placeholder="Posez votre question à Ogooué AI..."
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary text-on-primary px-space-md py-2.5 rounded-xl font-label-md hover:bg-forest-deep transition-all shrink-0"
          >
            Envoyer
          </button>
        </form>
      )}
    </div>
  );
}
