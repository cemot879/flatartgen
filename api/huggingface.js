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
      const err = await response.json();
      return res.status(response.status).json({ error: err.error || "Unknown error" });
    }

    const json = await response.json();

    // json biasanya berisi array gambar base64 (bisa berbeda tergantung model)
    // Contoh: json = [{ generated_image: "base64string" }]
    // Atau json bisa langsung base64 string

    let base64Image;

    if (Array.isArray(json) && json[0]?.generated_image) {
      base64Image = json[0].generated_image;
    } else if (typeof json === "string") {
      base64Image = json;
    } else if (json.generated_image) {
      base64Image = json.generated_image;
    } else {
      return res.status(500).json({ error: "Format response tidak dikenali" });
    }

    res.status(200).json({ image: base64Image });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
