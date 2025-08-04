export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const HF_TOKEN = process.env.HF_TOKEN;
  const { prompt } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: { wait_for_model: true }
        }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      return res.status(response.status).json({ error: errorResponse.error || "Unknown error" });
    }

    const result = await response.json();

    // Output bisa bermacam-macam tergantung model
    let base64Image = null;

    if (Array.isArray(result)) {
      base64Image = result[0]?.image || result[0]?.generated_image;
    } else if (typeof result === "string") {
      base64Image = result;
    }

    if (!base64Image) {
      return res.status(500).json({ error: "No image returned from model." });
    }

    res.status(200).json({ image: base64Image });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
