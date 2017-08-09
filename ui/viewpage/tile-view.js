// 动态磁贴

///磁贴组
var tileSize = {
    // 小
    small: { width: 62, height: 62, iconSize: 32, countX: 1, countY: 1 },
    // 中
    medium: { width: 128, height: 128, iconSize: 64, countX: 2, countY: 2 },
    // 宽
    wide: { width: 260, height: 128, iconSize: 64, countX: 4, countY: 2 },
    // 大
    large: { width: 260, height: 260, iconSize: 64, countX: 4, countY: 4 }
};
var tileMargin = 4,
    titleHeight = 24,
    edgeDistance = 48,
    groupTitleHeight = 48;
var defineProperty = ui.ctrls.CtrlBase.prototype.defineProperty,
    tileInfoProperties = ["name", "title", "icon", "link", "color"];
var tileUpdater,
    dynamicInfoPrototype;

tileUpdater = {
    // 翻转更新
    rotate: {
        render: function() {
            this.tileInnerBack = $("<div class='tile-inner' style='display:none'>");
            this.tileInnerBack.css("background-color", this.color);
            
            this.updatePanel = $("<div class='update-panel' />");
            this.updatePanel.css("height", this.height - titleHeight + "px");
            this.tileInnerBack
                    .append(this.updatePanel)
                    .append("<div class='tile-title'><span class='tile-title-text'>" + this.title + "</span></div>");

            this.smallIconImg = $("<img class='tile-small-icon' />");
            this.smallIconImg.prop("src", this.icon);
            this.tileInnerBack.append(this.smallIconImg);
            
            this.tilePanel.append(this.tileInnerBack);

            this.updateStyle._createAnimator.call(this);
        },
        _createAnimator: function() {
            var setRotateFn,
                perspective,
                that;
            
            perspective = this.width * 2;
            setRotateFn = function(val) {
                var cssObj = {},
                    prefix = ["ms-", "moz-", "webkit-", "o-", ""],
                    rotateValue;
                rotateValue = "perspective(" + perspective + "px) rotateX(" + val + "deg)";
                prefix.forEach(function(p) {
                    cssObj[p + "transform"] = rotateValue;
                });
                return cssObj;
            };
            this.animator = ui.animator({
                ease: ui.AnimationStyle.easeFrom,
                begin: 0,
                end: -90,
                duration: 500,
                onChange: function(val) {
                    this.target.css(setRotateFn(val));
                }
            }).addTarget({
                ease: function(pos) {
                    var s = 3;
                    return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
                },
                begin: 90,
                end: 0,
                delay: 500,
                duration: 500,
                onChange: function(val) {
                    var css = setRotateFn(val);
                    css["display"] = "block";
                    this.target.css(css);
                }
            });
            that = this;
            this.animator.onEnd = function() {
                this[0].target.css("display", "none");
            };
        },
        _play: function() {
            var that = this;
            if(this.link) {
                this.link.css("display", "none");
            }
            that = this;
            this.animator.start().done(function() {
                var temp;
                temp = that.tileInnerBack;
                that.tileInnerBack = that.tileInner;
                that.tileInner = temp;
                if(that.link) {
                    that.link.css("display", "block");
                }
            });
        },
        update: function(content) {
            var option,
                that;

            if(content) {
                this.updatePanel.html(content);
            }

            if(this.animator.isStarted || this.tileInnerBack.css("display") === "block") {
                return;
            }

            option = this.animator[0];
            option.target = this.tileInner;
            option.begin = 0;
            option.end = -90;

            option = this.animator[1];
            option.target = this.tileInnerBack;
            option.begin = 90;
            option.end = 0;

            this.updateStyle._play.call(this);
        },
        restore: function() {
            var option,
                that;

            if(this.animator.isStarted || this.tileInner.css("display") === "block") {
                return;
            }

            option = this.animator[0];
            option.target = this.tileInner;
            option.begin = 0;
            option.end = 90;

            option = this.animator[1];
            option.target = this.tileInnerBack;
            option.begin = -90;
            option.end = 0;

            this.updateStyle._play.call(this);
        }
    },
    // 上升更新
    moveup: {
        render: function() {
            // 动态信息面板
            this.updatePanel = $("<div class='update-panel' />");
            this.updatePanel.css("top", "100%");
            this.contentPanel.append(this.updatePanel);

            this.smallIconImg = $("<img class='tile-small-icon' />");
            this.smallIconImg.prop("src", this.icon);
            this.updatePanel.append(this.smallIconImg);

            this.animator = ui.animator({
                target: this.contentPanel,
                ease: ui.AnimationStyle.easeFromTo,
                duration: 800,
                begin: 0,
                end: this.height,
                onChange: function(val) {
                    this.target.scrollTop(val);
                }
            });
        },
        update: function(content) {
            var option;

            if(content) {
                this.updatePanel.html(content);
            }

            this.animator.stop();
            option = this.animator[0];
            option.begin = 0;
            this.animator.start();
        },
        restore: function() {
            var option;

            this.animator.stop();
            option = this.animator[0];
            if(option.target.scrollTop() === 0) {
                return;
            }
            option.begin = option.target.scrollTop();
            option.end = 0;
            this.animator.start();
        }
    }
};

