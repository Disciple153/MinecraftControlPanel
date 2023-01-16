/**
 * Vector
 * Defines a direction and magnitude in 2D space.
 */
class Vector {
    private _x: number;
    private _y: number;
    private _xOld: number;
    private _yOld: number;

    constructor(x: number = 0, y:number = 0) {
        this._x = x;
        this._y = y;
        this._xOld = x;
        this._yOld = y;
    }

    get x() {
        return this._x;
    }

    set x(x: number) {
        this._x = x;
    }

    get y() {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
    }

    get xChanged(): boolean {
        return this._x != this._xOld;
    }

    get yChanged(): boolean {
        return this._y != this._yOld;
    }

    get heading(): Vector {
        return new Vector(this._x - this._xOld, this._y - this._yOld);
    }

    Reset(): void {
        this._xOld = this._x;
        this._yOld = this._y;
    }
}