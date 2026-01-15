export class BootScene {
  constructor(scenes) {
    this.scenes = scenes;
  }

  enter() {
    // Later: preload assets here
    this.scenes.goTo("menu");
  }
}