// 磁贴
/*
    tileInfo: {
        name: string 磁贴名称，用于动态更新，不能重复,
        type: string 磁贴类型，small|medium|wide|large,
        color: string 磁贴颜色,
        title: string 磁贴标题,
        icon: string 磁贴图标,
        link: string 磁贴调整的URL，如果为null则点击磁贴不会发生跳转,
        interval: int 动态更新的时间间隔，单位秒,
        updateStyle: moveup|rotate
        updateFn: function 动态更新的方法 参数： tile，isLastTile
    }
 */
function Tile(tileInfo, group) {
    if(this instanceof Tile) {
        this.initialize(tileInfo, group);
    } else {
        return new Tile(tileInfo, group);
    }
}
Tile.prototype = {
    initialize: function(tileInfo, group) {
        var type,
            that;

        this.type = (tileInfo.type + "").toLowerCase();
        type = tileSize[this.type];
        if(!type) {
            throw new TypeError("Invalid tile type: " + this.type);
        }

        this.group = group;
        this.isDynamic = false;

        this.width = type.width;
        this.height = type.height;
        this.iconSize = type.iconSize;
        this.countX = type.countX;
        this.countY = type.countY;

        this.locationX = 0;
        this.locationY = 0;

        this.tileInfo = tileInfo || {};
        that = this;
        tileInfoProperties.forEach(function(propertyName) {
            if(tileInfo.hasOwnProperty(propertyName)) {
                defineProperty.call(that, propertyName, function() {
                    return that.tileInfo[propertyName];
                });
            }
        });

        if(this.tileInfo.updateStyle === "moveup") {
            this.updateStyle = tileUpdater.moveup;
        } else {
            this.updateStyle = tileUpdater.rotate;
        }

        this.updateFn = 
            ui.core.isFunction(this.tileInfo.updateFn) 
                ? this.tileInfo.updateFn 
                : null;
        if(this.updateFn) {
            this.isDynamic = true;
            this.interval = 
                ui.core.isNumber(this.tileInfo.interval)
                    ? this.tileInfo.interval
                    : 60;
            if(this.interval <= 0) {
                this.interval = 60;
            }
        }
        this._render();
    },
    _render: function() {
        this.tilePanel = $("<div class='ui-tile tile-" + this.type + "' />");
        
        this.tileInner = $("<div class='tile-inner' />");
        this.tileInner.css("background-color", this.color);
        this.tilePanel.append(this.tileInner);
        
        this.iconImg = $("<img class='tile-icon' />");
        this.iconImg.prop("src", this.icon);
        this.iconImg.css({
            "width": this.iconSize + "px",
            "height": this.iconSize + "px",
            "left": (this.width - this.iconSize) / 2 + "px",
            "top": (this.height - this.iconSize) / 2 + "px"
        });

        this.smallIconImg = null;
        if(this.type !== "small") {
            // 内容面板
            //this.contentHeight = this.height - titleHeight;
            this.contentPanel = $("<div class='tile-content' />");
            //this.contentPanel.css("height", this.contentHeight + "px");
            this.contentPanel.append(this.iconImg);

            // 磁贴标题
            this.titlePanel = $("<div class='tile-title' />");
            this.titlePanel.html("<span class='tile-title-text'>" + this.title + "</span>");
            
            this.tileInner
                    .append(this.contentPanel)
                    .append(this.titlePanel);
            if(this.isDynamic) {
                this.updateStyle.render.call(this);
            }
        } else {
            this.tileInner.append(this.iconImg);
        }

        this.linkAnchor = null;
        if(ui.core.isString(this.link) && this.link.length > 0) {
            this.linkAnchor = $("<a class='tile-link " + this.type + "' />");
            this.linkAnchor.prop("href", this.link);
            this.tilePanel.append(this.linkAnchor);
        }
    },
    /** 更新磁贴 */
    updateTile: function(content) {
        var builder,
            i, len;
        if(ui.core.isString(content)) {
            builder = ["<p class='update-inner'><span>", content, "</span></p>"];
            builder = builder.join("");
        } else if(Array.isArray(content)) {
            builder = [];
            builder.push("<p class='update-inner'>");
            for(i = 0, len = content.length; i < len; i++) {
                builder.push("<span>", content[i], "</span>");
                if(len < len - 1) {
                    builder.push("<br />");
                }
            }
            builder.push("</p>");
            builder = builder.join("");
        } else if(ui.core.isFunction(content)) {
            builder = content.call(this);
        } else {
            return;
        }

        this.updateStyle.update.call(this, builder);
    },
    restore: function() {
        this.updateStyle.restore.call(this);
    }
};

