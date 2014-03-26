var SimpleNotificationModel = function(subject, description, click_callback) {
    this.TYPE = NOTIFICATION_TYPE.DEFAULT;
    this.TEMPLATE = "../js/pusher-notify/templates/SimpleNotification.html";

    this.subject = subject;
    this.description = description;
    this.click_callback = click_callback;
};

SimpleNotificationModel.prototype = {
    getType: function() {
        return this.TYPE;
    },

    getSubject: function() {
        return this.subject;
    },

    getDescription: function() {
        return this.description;
    },

    getClickMethod: function() {
        if(this.click_callback) {
            return this.click_callback;
        } else {
            return function() {}
        }
    }
};