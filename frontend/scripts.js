// Select all slides
let slides = document.querySelectorAll('.slide');
let currentSlide = 0;

// Function to show the next slide
function showNextSlide() {
  // Remove the 'active' class from the current slide
  slides[currentSlide].classList.remove('active');

  // Move to the next slide (loop back to the first if at the end)
  currentSlide = (currentSlide + 1) % slides.length;

  // Add the 'active' class to the new slide
  slides[currentSlide].classList.add('active');
}

// Debugging: Check if slides are detected
if (slides.length > 0) {
  console.log(`${slides.length} slides found. Starting slideshow...`);

  // Start the slideshow
  setInterval(showNextSlide, 3000);
} else {
  console.error("No slides found! Check your HTML structure.");
}
// Handle Search Bar Submit
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-bar");
  const searchInput = document.querySelector("input[name='game-search']");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent default form submission
      const game = searchInput.value.trim();
      if (game) {
        // Redirect to game-specific page
        window.location.href = `game.html?name=${encodeURIComponent(game)}`;
      } else {
        alert("Please enter a game name!");
      }
    });
  }
});
// Populate Game Page with Game Data
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const game = urlParams.get("name");

  if (document.getElementById("game-title")) {
    // Hardcoded game data (replace with dynamic data if available)
    const gameData = {
      "call of duty": {
        image: "BO6.jpg",
        description: "A first-person shooter game known for intense combat.",
      },
      "madden nfl": {
        image: "madden.jpg",
        description: "A football simulation game loved by sports fans.",
      },
      "red dead redemption 2": {
        image: "RDR2.jpg",
        description: "A stunning open-world western adventure.",
      },
    };

    const gameInfo = gameData[game?.toLowerCase()];
    if (gameInfo) {
      document.getElementById("game-title").innerText = game;
      document.getElementById("game-image").src = gameInfo.image;
      document.getElementById("game-description").innerText = gameInfo.description;
    } else {
      document.getElementById("game-title").innerText = "Game Not Found";
      document.getElementById("game-description").innerText =
        "We couldn't find details about this game.";
      document.getElementById("generate-button").style.display = "none";
    }
  }

  // Handle "Generate Challenge" Button
  const generateButton = document.getElementById("generate-button");
  if (generateButton) {
    generateButton.addEventListener("click", async () => {
      const challengeOutput = document.getElementById("challenge-output");
      challengeOutput.innerText = "Generating challenge...";

      try {
        const response = await fetch("http://localhost:5000/generate-challenge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ game }),
        });
        const data = await response.json();
        challengeOutput.innerText = data.challenge || "No challenge found.";
      } catch (error) {
        challengeOutput.innerText = "Error generating challenge. Please try again.";
      }
    });
  }
});
// Handle "Back to Home" Button
document.addEventListener("DOMContentLoaded", () => {
  const backHomeButton = document.getElementById("back-home-button");

  if (backHomeButton) {
    backHomeButton.addEventListener("click", () => {
      // Redirect to the homepage
      window.location.href = "index.html";
    });
  }
});

