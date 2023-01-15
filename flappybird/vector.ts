/**
 * Vector
 * Defines a direction and magnitude in 2D space.
 */
class Vector {
    private _x: number;
    private _y: number;
    private _xChanged: boolean;
    private _yChanged: boolean;

    constructor(x: number = 0, y:number = 0) {
        this._x = x;
        this._y = y;
        this._xChanged = false;
        this._yChanged = false;
    }

    get x() {
        return this._x;
    }

    set x(x: number) {
        this._xChanged = true;
        this._x = x;
    }

    get y() {
        return this._y;
    }

    set y(y: number) {
        this._yChanged = true;
        this._y = y;
    }

    get xChanged(): boolean {
        return this._xChanged;
    }

    get yChanged(): boolean {
        return this._yChanged;
    }

    Reset(): void {
        this._xChanged = false;
        this._yChanged = false;
    }
}