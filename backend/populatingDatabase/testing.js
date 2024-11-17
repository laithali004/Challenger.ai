const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://lavni:f24ZciII2Wf882nM@challengerai.dnyxi.mongodb.net/?retryWrites=true&w=majority&appName=challengerai";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("gameDB");
    const collection = database.collection("games");

    // Example: Insert a game
    await collection.insertOne({ title: "Game Name", genre: "Adventure", platform: "Platforms"});
    console.log("Game inserted successfully!");
  } finally {
    await client.close();
  }
}


run().catch(console.dir);
