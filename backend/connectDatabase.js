const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://laithali004:MONGO@cluster0.ozxjl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function getGameByName(gameName) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("gameDB");
    const collection = database.collection("games");

    const game = await collection.findOne({ name: gameName });
    if (!game) {
      console.log("Game not found in the database.");
      return null;
    }

    console.log("Game found:", game);
    return game;
  } catch (error) {
    console.error("Error fetching game:", error);
  } finally {
    await client.close();
  }
}