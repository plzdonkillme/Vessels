import GameMapScreen from './GameMapScreen';
import { defaultMap3 } from './GameMapDefault';
import { SimpleAI, MinimaxAI, HumanAI } from '../ai/AI';

export default class Game {
  constructor() {
    // TODO: Remove debug
    window.dmap = defaultMap3;

    this.canvas = document.createElement('canvas');
    this.canvas.style.border = '1px solid black';
    this.canvas.width = window.innerWidth - 20;
    this.canvas.height = window.innerHeight - 20;
    const players = {
      0: new HumanAI(),
      1: new MinimaxAI(),
    };
    this.screen = new GameMapScreen(this.canvas, defaultMap3, players);

    // TODO: Remove debug
    window.dscreen = this.screen;
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
