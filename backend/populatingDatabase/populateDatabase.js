const axios = require('axios');
const { MongoClient } = require('mongodb');

// MongoDB connection string (replace with your own)
const uri = "mongodb+srv://lavni:f24ZciII2Wf882nM@challengerai.dnyxi.mongodb.net/?retryWrites=true&w=majority&appName=challengerai+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority";

// The public API endpoint for games (replace this with the actual API)
const apiUrl = "";  // Replace with the actual API URL

// Function to fetch data and insert into MongoDB
async function fetchAndInsertGames() {
    try {
        // Fetch data from the public API
        const response = await axios.get(apiUrl); /////////update to get data correctly
        const games = response.data;  // Assume the API returns an array of games

        // Connect to MongoDB
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB');

        // Get the database and collection
        const db = client.db('<dbname>');  // Replace with your database name
        const collection = db.collection('games');

        // Insert data into the "games" collection
        const result = await collection.insertMany(games);
        console.log(`${result.insertedCount} games inserted`);

        // Close the connection
        await client.close();
    } catch (error) {
        console.error('Error fetching or inserting data:', error);
    }
}

// Call the function to fetch data and insert into MongoDB
fetchAndInsertGames();
