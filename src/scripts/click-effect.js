// A list of all possible colors
const COLORS = ["red", "blue", "green", "yellow", "pink", "purple"];
// Defines the particle number
const PARTICLES_NUMBER = 10;

function createParticle(x, y) {
  const element = document.createElement("div");
  element.style.width = "15px";
  element.style.height = "15px";
  element.style.borderRadius = "50%";
//   element.style.border = "1px solid black";
  // The elements are in absolute position
  element.style.position = "fixed"; // Change to fixed to avoid affecting document flow
  element.style.top = `${y}px`;
  element.style.left = `${x}px`;
  // We want our cursor to be centered in the square
  element.style.transform = "translate(-50%, -50%)";
  // Get a color randomly
  element.style.backgroundColor =
    COLORS[Math.floor(Math.random() * COLORS.length)];

  const animation = element.animate(
    [
      {
        // Math.random() - 0.5 returns a number between -0.5 and 0.5
        transform: `translate(${(Math.random() - 0.5) * 500}px, ${
          (Math.random() - 0.5) * 500
        }px) rotate(${Math.random() * 520}deg)`,
        // We want to reduce the opacity until 0
        opacity: 0
      }
    ],
    1500
  );

  // Remove the particle at the end of animation
  animation.finished.then(() => element.remove());

  document.body.appendChild(element);
}

document.addEventListener("click", (e) => {
  // Get the position of the cursor in the document
  const { clientX: x, clientY: y } = e;

  // Create multiple particles
  for (let i = 0; i < PARTICLES_NUMBER; i++) {
    createParticle(x, y);
  }
});