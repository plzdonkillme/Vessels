import { MapScreen } from "./Map";
import DefaultMap from "./DefaultMap";

export default class Game {
    constructor(width, height) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
    }

    start() {
        document.body.appendChild(this.canvas);
        window.canvas = this.canvas;
        window.map = DefaultMap;
        this.screen = new MapScreen(this.canvas);
        this.screen.setMap(DefaultMap);
        this.screen.start();
    
        this.canvas.addEventListener("click", (e) => {
            const rect = canvas.getBoundingClientRect();
            this.screen.handleClick(e.clientX - rect.left, e.clientY - rect.top);
        });

        this.canvas.addEventListener("mousedown", (e) => {
            const rect = canvas.getBoundingClientRect();
            this.screen.handleMouseDown(e.clientX - rect.left, e.clientY - rect.top);
        });

        this.canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            this.screen.handleMouseMove(e.clientX - rect.left, e.clientY - rect.top);
        });

        this.canvas.addEventListener("mouseup", (e) => {
            const rect = canvas.getBoundingClientRect();
            this.screen.handleMouseUp(e.clientX - rect.left, e.clientY - rect.top);
        });

        this.canvas.addEventListener("mouseleave", (e) => {
            this.screen.handleMouseLeave();
        });

        /*this.loadAssets().then(() => {

            this.canvas.addEventListener("click", (e) => {
                console.log(e);
            });

            this.loadDemo();
        });*/
    }

    loadAssets() {
        let loadingPromise = new Promise((resolve, reject) => {
            resolve();
        });
        return loadingPromise
    }
}