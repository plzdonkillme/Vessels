import DefaultMap from './DefaultMap';
import GameMapScreen from './GameMapScreen';

export default class Game {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.border = '1px solid black';
    this.screen = new GameMapScreen(this.canvas, DefaultMap);

    // Debug
    window.dmap = DefaultMap;
  }

  start() {
    document.body.appendChild(this.canvas);
    this.screen.start();

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.screen.handleClick(e.clientX - rect.left, e.clientY - rect.top);
    });

    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.screen.handleMouseDown(e.clientX - rect.left, e.clientY - rect.top);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.screen.handleMouseMove(e.clientX - rect.left, e.clientY - rect.top);
    });

    this.canvas.addEventListener('mouseup', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.screen.handleMouseUp(e.clientX - rect.left, e.clientY - rect.top);
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.screen.handleMouseLeave();
    });

    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      this.screen.handleKeyDown(e.code);
    });

    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      this.screen.handleKeyUp(e.code);
    });
  }
}
