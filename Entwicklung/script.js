    videojs.Btn = videojs.Button.extend({
        init: function (player, options) {
            videojs.Button.call(this, player, options);
            this.on('click', this.onClick);
        }
    });

    videojs.Btn.prototype.onClick = function () {
        alert("Click on my custom button!");
    };

    var createCustomButton = function () {
        var props = {
            className: 'vjs-custom-button vjs-control'
            , innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text"><input type="button">my button</button></span></div>'
            , role: 'button'
            , 'aria-live': 'polite'
            , tabIndex: 0
        };
        return videojs.Component.prototype.createEl(null, props);
    };

    var myBtn;
    videojs.plugin('myBtn', function () {
        var options = {
            'el': createCustomButton()
        };
        myBtn = new videojs.Btn(this, options);
        this.controlBar.el().appendChild(myBtn.el());
    });

    var vid = videojs("example_video_1", {
        plugins: {
            myBtn: {}
        }
    });