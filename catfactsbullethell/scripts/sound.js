var Sound = /** @class */ (function () {
    function Sound(file, loop) {
        if (loop === void 0) { loop = false; }
        this._sound = document.createElement("audio");
        this._sound.src = file;
        this._sound.setAttribute("preload", "auto");
        this._sound.setAttribute("controls", "none");
        this._sound.style.display = "none";
        this._sound.loop = loop;
        this._sound.load();
        document.body.appendChild(this._sound);
    }
    Sound.prototype.Play = function (volume) {
        if (volume === void 0) { volume = 1; }
        var playPromise;
        if (this._fade != null) {
            clearInterval(this._fade);
            this._fade = null;
        }
        this._sound.volume = volume;
        this._sound.currentTime = 0;
        playPromise = this._sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(function (error) {
                // Play was interrupted.
                // This is okay.
            });
        }
    };
    Sound.prototype.Stop = function () {
        var _this = this;
        _this._fade = setInterval(function () {
            if (_this._sound.volume > 0.01) {
                _this._sound.volume -= 0.01;
            }
            else {
                clearInterval(_this._fade);
                _this._fade = null;
                _this._sound.pause();
            }
        }, 50);
    };
    return Sound;
}());
