import fetch from "node-fetch";

const API_KEY = "c5OMyJIimZ2WlhPIK9bVQQ"; // Ganti dengan API key-mu

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const jobId = req.query.jobId;
  if (!jobId) return res.status(400).json({ error: "jobId is required" });

  try {
    const response = await fetch(`https://stablehorde.net/api/v2/generate/status/${jobId}`, {
      headers: {
        apikey: API_KEY,
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal error" });
  }
}
