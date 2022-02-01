class Direction {

    static NORTH = new Direction("north");
    static SOUTH = new Direction("south");
    static RIGHT = new Direction("right");
    static LEFT = new Direction("left");

    constructor(name) {
        this.name = name;
    }
}

export {Direction};