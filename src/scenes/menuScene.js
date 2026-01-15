export class MenuScene {
  constructor(scenes) {
    this.scenes = scenes;

    // simple "button" area
    this.button = {
      x: 180,
      y: 200,
      w: 240,
      h: 55,
    };
  }

  update(dt, input) {
    // Keyboard fallback (Enter or Space)
    const startKey =
      input.isKeyDown("Enter") ||
      input.isKeyDown("Return") ||
      input.isKeyDown(" ") ||
      input.isKeyDown("Spacebar");

    // Mouse click detection
    const mx = input.mouse.x;
    const my = input.mouse.y;

    const clickedButton =
      input.mouse.clicked &&
      mx >= this.button.x &&
      mx <= this.button.x + this.button.w &&
      my >= this.button.y &&
      my <= this.button.y + this.button.h;

    // Start game
    if (startKey || clickedButton) {
      this.scenes.goTo("connect5");
    }
  }

  render(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Title
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("ARCADE MENU", 170, 110);

    // Instructions
    ctx.font = "16px Arial";
    ctx.fillText("Press ENTER / SPACE or click Start", 155, 150);

    // Button background
    ctx.fillStyle = "#222";
    ctx.fillRect(this.button.x, this.button.y, this.button.w, this.button.h);

    // Button outline
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.button.x, this.button.y, this.button.w, this.button.h);

    // Button text
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Start (Connect 5)", 205, 235);
  }
}

