import { interval, register, timeout } from 'astal';

export default class HoverHide {
  delay = 1000;
  #stop = false;
  #onComplete = () => {};

  stop() {
    this.#stop = true;
  }

  start() {
    this.#stop = false;
    const timer = timeout(this.delay, () => {
      this.#onComplete();
      check.cancel();
    });
    const check = interval(1, () => {
      if (this.#stop) {
        timer.cancel();
        check.cancel();
      }
    });
  }

  constructor(delay: number, onComplete: () => void) {
    this.delay = delay;
    this.#onComplete = onComplete;
  }
}
