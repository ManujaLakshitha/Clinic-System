const BASE_URL = "http://localhost:8080";

export const processText = async (text) => {
  const res = await fetch(`${BASE_URL}/process?text=${text}`);
  return res.json();
};