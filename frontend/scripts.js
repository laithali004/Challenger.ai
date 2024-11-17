// SLIDESHOW FUNCTIONALITY
let slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showNextSlide() {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}

if (slides.length > 0) {
  console.log(`${slides.length} slides found. Starting slideshow...`);
  setInterval(showNextSlide, 3000);
} else {
  console.error("No slides found! Check your HTML structure.");
}

// SEARCH BAR FUNCTIONALITY
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-bar");
  const searchInput = document.querySelector("input[name='game-search']");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const game = searchInput.value.trim();
      if (game) {
        window.location.href = `game.html?name=${encodeURIComponent(game)}`;
      } else {
        alert("Please enter a game name!");
      }
    });
  }

  // GAME PAGE FUNCTIONALITY
  const urlParams = new URLSearchParams(window.location.search);
  const game = urlParams.get("name")?.toLowerCase();

  const gameInfoSection = document.getElementById("game-info-section");
  const errorInfoSection = document.getElementById("error-info-section");
  const challengeOutput = document.getElementById("challenge-output");

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

  const gameInfo = gameData[game];
  if (gameInfo) {
    document.getElementById("game-title").innerText = game;
    document.getElementById("game-image").src = gameInfo.image;
    document.getElementById("game-description").innerText = gameInfo.description;

    gameInfoSection.style.display = "block";
    errorInfoSection.style.display = "none";
  } else {
    gameInfoSection.style.display = "none";
    errorInfoSection.style.display = "block";
  }

  // GENERATE CHALLENGE FUNCTIONALITY
  const generateButton = document.getElementById("generate-button");
  if (generateButton) {
    generateButton.addEventListener("click", async () => {
      const gameTitle = document.getElementById("game-title").innerText;

      console.log("Game title:", gameTitle); // Debugging

      challengeOutput.innerText = "Generating challenge...";

      try {
        const response = await fetch("http://127.0.0.1:5000/generate-challenge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ game: gameTitle }),
        });

        if (response.ok) {
          const data = await response.json();
          challengeOutput.innerText = data.challenge || "No challenge found.";
        } else {
          const errorData = await response.json();
          challengeOutput.innerText = errorData.error || "An error occurred.";
        }
      } catch (error) {
        console.error(error);
        challengeOutput.innerText = "Error generating challenge. Please try again.";
      }
    });
  }

  const backHomeButton = document.getElementById("back-home-button");
  if (backHomeButton) {
    backHomeButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});
