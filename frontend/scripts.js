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
