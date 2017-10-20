import { MapScreen } from "./MapScreen";
import DefaultMap from "./DefaultMap";

export default class Game {
    constructor(width, height) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
    }

    start() {
        document.body.appendChild(this.canvas);
        this.screen = new MapScreen(this.canvas, DefaultMap);
        this.screen.start();
        window.dmap = DefaultMap;
    
        this.canvas.addEventListener("click", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.screen.handleClick(e.clientX - rect.left, e.clientY - rect.top);
        });

        this.canvas.addEventListener("mousedown", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.screen.handleMouseDown(e.clientX - rect.left, e.clientY - rect.top);
        });

        this.canvas.addEventListener("mousemove", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.screen.handleMouseMove(e.clientX - rect.left, e.clientY - rect.top);
        });

        this.canvas.addEventListener("mouseup", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.screen.handleMouseUp(e.clientX - rect.left, e.clientY - rect.top);
        });

        this.canvas.addEventListener("mouseleave", (e) => {
            this.screen.handleMouseLeave();
        });

        document.addEventListener("keydown", (e) => {
            e.preventDefault();
            this.screen.handleKeyDown(e.code);
        });

        document.addEventListener("keyup", (e) => {
            e.preventDefault();
            this.screen.handleKeyUp(e.code);
        });

        /*this.loadAssets().then(() => {

            this.canvas.addEventListener("click", (e) => {
                console.log(e);
            });

            this.loadDemo();
        });*/
    }

    /*loadAssets() {
        let loadingPromise = new Promise((resolve, reject) => {
            resolve();
        });
        return loadingPromise
    }*/
}