var SimpleNotificationView = function(NotificationModel) {
    this.TEMPLATE = "../js/pusher-notify/templates/SimpleNotification.html";

    this.subject = NotificationModel.getSubject();
    this.description = NotificationModel.getDescription();
    this.click_callback = NotificationModel.getClickMethod();

    this._createWindow();
    this._attachEvent();

    return this._oWindow;
};

SimpleNotificationView.prototype = {
    _createWindow: function() {
        this._oWindow = gui.Window.open(this.TEMPLATE, NOTIFICATION_DEFAULT_OPTION);
    },

    _attachEvent: function() {
        this._oWindow.on("loaded", $.proxy(function() {
            var body = $(this._oWindow.window.document.body);
            body.find("#_wrap_subject").text(this.subject);
            body.find("#_wrap_description").text(this.description);

            body.on("click", $.proxy(function() {
                if(this.click_callback) {
                    this.click_callback();
                }
            }, this));
        }, this));
    }
};