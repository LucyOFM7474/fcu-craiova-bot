import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { meci } = req.body;

  if (!meci || meci.trim() === "") {
    return res.status(400).json({ error: "Datele meciului sunt necesare." });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Ești un generator de analize pentru meciuri de fotbal." },
        { role: "user", content: `Analizează meciul: ${meci}` }
      ],
      max_tokens: 500
    });

    res.status(200).json({ analiza: completion.choices[0].message.content });
  } catch (error) {
    console.error("Eroare OpenAI:", error);
    res.status(500).json({ error: "Eroare la generarea analizei." });
  }
}
