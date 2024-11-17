import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const apiKey = process.env.OPEN_AI_KEY;
if (!apiKey) {
  console.error("API Key not found in environment variables. Please check your .env file.");
  process.exit(1); // Exit if API key is missing
}
const openai = new OpenAI({ apiKey });

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(bodyParser.json());

// Generate Challenge Endpoint
app.post("/generate-challenge", async (req, res) => {
  const { game } = req.body;

  if (!game) {
    return res.status(400).json({ error: "Game name is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `
            I am someone who is WAYYY too good at ${game}. I want a challenging way to play the game so that I can have fun again.
            What are some challenges I could do? Pick ONE that you think would be really hard. Keep it to 10 words.
            Keep the challenge reasonable to the type of game and the game itself. Have it be somewhat possible.
          `,
        },
      ],
    });

    // Log OpenAI response for debugging
    console.log("OpenAI Response:", JSON.stringify(completion, null, 2));

    // Safely access the challenge text
    const challenge = completion.choices[0]?.message?.content;

    if (!challenge) {
      throw new Error("Unexpected response structure from OpenAI API");
    }

    res.json({ challenge });
  } catch (error) {
    console.error("Error generating challenge:", error);

    if (error.response) {
      console.error("OpenAI API Error Response:", error.response.data);
    }

    res.status(500).json({ error: error.message || "Something went wrong while generating the challenge." });
  }
});
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
