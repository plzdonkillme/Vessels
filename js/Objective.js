class Objective {

    constructor(fn, num) {
        this.fn = fn;
        this.num = num;
    }

    serialize() {
        return this.num;
    }

    static deserialize(num) {
        return new Objective(OBJECT_FNS[num], num);
    }

    check(map) {
        return this.fn.check(map);
    }

    success(map) {
        return this.fn.success(map);
    }

}

const OBJECT_FNS = {
    0: {
        check: map => {
            let players = map.getMapObjects().map(m => m.getPlayer()).filter(p => p !== null);
            let player = players.filter(p => p === '0');
            let enemies =  players.filter(p => p !== '0');
            return player.length === 0 || enemies.length === 0;
        },
        success: map => {
            let players = map.getMapObjects().map(m => m.getPlayer());
            let enemies =  players.filter(p => p !== '0' && p !== null);
            return enemies.length === 0;
        }
    },
}

export { Objective }