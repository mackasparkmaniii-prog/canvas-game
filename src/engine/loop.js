export function startLoop(ctx, input, scenes) {
  let last = performance.now();

  function frame(now) {
    const dt = (now - last) / 1000;
    last = now;

    scenes.update(dt, input);
    scenes.render(ctx);

    input.endFrame();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
