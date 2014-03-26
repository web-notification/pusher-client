var gui = gui || require("nw.gui");

var NOTIFICATION_TYPE = {
    DEFAULT : 100 //subject & description & click callback
};

var NOTIFICATION_DEFAULT_OPTION = {
    frame: false,
    toolbar: false,
    width: 0,
    height: 0,
    'always-on-top': true,
    show: false,
    resizable: false,
    'show_in_taskbar': false
};

var NotificationManager = function() {
    this.WINDOW_CLOSE_TIME = 3000;
    this.MARGIN_BETWEEN_WINDOW = 10;
    this._windowQueue = [];
};

NotificationManager.prototype = {
    notify: function(NotificationModel) {
        var oNewNotifyWindow = this._createNewNotifyWindow(NotificationModel);

        oNewNotifyWindow.on("loaded", $.proxy(function() {
            this._adjustWindowSize(oNewNotifyWindow);
            this._adjustPosition(oNewNotifyWindow);
            this._showWindow(oNewNotifyWindow);
        }, this));
    },

    _createNewNotifyWindow: function(NotificationModel) {
        if(NotificationModel.getType() === NOTIFICATION_TYPE.DEFAULT) {
            return new SimpleNotificationView(NotificationModel);
        }
    },

    _adjustWindowSize: function(oNotifyWindow) {
        oNotifyWindow.resizeTo($(oNotifyWindow.window.document).width(), $(oNotifyWindow.window.document).height());
    },

    _adjustPosition: function(oNotifyWindow) {
        var nLeftPosition = screen.availWidth - oNotifyWindow.width - this.MARGIN_BETWEEN_WINDOW;
        var nTopPosition = this._getNextNotifyTopPosition(oNotifyWindow);;

        oNotifyWindow.moveTo(nLeftPosition, nTopPosition);

        this._windowQueue.push(oNotifyWindow);
    },

    _getNextNotifyTopPosition: function(oNotifyWindow) {
        var oLastNotifyWindow = this._windowQueue[this._windowQueue.length - 1];

        if(oLastNotifyWindow) {
            return oLastNotifyWindow.y - oNotifyWindow.height - this.MARGIN_BETWEEN_WINDOW;
        } else {
            return screen.availHeight - oNotifyWindow.height - this.MARGIN_BETWEEN_WINDOW;
        }
    },

    _adjustPositionAllWindow: function() {
        var oPrevNotifyWindow = null;
        _.each(this._windowQueue, $.proxy(function(oNotifyWindow) {

            oNotifyWindow.moveTo(oNotifyWindow.x, oNotifyWindow.y + oNotifyWindow.height + this.MARGIN_BETWEEN_WINDOW);

            oPrevNotifyWindow = oNotifyWindow;
        }, this));
    },

    _showWindow: function(oNotifyWindow) {
        oNotifyWindow.show();

        setTimeout($.proxy(function() {
            oNotifyWindow.close();
            this._windowQueue.shift();
            this._adjustPositionAllWindow();
        }, this), this.WINDOW_CLOSE_TIME);
    }
};