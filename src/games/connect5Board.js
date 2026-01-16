// src/games/connect5/connect5Board.js

export class Connect5Board {
  constructor(size = 15) {
    this.size = size;
    this.reset();
  }

  reset() {
    this.grid = Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => 0)
    );
    this.lastMove = null; // { row, col }
    this.moveCount = 0;
  }

  get(row, col) {
    return this.grid[row][col];
  }

  isEmpty(row, col) {
    return this.grid[row][col] === 0;
  }

  place(row, col, player) {
    if (row < 0 || col < 0 || row >= this.size || col >= this.size) return false;
    if (!this.isEmpty(row, col)) return false;

    this.grid[row][col] = player;
    this.lastMove = { row, col };
    this.moveCount++;
    return true;
  }

  /**
   * Layout based on canvas size:
   * - Stones placed on grid intersections
   */
  getLayout(ctx) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    const padding = 40;
    const usableW = w - padding * 2;
    const usableH = h - padding * 2;

    // There are (size-1) gaps between intersections.
    const gaps = this.size - 1;
    const cell = Math.floor(Math.min(usableW / gaps, usableH / gaps));

    const boardPx = cell * gaps;

    // Center board
    const ox = Math.floor((w - boardPx) / 2);
    const oy = Math.floor((h - boardPx) / 2);

    // Stone radius
    const r = Math.max(6, Math.floor(cell * 0.38));

    return { ox, oy, cell, boardPx, r };
  }

  /**
   * Convert a pixel position to nearest intersection (row,col).
   * Returns null if click is too far away from an intersection.
   */
  pixelToCell(ctx, x, y) {
    const { ox, oy, cell } = this.getLayout(ctx);

    // Convert to board-space
    const bx = x - ox;
    const by = y - oy;

    const gaps = this.size - 1;
    const boardPx = cell * gaps;

    // Outside board bounds (with small tolerance)
    const tol = cell * 0.5;
    if (bx < -tol || by < -tol || bx > boardPx + tol || by > boardPx + tol) return null;

    const col = Math.round(bx / cell);
    const row = Math.round(by / cell);

    if (row < 0 || col < 0 || row >= this.size || col >= this.size) return null;

    // Distance check: must be near intersection
    const ix = col * cell;
    const iy = row * cell;
    const dx = bx - ix;
    const dy = by - iy;
    const dist2 = dx * dx + dy * dy;

    const maxDist = (cell * 0.45) * (cell * 0.45);
    if (dist2 > maxDist) return null;

    return { row, col };
  }

  draw(ctx) {
    const { ox, oy, cell, boardPx, r } = this.getLayout(ctx);

    // Background for board area
    ctx.save();
    ctx.fillStyle = "#caa46a";
    ctx.fillRect(ox - cell * 0.6, oy - cell * 0.6, boardPx + cell * 1.2, boardPx + cell * 1.2);

    // Grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 1;

    for (let i = 0; i < this.size; i++) {
      const x = ox + i * cell;
      const y = oy + i * cell;

      // vertical
      ctx.beginPath();
      ctx.moveTo(x, oy);
      ctx.lineTo(x, oy + boardPx);
      ctx.stroke();

      // horizontal
      ctx.beginPath();
      ctx.moveTo(ox, y);
      ctx.lineTo(ox + boardPx, y);
      ctx.stroke();
    }

    // Stones
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const v = this.grid[row][col];
        if (v === 0) continue;

        const cx = ox + col * cell;
        const cy = oy + row * cell;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);

        if (v === 1) {
          ctx.fillStyle = "#101010";
          ctx.fill();
        } else {
          ctx.fillStyle = "#f5f5f5";
          ctx.fill();
          ctx.strokeStyle = "rgba(0,0,0,0.25)";
          ctx.stroke();
        }
      }
    }

    // Highlight last move
    if (this.lastMove) {
      const { row, col } = this.lastMove;
      const cx = ox + col * cell;
      const cy = oy + row * cell;

      ctx.strokeStyle = "rgba(255,0,0,0.75)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
