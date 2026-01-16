// src/games/connect5/connect5Rules.js

function inBounds(size, r, c) {
  return r >= 0 && r < size && c >= 0 && c < size;
}

function countDir(grid, size, r, c, dr, dc, player) {
  let count = 0;
  let rr = r + dr;
  let cc = c + dc;

  while (inBounds(size, rr, cc) && grid[rr][cc] === player) {
    count++;
    rr += dr;
    cc += dc;
  }
  return count;
}

/**
 * Checks if placing `player` at (row, col) creates a win of `winLen`.
 * Returns true/false.
 */
export function checkWin(grid, row, col, player, winLen = 5) {
  const size = grid.length;

  // 4 directions (pairs): horizontal, vertical, diag1, diag2
  const dirs = [
    [0, 1],  // →
    [1, 0],  // ↓
    [1, 1],  // ↘
    [1, -1], // ↙
  ];

  for (const [dr, dc] of dirs) {
    const a = countDir(grid, size, row, col, dr, dc, player);
    const b = countDir(grid, size, row, col, -dr, -dc, player);
    const total = 1 + a + b; // include the placed stone
    if (total >= winLen) return true;
  }

  return false;
}
