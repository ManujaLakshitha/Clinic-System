//frontend/src/services/api.ts
import type { ParseResponse } from "../types";

const BASE_URL = "http://localhost:8080";

export const processText = async (text: string): Promise<ParseResponse> => {
  const res = await fetch(`${BASE_URL}/process?text=${text}`);
  return res.json();
};

export const getVisits = async () => {
  const res = await fetch(`${BASE_URL}/visits`);
  return res.json();
};

export const getVisitDetails = async (id: number) => {
  const res = await fetch(`${BASE_URL}/visit-details?id=${id}`);
  return res.json();
};

export const deleteVisit = async (id: number) => {
  const res = await fetch(`${BASE_URL}/delete-visit?id=${id}`);
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
};

export const updateVisit = async (id: number, notes: string[]) => {
  const res = await fetch(`${BASE_URL}/update-visit?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  });

  return res.json();
};