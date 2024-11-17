document.addEventListener("DOMContentLoaded", async () => {
  // Slideshow Functionality
  const slideshow = document.querySelector(".slideshow");

  async function fetchGamesForSlideshow() {
    try {
      const response = await fetch("http://127.0.0.1:5000/games"); // Fetch all games
      if (!response.ok) {
        throw new Error("Failed to fetch games for the slideshow");
      }
  
      const games = await response.json(); // Parse the response
      console.log("Fetched games:", games); // Debugging: Log fetched games
  
      // Populate slideshow dynamically
      games.forEach((game, index) => {
        if (game.image) {
          const slide = document.createElement("div");
          slide.className = "slide";
          if (index === 0) slide.classList.add("active"); // First slide is active by default
          slide.style.backgroundImage = `url('${game.image}')`; // Set slide image
          slideshow.appendChild(slide);
        }
      });
  
      startSlideshow();
    } catch (error) {
      console.error("Error fetching games for slideshow:", error);
    }
  }
  

  function startSlideshow() {
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;

    function showNextSlide() {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }

    if (slides.length > 0) {
      console.log(`${slides.length} slides found. Starting slideshow...`);
      setInterval(showNextSlide, 3000); // Change slide every 3 seconds
    } else {
      console.error("No slides found! Check your database or backend.");
    }
  }

  // Call the function to fetch games and start the slideshow
  await fetchGamesForSlideshow();

  // Search Bar Functionality
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

  // Game Page Functionality
  const urlParams = new URLSearchParams(window.location.search);
  const gameName = urlParams.get("name");

  const gameInfoSection = document.getElementById("game-info-section");
  const errorInfoSection = document.getElementById("error-info-section");
  const challengeOutput = document.getElementById("challenge-output");

  async function fetchGameDetails(gameName) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/games?name=${encodeURIComponent(gameName)}`);
      if (!response.ok) {
        console.error("Game not found:", response.statusText);
        displayError();
        return;
      }
  
      const game = await response.json();
      console.log("Fetched game details:", game); // Debugging: log the game object
      displayGameInfo(game);
    } catch (error) {
      console.error("Error fetching game details:", error);
      displayError();
    }
  }
  function displayGameInfo(game) {
    document.getElementById("game-title").innerText = game.name || "Unknown Game";
    document.getElementById("game-image").src = game.image || "placeholder-image.jpg";
    document.getElementById("game-genre").innerText = game.genre || "No genre available";
  
    gameInfoSection.style.display = "block";
    errorInfoSection.style.display = "none";
  }
  

  function displayError() {
    gameInfoSection.style.display = "none";
    errorInfoSection.style.display = "block";
  }

  if (gameName) {
    await fetchGameDetails(gameName);
  } else {
    displayError();
  }

  // Generate Challenge Functionality
  const generateButton = document.getElementById("generate-button");
  if (generateButton) {
    generateButton.addEventListener("click", async () => {
      const gameTitle = document.getElementById("game-title").innerText;
  
      challengeOutput.innerText = "Generating challenge...";
  
      try {
        const response = await fetch("http://127.0.0.1:5000/generate-challenge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ game: gameTitle }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Challenge data:", data); // Debugging: log the challenge response
          challengeOutput.innerText = data.challenge || "No challenge found.";
        } else {
          const errorData = await response.json();
          console.error("Error generating challenge:", errorData);
          challengeOutput.innerText = errorData.error || "An error occurred.";
        }
      } catch (error) {
        console.error("Error generating challenge:", error);
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
