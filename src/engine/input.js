export class Input {
  constructor(canvas) {
    this.keys = {};
    this.mouse = { x: 0, y: 0, down: false, clicked: false };

    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener("mousedown", () => {
      this.mouse.down = true;
      this.mouse.clicked = true;
    });

    canvas.addEventListener("mouseup", () => {
      this.mouse.down = false;
    });
  }

  isKeyDown(key) {
    return !!this.keys[key];
  }

  endFrame() {
    this.mouse.clicked = false;
  }
}
