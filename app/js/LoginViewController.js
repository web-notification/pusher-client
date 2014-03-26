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

        this.oWindow.on("close", $.proxy(function() {
            this.hide();
            if(this.oWindow != null) {
                this.oWindow.close(true);
            }
            this.close(true);
        }, this));

        this.oWindow.on('closed', function() {
            this.oWindow = null;
        });
    },

    _onClickLoginHandler: function() {
        var pusher = new PusherClient({
            push_server_url: "http://10.67.20.230"
        });

        pusher.connect(this.welUserId.val(), this.welUserPasswd.val(), {
            connected: $.proxy(this._fnConnectedCallback, this),
            error: $.proxy(this._fnSocketErrorCallback, this)
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

    _fnSocketErrorCallback: function() {
        alert('소켓 서버 연결에 실패하였습니다.');
    },

    _closeWindow: function() {
        if(this.oTray) {
            this.oTray.remove();
        }
        this.oWindow.close(true);
    }
};