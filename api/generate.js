import fetch from "node-fetch";

const API_KEY = "c5OMyJIimZ2WlhPIK9bVQQ"; // Ganti dengan API key-mu

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  try {
    const response = await fetch("https://stablehorde.net/api/v2/generate/async", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
      },
      body: JSON.stringify({
        prompt,
        params: { width: 384, height: 384, steps: 10, sampler_name: "k_euler", cfg_scale: 7 },
        nsfw: false,
      }),
    });
    const data = await response.json();

    if (data.id) {
      res.status(200).json({ jobId: data.id });
    } else {
      res.status(500).json({ error: "Failed to start generation" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal error" });
  }
}
