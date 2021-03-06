// 时钟动态磁贴
var clockStyle;

if(!ui.tiles) {
    ui.tiles = {};
}

function twoNumberFormatter(number) {
    return number < 10 ? "0" + number : "" + number;
}

function getNow() {
    var date,
        now;
    date = new Date();
    now = {
        hour: twoNumberFormatter(date.getHours()),
        minute: twoNumberFormatter(date.getMinutes()),
        spliter: ":"
    };
    return now;
}

clockStyle = {
    medium: function(tile) {
        var now,
            builder;
        now = getNow();
        builder = [];

        builder.push("<span class='clock-hour'>", now.hour, "</span>");
        builder.push("<span class='clock-minute'>", now.minute, "</span>");

        tile.updatePanel.html(builder.join(""));

        if(!tile.isDynamicChanged) {
            tile.updatePanel
                .css({ 
                    "text-align": "center", 
                    "height": tile.height + "px"
                });
            if(tile.smallIconImg) {
                tile.smallIconImg.remove();
                tile.smallIconImg = null;
            }
            tile.update();
        }
    },
    wide: function(tile) {
        var now,
            builder;
        now = getNow();
        builder = [];

        builder.push("<span class='clock-hour'>", now.hour, "</span>");
        builder.push("<span class='clock-spliter'></span>");
        builder.push("<span class='clock-minute'>", now.minute, "</span>");

        tile.updatePanel.html(builder.join(""));

        if(!tile.isDynamicChanged) {
            tile.updatePanel
                .css({ 
                    "text-align": "center", 
                    "line-height": tile.height - 8 + "px",
                    "height": tile.height + "px"
                });
            if(tile.smallIconImg) {
                tile.smallIconImg.remove();
                tile.smallIconImg = null;
            }
            tile.update();
        }
    },
    large: function(tile) {
        clockStyle.wide.apply(this, arguments);
    }
};

ui.tiles.clock = function(tile) {
    clockStyle[tile.type].apply(this, arguments);
    tile.activate();
};
