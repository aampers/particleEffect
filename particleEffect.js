// Basic setup for HTML Canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
    ctx.closePath();
  }
}

// Animation loop
let frame = 0;
function animate(particles) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (particles[frame]) {
    particles[frame].forEach((particle) => particle.draw(ctx));
  }
  frame = (frame + 1) % particles.length; // Loop through frames
  requestAnimationFrame(animate);
}


// time for the magic to happen. first import our json data
fetch("./particleData.json")
.then((response) => response.json())
.then((particleData) => {

	// Extract particle data from JSON for readability
	const positions = particleData.positions;
	const sizes = particleData.sizes;
	const opacities = particleData.opacities;
	
	// Convert JSON data to Particle instances
	const particles = [];
    for (let i = 0; i < positions.length; i++) {
      const frameParticles = positions[i].map((pos, index) => {
        const [x, y] = pos;
        const size = sizes[i] / 100000; // Adjust size scaling
        const opacity = opacities[i] / 10; // Adjust opacity scaling
        return new Particle(x, y, size, opacity);
      });
      particles.push(frameParticles);
    }

		animate(particles);
  })
  .catch((error) => console.error("Error loading particle data:", error));
