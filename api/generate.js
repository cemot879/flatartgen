// POST /api/generate
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch("https://stablehorde.net/api/v2/generate/async", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": "c5OMyJIimZ2WlhPIK9bVQQ"
    },
    body: JSON.stringify({
      prompt,
      params: {
        width: 384,
        height: 384,
        steps: 10,
        sampler_name: "k_euler",
        cfg_scale: 7,
      },
      nsfw: false,
      slow_workers: true,
      models: ["stable_diffusion", "anything-v4.5"]
    }),
  });

  const data = await response.json();
  res.status(200).json({ jobId: data.id });
}
