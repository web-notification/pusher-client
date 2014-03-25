var PusherClient = function(config) {
    this.config = {
        push_server_url : ""
    }

    this.init(config);
    this._attachEvent();
};

PusherClient.prototype = {
    init: function(config) {
        $.extend(this.config, config);
        this.socket = io.connect(this.config.push_server_url);
        this.callbacks = {
            connected : function() {}
        }
    },

    _attachEvent: function() {
        this.socket.on('registSuccess', $.proxy(this._onRegistSuccess, this));
        this.socket.on('receivePushMessage', $.proxy(this._onReceivePushMessage, this));
    },
    connect: function(userid, password, callbacks) {
        $.extend(this.callbacks, callbacks);

        this.socket.emit('registNotification', { uniqueId: userid });
    },

    _onRegistSuccess: function (data) {
        this.callbacks.connected.apply(this.callbacks.connected, data);
    },

    _onReceivePushMessage: function (data) {
        window.LOCAL_NW.desktopNotifications.notify(data.icon, data.subject, data.description, function(){
            window.open(data.url);
        });
    }
};