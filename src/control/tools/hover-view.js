/* 悬停视图 */
var guid = 1;
// 鼠标移动处理事件
function onDocumentMousemove (e) {
    var x = e.clientX,
        y = e.clientY;
    if (this.animator.isStarted) {
        return;
    }
    var p = this.target.offset();
    var tl = {
        top: Math.floor(p.top),
        left: Math.floor(p.left)
    };
    tl.bottom = tl.top + this.targetHeight;
    tl.right = tl.left + this.targetWidth;

    p = this.viewPanel.offset();
    var pl = {
        top: Math.floor(p.top),
        left: Math.floor(p.left)
    };
    pl.bottom = pl.top + this.height;
    pl.right = pl.left + this.width;

    //差值
    var xdv = -1,
        ydv = -1,
        l, r,
        t = tl.top < pl.top ? tl.top : pl.top,
        b = tl.bottom > pl.bottom ? tl.bottom : pl.bottom;
    //判断view在左边还是右边
    if (tl.left < pl.left) {
        l = tl.left;
        r = pl.right;
    } else {
        l = pl.left;
        r = tl.right;
    }

    //判断鼠标是否在view和target之外
    if (x < l) {
        xdv = l - x;
    } else if (x > r) {
        xdv = x - r;
    }
    if (y < t) {
        ydv = t - y;
    } else if (y > b) {
        ydv = y - b;
    }

    if (xdv == -1 && ydv == -1) {
        xdv = 0;
        if (x >= tl.left && x <= tl.right) {
            if (y <= tl.top - this.buffer || y >= tl.bottom + this.buffer) {
                ydv = this.buffer;
            }
        } else if (x >= pl.left && x <= pl.right) {
            if (y < pl.top) {
                ydv = pl.top - y;
            } else if (y > pl.bottom) {
                ydv = y - pl.bottom;
            }
        }
        if (ydv == -1) {
            this.viewPanel.css({
                "opacity": 1,
                "filter": "Alpha(opacity=100)"
            });
            return;
        }
    }

    if (xdv > this.buffer || ydv > this.buffer) {
        this.hide();
        return;
    }

    var opacity = 1.0 - ((xdv > ydv ? xdv : ydv) / this.buffer);
    if (opacity < 0.2) {
        this.hide();
        return;
    }
    this.viewPanel.css({
        "opacity": opacity,
        "filter": "Alpha(opacity=" + opacity * 100 + ")"
    });
}


ui.ctrls.define("ui.ctrls.HoverView", {
    buffer: 30,
    _defineOption: function () {
        return {
            width: 160,
            height: 160
        };
    },
    _defineEvents: function () {
        return ["showing", "shown", "hiding", "hidden"];
    },
    _create: function () {
        this.viewPanel = $("<div class='hover-view-panel border-highlight' />");
        this.viewPanel.css({
            "width": this.option.width + "px",
            "max-height": this.option.height + "px"
        });
        $(document.body).append(this.viewPanel);

        this.width = this.viewPanel.outerWidth();
        this.height = this.viewPanel.outerHeight();

        this.target = null;
        this.targetWidth = null;
        this.targetHeight = null;

        this.hasDocMousemoveEvent = false;

        this.isShow = false;

        if (!ui.core.isNumber(this.option.width) || this.option.width <= 0) {
            this.option.width = 160;
        }
        if (!ui.core.isNumber(this.option.height) || this.option.height <= 0) {
            this.option.height = 160;
        }

        this.onDocumentMousemoveHander = onDocumentMousemove.bind(this);
        this.onDocumentMousemoveHander.guid = "hoverView" + (guid++);

        this.animator = ui.animator({
            target: this.viewPanel,
            onChange: function(val) {
                this.target.css({
                    "opacity": val / 100,
                    "filter": "Alpha(opacity=" + val + ")"
                });
            }
        }).addTarget({
            target: this.viewPanel,
            onChange: function(val) {
                this.target.css("left", val + "px");
            }
        }).addTarget({
            target: this.viewPanel,
            onChange: function(val) {
                this.target.css("top", val + "px");
            }
        });
        this.animator.duration = 240;
    },
    clear: function () {
        this.viewPanel.empty();
        return this;
    },
    append: function (elem) {
        this.viewPanel.append(elem);
        return this;
    },
    addDocMousemove: function () {
        if (this.hasDocMousemoveEvent) {
            return;
        }
        this.hasDocMousemoveEvent = true;
        $(document).on("mousemove", this.onDocumentMousemoveHander);
    },
    removeDocMousemove: function () {
        if (!this.hasDocMousemoveEvent) {
            return;
        }
        this.hasDocMousemoveEvent = false;
        $(document).off("mousemove", this.onDocumentMousemoveHander);
    },
    setLocation: function () {
        ui.setLeft(this.target, this.viewPanel);
    },
    getLocation: function () {
        var location = ui.getLeftLocation(this.target, this.width, this.height);
        return location;
    },
    show: function (target) {
        var view = this,
            location,
            opacity,
            option;

        this.target = target;

        if (this.fire("showing") === false) return;

        //update size
        this.targetWidth = this.target.outerWidth();
        this.targetHeight = this.target.outerHeight();
        this.height = this.viewPanel.outerHeight();

        this.animator.stop();
        location = this.getLocation();
        if (this.isShow) {
            opacity = parseFloat(this.viewPanel.css("opacity"));
            option = this.animator[0];
            if (opacity < 1) {
                option.begin = opacity * 100;
                option.end = 100;
            } else {
                option.begin = option.end = 100;
            }
            option = this.animator[1];
            option.begin = parseFloat(this.viewPanel.css("left"));
            option.end = location.left;
            option = this.animator[2];
            option.begin = parseFloat(this.viewPanel.css("top"));
            option.end = location.top;
        } else {
            this.viewPanel.css({
                "top": location.top + "px",
                "left": location.left + "px"
            });
            option = this.animator[0];
            option.begin = 0;
            option.end = 100;
            option = this.animator[1];
            option.begin = option.end = location.left;
            option = this.animator[2];
            option.begin = option.end = location.top;
        }
        this.isShow = true;
        this.viewPanel.css("display", "block");
        this.animator.start().then(function() {
            view.addDocMousemove();
            view.fire("shown");
        });
    },
    hide: function (complete) {
        var view = this,
            option;

        if (this.fire("hiding") === false) return;

        this.animator.stop();
        this.removeDocMousemove();

        option = this.animator[0];
        option.begin = parseFloat(this.viewPanel.css("opacity"));
        option.end = 0;
        option = this.animator[1];
        option.begin = option.end = 0;
        option = this.animator[2];
        option.begin = option.end = 0;

        this.animator.start().then(function() {
            view.isShow = false;
            view.viewPanel.css("display", "none");
            view.fire("hidden");
        });
    }
});
ui.createHoverView = function (option) {
    return ui.ctrls.HoverView(option);
};
$.fn.addHoverView = function (view) {
    if (this.length === 0) {
        return null;
    }
    var that = this;
    if (view instanceof ui.ctrls.HoverView) {
        this.mouseover(function(e) {
            view.show(that);
        });
    }
};