function TileGroup(tileInfos, container) {
    if(this instanceof TileGroup) {
        this.initialize(tileInfos, container);
    } else {
        return new TileGroup(tileInfos, container);
    }
}
TileGroup.prototype = {
    initialize: function(tileInfos, container) {
        var arr = [],
            that;
        
        this.container = container;
        that = this;
        tileInfos.forEach(function(tileInfo) {
            var tile = new Tile(tileInfo, that);
            if(tile.isDynamic) {
                that.container.putDynamicTile(tile);
            }
            arr.push(tile);
        });
        
        ui.ArrayFaker.prototype.setArray.call(this, arr);
        this.titleHeight = groupTitleHeight;
        this._render();
    },
    _render: function() {
        var i, len;

        this.groupPanel = $("<div class='ui-tile-group' />");
        this.groupPanel.css("visibility", "hidden");
        this.groupTitle = $("<div class='ui-tile-group-title' />");
        this.groupContent = $("<div class='ui-tile-group-content' />");
        this.groupPanel
                .append(this.groupTitle)
                .append(this.groupContent);

        for(i = 0, len = this.length; i < len; i++) {
            this.groupContent.append(this[i].tilePanel);
        }
    }, 
    _calculatePosition: function(size, positionBox, currentPosition, countX, countY) {
        var row, cell, i,
            x, y,
            indexX, xLen, 
            indexY, yLen,
            positionX, positionY;

        x = currentPosition.x;
        y = currentPosition.y;

        for(;;) {
            // 确保有空间
            for(i = 0; i < countY; i++) {
                if(!positionBox[y + i]) {
                    // 用最小单位来作为网格标注，以免浪费空间
                    positionBox[y + i] = new Array(size * tileSize.medium.countX);
                }
            }

            positionX = x;
            positionY = y;

            // 检查合适的空间
            for(indexY = y, yLen = y + countY; indexY < yLen; indexY++) {
                row = positionBox[indexY];
                for(;;) {
                    indexX = x;
                    xLen = x + countX;
                    if(xLen > row.length || indexX >= row.length) {
                        positionX = -1;
                        break;
                    }
                    for(; indexX < xLen; indexX++) {
                        if(row[indexX]) {
                            // 发现起始点已经被使用则位移
                            x = indexX + 1;
                            positionX = -1;
                            break;
                        }
                    }
                    if(positionX !== -1) {
                        break;
                    } else {
                        positionX = x;
                    }
                }
                if(positionX === -1) {
                    break;
                }
            }

            if(positionX !== -1 && positionY !== -1) {
                currentPosition.x = positionX;
                currentPosition.y = positionY;
                // 标记空间已经被使用
                for(indexY = positionY, yLen = positionY + countY; indexY < yLen; indexY++) {
                    row = positionBox[indexY];
                    for(indexX = positionX, xLen = positionX + countX; indexX < xLen; indexX++) {
                        row[indexX] = true;
                    }
                }
                return;
            }
        
            x = 0;
            y += 2;
        }
    },
    arrange: function(size) {
        var i, len,
            standard,
            smallCount, smallX, smallY, smallIndex,
            positionBox, currentPosition, tile;

        standard = tileSize.medium;
        positionBox = [];
        // 本次的起始位置
        currentPosition = {
            x: 0,
            y: 0
        };
        // 每一次循环都是medium的倍数
        for(i = 0, len = this.length; i < len;) {
            tile = this[i];
            if(tile.countX <= standard.countX && tile.countY <= standard.countY) {
                this._calculatePosition(size, positionBox, currentPosition, standard.countX, standard.countY);
            } else {
                this._calculatePosition(size, positionBox, currentPosition, tile.countX, tile.countY);
            }

            if(tile.type === "small") {
                smallCount = tileSize.medium.countX * tileSize.medium.countY;
                smallX = currentPosition.x;
                smallY = currentPosition.y;
                smallIndex = 1;
                // 获取连续的小磁贴，最多获取4枚，组成一个medium磁贴
                while(smallIndex <= smallCount) {
                    tile = this[i];
                    if(!tile || tile.type !== "small") {
                        break;
                    }
                    tile.tilePanel.css({
                        top: smallY * (tileSize.small.height + tileMargin) + "px",
                        left: smallX * (tileSize.small.width + tileMargin) + "px"
                    });
                    smallIndex++;
                    if(smallX % tileSize.medium.countX === 0) {
                        smallX = currentPosition.x + 1;
                    } else {
                        smallX = currentPosition.x;
                        smallY = currentPosition.y + Math.floor(smallIndex / tileSize.medium.countX);
                    }
                    i++;
                }
                currentPosition.x += tileSize.medium.countX;
            } else {
                tile.tilePanel.css({
                    top: currentPosition.y * (tileSize.small.height + tileMargin) + "px",
                    left: currentPosition.x * (tileSize.small.width + tileMargin) + "px"
                });
                currentPosition.x += tile.countX;
                i++;
            }
        }

        len = positionBox[0].length;
        this.width = len * tileSize.small.width + (len - 1) * tileMargin;
        len = positionBox.length;
        this.height = len * tileSize.small.height + (len - 1) * tileMargin;
        
        this.groupContent.css("height", this.height + "px");
        this.height += this.titleHeight;
        this.groupPanel.css({
            "width": this.width + "px",
            "height": this.height + "px"
        });
    },

    addTile: function(tileInfo) {
        var tile = new Tile(tileInfo);
        ui.ArrayFaker.prototype.push(tile);
    },
    removeTile: function(tileInfo) {

    }
};

