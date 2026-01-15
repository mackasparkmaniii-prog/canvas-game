import { createCanvas } from "./src/engine/canvas.js";
import { startLoop } from "./src/engine/loop.js";
import { Input } from "./src/engine/input.js";
import { SceneManager } from "./src/engine/sceneManager.js";

import { BootScene } from "./src/scenes/bootScene.js";
import { MenuScene } from "./src/scenes/menuScene.js";

// NEW: Connect 5
import { Connect5Scene } from "./src/scenes/connect5/connect5Scene.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

createCanvas(canvas);

const input = new Input(canvas);
const scenes = new SceneManager();

// Register scenes
scenes.add("boot", new BootScene(scenes));
scenes.add("menu", new MenuScene(scenes));
scenes.add("connect5", new Connect5Scene(scenes)); // NEW

// Start at boot
scenes.goTo("boot");

// Run game loop
startLoop(ctx, input, scenes);


