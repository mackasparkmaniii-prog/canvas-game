export function createCanvas(canvas) {
  function resize() {
    const dpr = window.devicePixelRatio || 1;

    // Keep your fixed test size for now (600x400)
    canvas.width = Math.floor(600 * dpr);
    canvas.height = Math.floor(400 * dpr);

    // Make it display at 600x400 CSS pixels
    canvas.style.width = "600px";
    canvas.style.height = "400px";
  }

  window.addEventListener("resize", resize);
  resize();
}
