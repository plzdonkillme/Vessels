class Color {
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    getString() {
        return `rgba(${Math.floor(this.r)}, ${Math.floor(this.g)}, ${Math.floor(this.b)}, ${this.a})`;
    }

    getR() {
        return this.r;
    }

    getG() {
        return this.g;
    }

    getB() {
        return this.b;
    }

    getA() {
        return this.a;
    }

    translate(r, g, b, a) {
        this.r += r;
        this.g += g;
        this.b += b;
        this.a += a;
    }
}

export { Color }