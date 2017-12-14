class Animation {
    
    constructor(transitions, frames, destroy = false) {
        this.frame = 0;
        this.frames = frames;
        this.destroy= destroy;
        this.transitions = transitions;
    }

    initialize(state) {
        for (let key in state) {
            if (this.transitions[key] === undefined) {
                this.transitions[key] = new TransitionNoop(state[key]);
            } else if (!this.transitions[key].isInitialized()) {
                this.transitions[key].initialize(state[key]);
            }
        }
    }

    isInitialized() {
        return this.frame !== 0;
    }

    finished() {
        return this.frame === this.frames;
    }

    destroyAfter() {
        return this.destroy;
    }

    getNextState() {
        this.frame += 1;
        const nextState = {};
        for (let key in this.transitions) {
            nextState[key] = this.transitions[key].evaluate(this.frame / this.frames);
        }
        return nextState;
    }
}

class TransitionNoop {

    constructor(start) {
        this.start = start;
    }

    evaluate(t) {
        return this.start;
    }
}

class TransitionLinear {

    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    isInitialized() {
        return this.start !== null;
    }

    initialize(start) {
        this.start = start;
    }

    evaluate(t) {
        return this.start + (this.end - this.start) * t;
    }
}

class TransitionQuadraticBezier {
    constructor(p0, p1, p2) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }

    isInitialized() {
        return true;
    }

    evaluate(t) {
        return (1 - t) * (1 - t) * this.p0 + 2 * (1 - t) * t * this.p1 + t * t * this.p2;
    }
}

export { Animation, TransitionNoop, TransitionLinear, TransitionQuadraticBezier }


