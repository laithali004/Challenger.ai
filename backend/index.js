import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";
import { MongoClient } from "mongodb";

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const apiKey = process.env.OPEN_AI_KEY;
if (!apiKey) {
  console.error("API Key not found in environment variables. Please check your .env file.");
  process.exit(1); // Exit if API key is missing
}
const openai = new OpenAI({ apiKey });

// MongoDB Connection
const mongoUri = process.env.MONGO_URI; // Ensure your .env file includes MONGO_URI
if (!mongoUri) {
  console.error("MongoDB connection string not found. Please check your .env file.");
  process.exit(1);
}

const mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });

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
    // Connect to MongoDB
    await mongoClient.connect();
    const database = mongoClient.db("gameDB"); // Replace with your actual database name
    const gamesCollection = database.collection("games");

    // Fetch game details from MongoDB
    const gameDetails = await gamesCollection.findOne({ name: new RegExp(`^${game}$`, "i") }); // Case-insensitive match

    if (!gameDetails) {
      return res.status(404).json({ error: `Game "${game}" not found in the database.` });
    }

    console.log("Game found in database:", gameDetails);

    // Generate challenge using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `
            I am someone who is always up for a challenge, currently I would like an interesting challenge for ${gameDetails.name}. It is a ${gameDetails.genre} game.
            I want a challenging way to play so that I can have fun or a difficult interesting challenge. What are some challenges I could do? 
            Make sure it is reasonable based on which game it is. Also try not to be too repetitive when regenerating a challenge.
            Pick ONE that you think would fit my needs. keep it to 20 words.
          `,
        },
      ],
    });

    const challenge = completion.choices[0]?.message?.content;

    if (!challenge) {
      throw new Error("Unexpected response structure from OpenAI API");
    }

    // Return the challenge and game details
    res.json({
      challenge,
      game: {
        name: gameDetails.name,
        genre: gameDetails.genre,
        description: gameDetails.description,
        image: gameDetails.image,
      },
    });
  } catch (error) {
    console.error("Error generating challenge:", error);

    if (error.response) {
      console.error("OpenAI API Error Response:", error.response.data);
    }

    res.status(500).json({ error: error.message || "Something went wrong while generating the challenge." });
  } finally {
    // Close MongoDB connection
    await mongoClient.close();
  }
});
app.get("/games", async (req, res) => {
  const gameName = req.query.name; // Check if a specific game name is requested
  try {
    await mongoClient.connect();
    const database = mongoClient.db("gameDB");
    const gamesCollection = database.collection("games");

    if (gameName) {
      // Fetch a single game by name
      const game = await gamesCollection.findOne({ name: new RegExp(`^${gameName}$`, "i") });
      if (!game) {
        return res.status(404).json({ error: `Game "${gameName}" not found.` });
      }
      res.json(game); // Respond with a single game object
    } else {
      // Fetch all games
      const games = await gamesCollection.find().toArray();
      res.json(games); // Respond with all games
    }
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    await mongoClient.close();
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
