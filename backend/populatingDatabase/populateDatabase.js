const axios = require('axios');
const { MongoClient } = require('mongodb');

// MongoDB connection string (replace with your own)
const uri = "mongodb+srv://laithali004:2012Kareem@cluster0.ozxjl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// RAWG API Key and Endpoint
const apiKey = "1754861a0ab14646861fc73fecd8db9d"; // Replace with your actual API key
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}`;

// Function to fetch data and insert into MongoDB
async function fetchAndInsertGames() {
  const client = new MongoClient(uri);
  try {
    // Fetch data from RAWG API
    const response = await axios.get(apiUrl);
    const games = response.data.results; // Assuming 'results' contains the array of games

    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Get the database and collection
    const db = client.db('gameDB'); // Replace 'gameDB' with your database name
    const collection = db.collection('games');

    // Insert data into the "games" collection
    const formattedGames = games.map(game => ({
      name: game.name,
      genre: game.genres ? game.genres.map(g => g.name).join(", ") : "Unknown",
      description: game.description || "No description available",
      image: game.background_image || "No image available",
    }));
    
    const result = await collection.insertMany(formattedGames);
    console.log(`${result.insertedCount} games inserted`);
  } catch (error) {
    console.error('Error fetching or inserting data:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

// Test MongoDB connection
async function testConnection() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await client.close();
  }
}

// Call the testConnection function and then populate the database
(async () => {
  await testConnection();
  await fetchAndInsertGames();
})();
