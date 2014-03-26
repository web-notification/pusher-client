AlarmManager = function(sAudioUrl) {
    this._sAudioUrl = sAudioUrl;
    this._oAudio = new Audio(sAudioUrl);

    this._attachEvent();
};

AlarmManager.prototype = {
    _attachEvent: function() {
        $(this._oAudio).on("ended", $.proxy(this._reset, this))
    },

    play: function() {
        if(this.isPlaying() === false) {
            this._oAudio.play();
        }
    },

    _reset: function() {
        this._oAudio.src = this._sAudioUrl;
    },

    isPlaying: function() {
        return !this._oAudio.paused;
    }
};