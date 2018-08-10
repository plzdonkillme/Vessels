import { serialize } from "./MapSerializer";
import { TileFactory } from "./Tile";
import { ObjectiveFactory } from "./Objective";
import { MapObjectFactory } from "./MapObject";

class Map {

    constructor(state) {
        this.tiles = [];
        this.tileMap = {};
        for (let y = 0; y < state.tiles.length; y++) {
            const tileRow = [];
            for (let x = 0; x < state.tiles[y].length; x++) {
                const tile = TileFactory.create(state.tiles[y][x]);
                this.tileMap[tile.getKey()] = tile;
                if (state.tiles[y][x].mapObject !== undefined) {
                    const m = MapObjectFactory.create(state.tiles[y][x].mapObject);
                    m.setTile(tile);
                }
                if (y > 0) {
                    this.tiles[y - 1][x].link('down', tile);
                    tile.link('top', this.tiles[y - 1][x]);
                }
                if (x > 0) {
                    tileRow[x - 1].link('right', tile);
                    tile.link('left', tileRow[x - 1]);
                }
                tileRow.push(tile);
            }
            this.tiles.push(tileRow);
        }
        this.objective = ObjectiveFactory.create(state.objective);
        this.turnPlayers = state.turnPlayers;
        this.actions = state.actions;
        this.listeners = [];
        this.cachedActions = null;
    }

    toJSON() {
        const state = {};
        state.tiles = this.tiles.map(tileRow => tileRow.map(tile => tile.toJSON()));
        state.objective = this.objective.toJSON();
        state.turnPlayers = this.turnPlayers;
        state.actions = this.actions;
        return state;
    }

    static transition(state, action) {
        const map = new Map(state);
        map.doAction(action);
        return map.toJSON();
    }

    doAction(action) {
        //TODO: Validate actions is in available actions
        const validActions = this.getActions();
        if (validActions.indexOf(action) === -1) {
            throw Error('Invalid Action');
        }
        const name = action.name;
        if (this.actions[name] > 0) {
            const src = this.tileMap[action.src].getMapObject();
            let dst;
            if (name === 'attack') {
                dst = action.dst.map(d => this.tileMap[d]);
            } else {
                dst = this.tileMap[action.dst];
            }
            src[name](dst);
            this.actions[name] -= 1;

            this.listeners.forEach(l => l.trigger(action));
        } else if (name !== 'end') {
            throw Error('Invalid action');
        }
        if (name === 'end' || Object.values(this.actions).reduce((a,b) => a + b, 0) === 0) {
            this.turnPlayers.push(this.turnPlayers.shift());
            this.actions = {
                move: 1,
                transfer: 1,
                attack: 1,
            };
        }
    }

    getActions() {
        if (this.cachedActions !== null) {
            return this.cachedActions;
        }
        let actions = [{name: 'end'}];
        const objs = this.getMapObjects().filter(m => m.getPlayer() === this.turnPlayers[0]);
        if (this.actions.move > 0) {
            actions = objs.reduce((a, b) => {
                return a.concat(b.getMoveActions());
            }, actions);
        }
        if (this.actions.transfer > 0) {
            actions = objs.reduce((a, b) => {
                return a.concat(b.getTransferActions(objs));
            }, actions);
        }
        if (this.actions.attack > 0) {
            actions = objs.reduce((a, b) => {
                return a.concat(b.getAttackActions());
            }, actions);
        }
        this.cachedActions = actions;
        return actions;
    }

    addListener(l) {
        this.listeners.push(l);
    }

    getMapObjects() {
        const mapObjects = [];
        this.tiles.forEach(tileRow => {
            tileRow.forEach(tile => {
                const mapObject = tile.getMapObject();
                if (mapObject !== null) {
                    mapObjects.push(mapObject);
                }
            });
        });
        return mapObjects;
    }

    getObjective() {
        return this.objective;
    }

    getTurnPlayer() {
        return this.turnPlayer;
    }

    isResolved() {
        return this.objective.check(this);
    }

    serialize() {
        return serialize(this);
    }
}

export { Map }