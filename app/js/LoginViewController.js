var gui = require('nw.gui');

function LoginView() {
    this._assign();
    this._attachEvent();
};

LoginView.prototype = {
    _assign: function() {
        this.welUserId = $("#user_id");
        this.welUserPasswd = $("#user_password");
        this.welBtnLogin = $("#_btn_sign_in");
        this.welBtnClose = $("#_btn_close");
        this.oWindow = gui.Window.get();
        this.oTray = null;
    },

    _attachEvent: function() {
        this.welBtnLogin.on("click", $.proxy(this._onClickLoginHandler, this));
        this.welBtnClose.on("click", $.proxy(this._closeWindow, this));
        this.oWindow.on('minimize', $.proxy(this._onMinimizeWindow, this));
    },

    _onClickLoginHandler: function() {
        var pusher = new PusherClient({
            push_server_url: "http://10.67.20.230"
        });

        pusher.connect(this.welUserId.val(), this.welUserPasswd.val(), {
            connected: $.proxy(this._fnConnectedCallback, this)
        });

    },

    _onMinimizeWindow: function() {
        // Hide window
        this.oWindow.hide();

        // Show tray
        this.oTray = new gui.Tray({ icon: 'img/tray_icon.png' });

        var menu = new gui.Menu();
        var oExitMenu = new gui.MenuItem({ label: 'Exit' });

        oExitMenu.on("click", $.proxy(this._closeWindow, this));

        menu.append(oExitMenu);

        this.oTray.menu = menu;
    },

    _fnConnectedCallback: function(data) {
        this.oWindow.minimize();
    },

    _closeWindow: function() {
        this.oWindow.close();

        if(this.oTray) {
            this.oTray.remove();
        }
    }
};