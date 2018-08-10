class Objective {

    serialize() {
        return this.constructor.name();
    }

    toJSON() {
        return this.constructor.name();
    }

    check(map) {
        throw Error('Unimplemented');
    }

    success(map) {
        throw Error('Unimplemented');
    }

}

class Objective1 extends Objective {

    static name() {
        return 0;
    }

    check(map) {
        let players = map.getMapObjects().map(m => m.getPlayer()).filter(p => p !== null);
        let player = players.filter(p => p === '0');
        let enemies =  players.filter(p => p !== '0');
        return player.length === 0 || enemies.length === 0;
    }

    success(map) {
        let players = map.getMapObjects().map(m => m.getPlayer());
        let enemies =  players.filter(p => p !== '0' && p !== null);
        return enemies.length === 0;
    }
}


const ObjectiveFactory = {
    map: {
        0: Objective1,
    },
    create: function(json) {
        const cls = this.map[json];
        return new cls();
    },
    getJSON: function(propString) {
        return parseInt(propString);
    },
    getPropString: function(json) {
        return `${json}`;
    }
};

export { ObjectiveFactory }