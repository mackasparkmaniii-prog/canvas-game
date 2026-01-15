export class SceneManager {
  constructor() {
    this.scenes = {};
    this.current = null;
  }

  add(name, scene) {
    this.scenes[name] = scene;
  }

  goTo(name) {
    this.current = this.scenes[name];
    this.current?.enter?.();
  }

  update(dt, input) {
    this.current?.update?.(dt, input);
  }

  render(ctx) {
    this.current?.render?.(ctx);
  }
}
