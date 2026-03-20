//frontend/src/services/api.ts
import type { ParseResponse } from "../types";

const BASE_URL = "http://localhost:8080";

export const processText = async (text: string): Promise<ParseResponse> => {
  const res = await fetch(`${BASE_URL}/process?text=${text}`);
  return res.json();
};

export const getVisits = async () => {
  const res = await fetch("http://localhost:8080/visits");
  return res.json();
};

export const getVisitDetails = async (id: number) => {
  const res = await fetch(`http://localhost:8080/visit-details?id=${id}`);
  return res.json();
};

export const deleteVisit = async (id: number) => {
  const res = await fetch(`http://localhost:8080/delete-visit?id=${id}`);
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
};