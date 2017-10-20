import { serialize } from "./MapSerializer";

class Map {

    constructor(tiles, objective, turnPlayers, actions) {
        this.tiles = tiles
        this.objective = objective;
        this.turnPlayers = turnPlayers;
        this.turnPlayer = turnPlayers[0];
        this.turnPlayerIdx = 0;
        this.actions = actions;
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
            obj[name](dstTile, this.turnPlayer);
            this.actions[name] -= 1;
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
    /*

    applyAction(actor, action, receiver) {
        if (action === 'move') {
            actor.moveTo(receiver);
        }
    }

    clicked(obj) {
        if (obj instanceof MapObject) {
            //this.setSelection(obj);
            //rerender = true;
        } else if (obj instanceof Tile) {
            if (obj.isHighlighted()) {
                this.turnActor.moveTo(obj);
            }
        }
    }

    serialize() {
        const serializer = new MapSerializer();
        return serializer.serialize(this);
    }

    /*nextTurn() {
        if (this.turnActor !== null) {
            this.turnQueue.pop();
            this.turnActor.subtractTicks(this.TICK_THRESHOLD);
        }
        while (this.turnQueue.length === 0) {
            for (let i = 0; i < this.actors.length; i++) {
                this.actors[i].tickForward();
                const ticks = this.actors[i].getTicks();
                if (ticks > this.TICK_THRESHOLD) {
                    let idx = this.turnQueue.length;
                    for (let j = 0; j < this.turnQueue.length; j++) {
                        if (this.turnQueue[j][1] > ticks) {
                            idx = j;
                            break;
                        }
                    }
                    this.turnQueue.splice(idx, 0, [this.actors[i], ticks]);
                }
            }
        }
        this.turnActor = this.turnQueue[this.turnQueue.length - 1][0];
        return this.turnActor;
    }*/

    /*getTurnActor() {
        return this.turnActor;
    }

    getPlayerOptions() {
        return this.playerOptions;
    }

    setPlayerOptions(options) {
        this.playerOptions = options;
    }*/
}

export { Map }