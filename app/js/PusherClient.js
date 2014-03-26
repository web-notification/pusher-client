var PusherClient = function(config) {
    this._connected = false;
    this.RETRY_INTERVAL = 1000;

    this.config = {
        push_server_url : ""
    }

    this.init(config);
    this._attachEvent();
};

PusherClient.prototype = {
    init: function(config) {
        $.extend(this.config, config);

        this._connectSocket();

        this.callbacks = {
            connected : function() {}
        }
    },

    _attachEvent: function() {
        this.socket.on('registSuccess', $.proxy(this._onRegistSuccess, this));
        this.socket.on('receivePushMessage', $.proxy(this._onReceivePushMessage, this));
        this.socket.on('connect', $.proxy(this._onConnectedSocket, this));
        this.socket.on('disconnect', $.proxy(this._onDisconnectedSocket, this));
    },

    connect: function(userid, password, callbacks) {
        this._uniqueId = userid;
        $.extend(this.callbacks, callbacks);
        this.socket.emit('registNotification', { uniqueId: this._uniqueId });
    },

    _connectSocket: function() {
        this.socket = io.connect(this.config.push_server_url);
    },

    _onConnectedSocket: function() {
        this._connected = true;
    },

    _reconnectSocket: function() {
        if(this._connected === true) {
            clearInterval(this._reconnectTimer);
            return false;
        }

        this._connectSocket();
        this.socket.emit('registNotification', { uniqueId: this._uniqueId });
    },

    _onDisconnectedSocket: function() {
        this._connected = false;
        this._reconnectTimer = setInterval($.proxy(this._reconnectSocket, this), this.RETRY_INTERVAL);
    },

    _onRegistSuccess: function (data) {
        this.callbacks.connected.apply(this.callbacks.connected, data);
    },

    _onReceivePushMessage: function (data) {
        var iconUrl = "";

        if(data.icon) {
            iconUrl = data.icon;
        }

        window.LOCAL_NW.desktopNotifications.notify(data.icon, data.subject, data.description, function(){
            gui.Shell.openExternal(data.url)
        });
    }
};