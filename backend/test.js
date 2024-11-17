const fetch = require("node-fetch");

async function testAPI() {
  const url = "http://127.0.0.1:5000/generate-challenge";
  const body = { game: "The Witcher 3: Wild Hunt" };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

testAPI();
