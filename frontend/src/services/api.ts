//frontend/src/services/api.ts
import type { ParseResponse, VisitSummary, VisitDetails } from "../types";

const BASE_URL = "http://localhost:8080";
const getToken = () => localStorage.getItem("token");

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
  const res = await fetch(`${BASE_URL}/visits`, {
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getVisitDetails = async (id: number): Promise<VisitDetails> => {
  const res = await fetch(`${BASE_URL}/visit-details?id=${id}`, {
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const deleteVisit = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/delete-visit?id=${id}`, {
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  });
  if (!res.ok) throw new Error(await res.text());
};

export const updateVisit = async (id: number, notes: string[]) => {
  const res = await fetch(`${BASE_URL}/update-visit?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken}`,
    },
    body: JSON.stringify({ notes }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};