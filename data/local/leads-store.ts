import { createRecordStore } from "@/lib/local-store/record-store";
import { getDeviceOwnerId } from "@/lib/local-store/session";
import type { LeadKind, LeadSubmission } from "@/lib/types";

const leadsStore = createRecordStore<LeadSubmission>("leads");

export function useLeads(kind?: LeadKind): LeadSubmission[] {
  const all = leadsStore.useAll();
  return kind ? all.filter((lead) => lead.kind === kind) : all;
}

export function getLeads(kind?: LeadKind): LeadSubmission[] {
  const all = leadsStore.getAll();
  return kind ? all.filter((lead) => lead.kind === kind) : all;
}

export function insertLead(kind: LeadKind, contact: string, payload: Record<string, string>): LeadSubmission {
  return leadsStore.insert({
    kind,
    contact,
    payload,
    ownerId: getDeviceOwnerId(),
  });
}

export function removeLead(id: string): void {
  leadsStore.remove(id);
}