// 磁贴容器
function TileContainer(containerPanel) {
    if(this instanceof TileContainer) {
        this.initialize(containerPanel);
    } else {
        return new TileContainer(containerPanel);
    }
}
TileContainer.prototype = {
    initialize: function(containerPanel) {
        this.groups = [];
        this.dynamicMap = {};
        this.dynamicTiles = {};

        this.container = ui.getJQueryElement(containerPanel);
        if(!this.container) {
            this.container = $("<div class='ui-tile-container' />");
        } else {
            this.container.addClass("ui-tile-container");
        }
        // 添加底部留白占位符
        this.tileMargin = $("<div class='tile-margin' />");
        this.container.append(this.tileMargin);
    },
    _calculateGroupLayoutInfo: function(containerWidth) {
        var size,
            medium,
            groupCount,
            groupWidth;

        medium = tileSize.medium;
        size = 4;
        groupWidth = size * medium.width + (size - 1) * tileMargin;
        groupCount = Math.floor((containerWidth - edgeDistance) / (groupWidth + edgeDistance));

        if(groupCount > 1 && this.groups.length === 1) {
            groupCount = 1;
        }
        if(groupCount < 1) {
            size = Math.floor(containerWidth / (medium.width + edgeDistance));
            // 最少一行放两个磁贴
            if(size < 2) {
                size = 2;
            }
        } else if(groupCount === 1) {
            size += Math.floor((containerWidth - edgeDistance - groupWidth) / (medium.width + edgeDistance));
            if(size % 2) {
                size--;
            }
        }
        return {
            // 水平放几组
            groupCount: groupCount ? groupCount : 1,
            // 每组一行放几个标准磁贴
            groupSize: size
        };
    },
    /** 布局磁贴 */
    layout: function(containerWidth, containerHeight) {
        var groupLayoutInfo,
            groupWholeWidth,
            groupWholeHeight,
            groupEdgeDistance, 
            scrollWidth,
            group,
            groupTemp,
            i, len, j;

        if(this.groups.length === 0) {
            return;
        }
        groupLayoutInfo = this._calculateGroupLayoutInfo(containerWidth);
        
        // 排列每一组磁贴
        groupWholeHeight = [];
        for(i = 0, len = this.groups.length; i < len;) {
            for(j = 0; j < groupLayoutInfo.groupCount; j++) {
                if(i >= len) {
                    break;
                }
                group = this.groups[i];
                group.arrange(groupLayoutInfo.groupSize);
                if(!groupWholeHeight[j]) {
                    groupWholeHeight[j] = 0;
                }
                groupWholeHeight[j] += group.height;
                i++;
            }
        }
        // 获取高度
        j = 0;
        for(i = 0, len = groupWholeHeight.length; i < len; i++) {
            if(j < groupWholeHeight[i]) {
                j = groupWholeHeight[i];
            }
        }
        groupWholeHeight = j;
        // 设置底部留白
        groupWholeHeight += groupTitleHeight;

        scrollWidth = 0;
        if(groupWholeHeight > containerHeight) {
            scrollWidth = ui.scrollbarWidth;
        }
        groupWholeWidth = this.groups[0].width * groupLayoutInfo.groupCount + edgeDistance * (groupLayoutInfo.groupCount - 1);
        groupEdgeDistance = (containerWidth - scrollWidth - groupWholeWidth) / 2;
        
        // 排列组
        groupTemp = {};
        for(i = 0, len = this.groups.length; i < len;) {
            groupTemp.left = groupEdgeDistance;
            for(j = 0; j < groupLayoutInfo.groupCount; j++) {
                if(i >= len) {
                    break;
                }
                group = this.groups[i];
                if(groupTemp[j] === undefined) {
                groupTemp[j] = 0;
                }
                group.left = groupTemp.left;
                group.top = groupTemp[j];
                group.groupPanel.css({
                "left": group.left + "px",
                "top": group.top + "px",
                "visibility": "visible"
                });
                groupTemp.left += group.width + edgeDistance;
                groupTemp[j] += group.height;
                i++; 
            }
        }

        this.tileMargin.css("top", groupWholeHeight + "px");
    },
    /** 添加组 */
    addGroup: function(groupName, tileInfos) {
        var group;
        if(!Array.isArray(tileInfos) || tileInfos.length === 0) {
            return;
        }
        group = new TileGroup(tileInfos, this);
        if(groupName) {
            group.groupTitle.html("<span>" + groupName + "</span>");
        }
        this.groups.push(group);
        this.container.append(group.groupPanel);
    },
    /** 放置动态磁贴 */
    putDynamicTile: function(dynamicTile) {
        var tileName,
            dynamicInfo,
            interval;

        tileName = dynamicTile.name;
        if(!tileName) {
            throw new TypeError("tileName can not be null");
        }
        if(this.dynamicTiles.hasOwnProperty(tileName)) {
            throw new TypeError("The dynamicTile is exist which name is '" + tileName + "'");
        }

        this.dynamicTiles[tileName] = dynamicTile;
        interval = dynamicTile.interval;
        dynamicInfo = this.dynamicMap[interval];
        if(!dynamicInfo) {
            dynamicInfo = new DynamicInfo(this, interval);
            dynamicInfo.register();
            this.dynamicMap[interval] = dynamicInfo;
        }
        dynamicInfo.tiles.push(tileName);
    },
    /** 获取动态磁贴 */
    getDynamicTileByName: function(tileName) {
        var dynamicTile;

        dynamicTile = this.dynamicTiles[tileName + ""];
        if(!dynamicTile) {
            return null;
        }
        return dynamicTile;
    }
};

// dynamicInfo
function DynamicInfo(context, interval) {
    this.context = context;
    this.interval = interval;
    this.tiles = [];
}
DynamicInfo.prototype = {
    /** 注册动态更新器 */
    register: function(interval) {
        var that = this;
        if(!ui.core.isNumber(interval) || interval <= 0) {
            interval = this.interval
        } else {
            this.interval = interval;
        }
        this.dynamicDelayHandler = setTimeout(function() {
            that.dynamicDelayHandler = null;
            that.update();
        }, interval * 1000);
    },
    /** 取消注册 */
    unregister: function() {
        if(this.dynamicDelayHandler) {
            clearTimeout(this.dynamicDelayHandler);
        }
    },
    /** 开始更新 */
    update: function() {
        var i, len,
            tile;
        for(i = 0, len = this.tiles.length; i < len; i++) {
            tile = this.context.dynamicTiles[this.tiles[i]];
            if(ui.core.isFunction(tile.updateFn)) {
                tile.updateFn.call(this, tile, i === len - 1);
            }
        }
    }
};

ui.TileContainer = TileContainer;
