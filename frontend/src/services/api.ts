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