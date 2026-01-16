// ===== connect5Scene.js (CHUNK 1/6) =====
// src/games/connect5/connect5Scene.js

import { Connect5Board } from "./connect5Board.js";
import { checkWin } from "./connect5Rules.js";

export class Connect5Scene {
  constructor(scenes) {
    this.scenes = scenes;

    this.board = new Connect5Board(15);
    this.currentPlayer = 1; // 1 black, 2 white
    this.winner = 0;        // 0 none, 1 black, 2 white, 3 draw
    this.gameOver = false;

    this.status = "Click to place. First to 5 in a row wins.";

    this._ctx = null;
    this._attached = false;

    this._onKeyDown = (e) => this.onKeyDown(e);
    this._onMouseDown = (e) => this.onMouseDown(e);
  }

  enter() {
    window.addEventListener("keydown", this._onKeyDown);
    // mouse attaches lazily in render(ctx)
  }

  exit() {
    window.removeEventListener("keydown", this._onKeyDown);
    if (this._ctx?.canvas) {
      this._ctx.canvas.removeEventListener("mousedown", this._onMouseDown);
    }
    this._attached = false;
    this._ctx = null;
  }
// ===== connect5Scene.js (CHUNK 2/6) =====
  onKeyDown(e) {
    const key = (e.key || "").toLowerCase();

    if (key === "escape") {
      this.scenes.setActive("menu");
      return;
    }

    if (key === "r") {
      this.resetGame();
      return;
    }
  }

  resetGame() {
    // reset board using whatever API your board has
    if (typeof this.board.reset === "function") {
      this.board.reset();
    } else if (this.board.grid) {
      for (let r = 0; r < this.board.grid.length; r++) {
        this.board.grid[r].fill(0);
      }
    }

    this.currentPlayer = 1;
    this.winner = 0;
    this.gameOver = false;
    this.status = "Click to place. First to 5 in a row wins.";
  }

  // Try to locate the board's underlying 2D array
  _getGrid() {
    return this.board.grid || this.board.cells || this.board.board || null;
  }
// ===== connect5Scene.js (CHUNK 3/6) =====
  isBoardFull() {
    const grid = this._getGrid();
    if (!grid) {
      console.warn(
        "Draw check failed: couldn't find grid (expected board.grid, board.cells, or board.board)."
      );
      return false;
    }

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === 0) return false;
      }
    }
    return true;
  }

  // Convert mouse event -> board cell (row/col)
  // This tries common patterns. Your existing project likely already has this,
  // but this version is flexible and should still work.
  _eventToCell(e) {
    const canvas = this._ctx?.canvas;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // If board exposes a helper, use it
    if (typeof this.board.pixelToCell === "function") {
      return this.board.pixelToCell(x, y, this._ctx);
    }
    if (typeof this.board.screenToCell === "function") {
      return this.board.screenToCell(x, y, this._ctx);
    }

    // Fallback: assume board has layout info we can read
    const layout = this.board.layout || this.board._layout || null;
    if (!layout) return null;

    const col = Math.floor((x - layout.x) / layout.cell);
    const row = Math.floor((y - layout.y) / layout.cell);
    return { row, col };
  }
// ===== connect5Scene.js (CHUNK 4/6) =====
  onMouseDown(e) {
    if (this.gameOver) return;

    const cell = this._eventToCell(e);
    if (!cell) return;

    const { row, col } = cell;

    // bounds check if we can infer size
    const grid = this._getGrid();
    if (grid) {
      if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length) return;
      if (grid[row][col] !== 0) return; // can't overwrite
      grid[row][col] = this.currentPlayer; // place stone
    } else if (typeof this.board.place === "function") {
      // alternate API
      const placed = this.board.place(row, col, this.currentPlayer);
      if (!placed) return;
    } else {
      return; // no way to place a move
    }

    // WIN CHECK (your rules module)
    // Support common signatures: checkWin(grid, row, col, player) OR checkWin(board, row, col, player)
    let won = false;
    try {
      if (grid) won = !!checkWin(grid, row, col, this.currentPlayer);
      else won = !!checkWin(this.board, row, col, this.currentPlayer);
    } catch (err) {
      // If your checkWin expects a different signature, it'll throw here.
      // In that case, paste your original win-check call back in this spot.
      console.warn("checkWin signature mismatch. Restore your original win-check call here.", err);
    }

    if (won) {
      this.winner = this.currentPlayer;
      this.gameOver = true;
      this.status =
        (this.winner === 1 ? "Black" : "White") + " wins! Press R to reset.";
      return;
    }

    // DRAW CHECK
    if (this.isBoardFull()) {
      this.winner = 3;
      this.gameOver = true;
      this.status = "Draw — board full. Press R to reset.";
      return;
    }

    // Next player's turn
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }
// ===== connect5Scene.js (CHUNK 5/6) =====
  update(dt) {
    // If you already have hover logic in your project, keep it in your board/render.
    // Phase 1 doesn't require update() to do anything.
  }

  render(ctx) {
    // Store ctx for event mapping / listener attach
    this._ctx = ctx;

    // Attach mouse listener once
    if (!this._attached && ctx?.canvas) {
      ctx.canvas.addEventListener("mousedown", this._onMouseDown);
      this._attached = true;
    }

    // Clear screen
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // If your board has its own render method, use it
    if (typeof this.board.render === "function") {
      this.board.render(ctx);
    } else if (typeof this.board.draw === "function") {
      this.board.draw(ctx);
    } else {
      // If your previous version drew the board here, paste it back.
      // This scene file focuses on rules/state (win/draw/gameOver).
    }

    // UI text
    ctx.save();
    ctx.font = "16px sans-serif";
    ctx.textBaseline = "top";

    const turnText =
      this.winner === 0
        ? `Turn: ${this.currentPlayer === 1 ? "Black" : "White"}`
        : this.winner === 3
        ? "Result: Draw"
        : `Winner: ${this.winner === 1 ? "Black" : "White"}`;

    ctx.fillText(turnText, 40, 40);
    ctx.fillText(this.status, 40, 62);
    ctx.fillText("R = reset | ESC = menu", 40, ctx.canvas.height - 40);

    ctx.restore();
  }
// ===== connect5Scene.js (CHUNK 6/6) =====
} // end class
