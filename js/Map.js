import { serialize } from "./MapSerializer";

class Map {

    constructor(tiles, objective, turnPlayers, actions) {
        this.tiles = tiles
        this.objective = objective;
        this.turnPlayers = turnPlayers;
        this.turnPlayer = turnPlayers[0];
        this.turnPlayerIdx = 0;
        this.actions = actions;
        this.listeners = [];
    }

    getTiles() {
        return this.tiles;
    }

    getTilesFlattened() {
        let flattenedArray = [];
        this.tiles.forEach((row) => {
            flattenedArray = flattenedArray.concat(row);
        });
        return flattenedArray;
    }

    getMapObjects() {
        return this.getTilesFlattened().map(t => t.getMapObject()).filter(m => m !== null);
    }

    getMapObject(key) {
        const objs = this.getMapObjects().filter(m => m.getKey() === key);
        if (objs.length !== 1) {
            throw Error('Invalid Key');
        }
        return objs[0];
    }

    getObjective() {
        return this.objective;
    }

    serializeTurnPlayers() {
        let ret = '';
        let idx = this.turnPlayerIdx;
        for (let i = 0; i < this.turnPlayers.length; i++) {
            ret += this.turnPlayers[idx];
            if (i !== this.turnPlayers.length - 1) {
                ret += '-';
            }
            idx = (idx + 1) % this.turnPlayers.length;
        }
        return ret;
    }

    static deserializeTurnPlayers(str) {
        return str.split('-');
    }

    getTurnPlayer() {
        return this.turnPlayer;
    }

    serializeActions() {
        return `${this.actions.move}-${this.actions.transfer}-${this.actions.attack}`;
    }

    static deserializeActions(str) {
        const s = str.split('-');
        return {
            move: parseInt(s[0]),
            transfer: parseInt(s[1]),
            attack: parseInt(s[2]),
        };
    }

    isResolved() {
        return this.objective.check(this);
    }

    serialize() {
        return serialize(this);
    }

    /*
       Actions:
        move/attack
        transfer
    */
    doAction(name, sx, sy, dx, dy) {
        if (this.actions[name] > 0) {
            const srcTile = this.tiles[sy][sx];
            const obj = srcTile.getMapObject();
            const dstTile = this.tiles[dy][dx]; 
            const e = obj[name](dstTile, this.turnPlayer);
            this.actions[name] -= 1;

            this.listeners.forEach(l => l.trigger(e));
        } else if (name !== 'end') {
            throw Error('Invalid action');
        }
        if (name === 'end' || Object.values(this.actions).reduce((a,b) => a + b, 0) === 0) {
            this.turnPlayerIdx = (this.turnPlayerIdx + 1) % this.turnPlayers.length;
            this.turnPlayer = this.turnPlayers[this.turnPlayerIdx];
            this.actions = {
                move: 1,
                transfer: 1,
                attack: 1,
            };
        }
    }

    getMovablePaths(key) {
        const obj = this.getMapObject(key);
        return obj.getMoveablePaths();
    }

    getAttackableTiles(key) {
        const obj = this.getMapObject(key);
        return obj.getAttackableTiles();
    }

    addListener(l) {
        this.listeners.push(l);
    }

}

export { Map }