// src/games/connect5/connect5Rules.js

function inBounds(rows, cols, r, c) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

function countDir(grid, rows, cols, r, c, dr, dc, player) {
  let count = 0;
  let rr = r + dr;
  let cc = c + dc;

  while (inBounds(rows, cols, rr, cc) && grid[rr][cc] === player) {
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
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  // Safety guards (prevents weird crashes if called with bad coords)
  if (rows === 0 || cols === 0) return false;
  if (!inBounds(rows, cols, row, col)) return false;
  if (!grid[row] || grid[row][col] !== player) return false;

  // 4 directions (pairs): horizontal, vertical, diag1, diag2
  const dirs = [
    [0, 1],  // →
    [1, 0],  // ↓
    [1, 1],  // ↘
    [1, -1], // ↙
  ];

  for (const [dr, dc] of dirs) {
    const a = countDir(grid, rows, cols, row, col, dr, dc, player);
    const b = countDir(grid, rows, cols, row, col, -dr, -dc, player);
    const total = 1 + a + b; // include the placed stone
    if (total >= winLen) return true;
  }

 return false;
}

/**
 * Returns true if there are no empty cells remaining.
 * NOTE: default empty cell is 0. If you use null/"." etc, pass that value.
 */
export function checkDraw(
grid, emptyValue = 0) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  if (rows === 0 || cols === 0) return false;

  for (let r = 0; r < rows; r++) {
    const row = grid[r];
    for (let c = 0; c < cols; c++) {
      if (row[c] === emptyValue) return false;
    }
  }

  return true;
}