//frontend/src/services/api.ts
import type { ParseResponse, VisitSummary, VisitDetails } from "../types";

const BASE_URL = "http://localhost:8080";

export const processText = async (text: string): Promise<ParseResponse> => {
  const res = await fetch(`${BASE_URL}/process?text=${encodeURIComponent(text)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getBill = async (visitId: number): Promise<{ total: number }> => {
  const res = await fetch(`${BASE_URL}/bill?visit_id=${visitId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getVisits = async (): Promise<VisitSummary[]> => {
  const res = await fetch(`${BASE_URL}/visits`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getVisitDetails = async (id: number): Promise<VisitDetails> => {
  const res = await fetch(`${BASE_URL}/visit-details?id=${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const deleteVisit = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/delete-visit?id=${id}`);
  if (!res.ok) throw new Error(await res.text());
};

export const updateVisit = async (id: number, notes: string[]) => {
  const res = await fetch(`${BASE_URL}/update-visit?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};