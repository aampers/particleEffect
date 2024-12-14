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
    console.log(`Drawing particle at (${this.x}, ${this.y}) with size ${this.size} and opacity ${this.opacity}`);
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black"; // Paint the background black each frame
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
      const frameParticles = positions[i].map(() => {
        const x = Math.random() * canvas.width; // Randomize for testing
        const y = Math.random() * canvas.height;
        const size = 5; // Fixed size for testing
        const opacity = 0.8; // Fixed opacity for testing
        return new Particle(x, y, size, opacity);
      });
      particles.push(frameParticles);
    }

    animate(particles);
  })
  .catch((error) => console.error("Error loading particle data:", error));
