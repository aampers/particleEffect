// Basic setup for HTML Canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set canvas background to black
canvas.style.backgroundColor = "black";

// Particle class to represent spores
class Particle {
  constructor(x, y, size, opacity) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.opacity = opacity;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // Set particles to white
    ctx.fill();
    ctx.closePath();
  }
}

// Animation loop
let frame = 0;

function animate(particles) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame
  ctx.fillStyle = "black"; // Redraw black background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw particles for the current frame
  if (particles[frame]) {
    particles[frame].forEach((particle) => particle.draw(ctx));
  }
  frame = (frame + 1) % particles.length; // Loop through frames
  requestAnimationFrame(() => animate(particles));
}

// Fetch JSON data and build particles
fetch("./particleData.json")
  .then((response) => response.json())
  .then((particleData) => {
    // Extract particle data from JSON
    const positions = particleData.positions;
    const sizes = particleData.sizes;
    const opacities = particleData.opacities;

    // Create particles from JSON data
    const particles = [];
    for (let i = 0; i < positions.length; i++) {
      const frameParticles = positions[i].map((position) => {
				let [x, y] = position;
				
				// Normalize positions to canvas dimensions
        x = (x / 1920) * canvas.width;
        y = (y / 1080) * canvas.height;

        // Adjust size and opacity
        const size = sizes[i] / 10000; // Adjust size scaling
        const opacity = Math.min(opacities[i] / 2, 1);

        return new Particle(x, y, size, opacity);
      });
      particles.push(frameParticles);
    }

    animate(particles);
  })
  .catch((error) => console.error("Error loading particle data:", error));
