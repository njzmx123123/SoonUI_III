// 图片动态磁贴

if(!ui.tiles) {
    ui.tiles = {};
}

ui.tiles.picture = function(tile, images) {
    var i, len,
        arr;
    if(!Array.isArray(images)) {
        return;
    }
    arr = [];
    for(i = 0, len = images.length; i < len; i++) {
        if(images[i]) {
            arr.push(images[i]);
        }
    }
    if(arr.length === 0) {
        return;
    }

    tile.pictureContext = {
        images: arr,
        currentIndex: 0,
        imageSizeCache: {},
        imageLoader: new ui.ImageLoader()
    };
    initDisplayArea(tile);
    initAnimator(tile);
    showPicture(tile, tile.pictureContext.currentImage, firstPictrue);
};

function initDisplayArea(tile) {
    var context;
    context = tile.pictureContext;

    context.currentImagePanel = $("<div class='tile-picture-container' />");
    context.currentImage = $("<img class='tile-picture' />");
    context.currentImagePanel.append(context.currentImage);

    context.nextImagePanel = $("<div class='tile-picture-container' />");
    context.nextImagePanel.css("display", "none");
    context.nextImage = $("<img class='tile-picture' />");
    context.nextImagePanel.append(context.nextImage);

    tile.updatePanel
            .append(context.currentImagePanel)
            .append(context.nextImagePanel);
}

function initAnimator(tile) {
    var context = tile.pictureContext;
    context.switchAnimator = ui.animator({
        ease: ui.AnimationStyle.easeTo,
        duration: 500,
        begin: 0,
        end: -tile.height,
        onChange: function(val) {
            this.target.css("top", val + "px");
        }
    }).add({
        ease: ui.AnimationStyle.easeTo,
        duration: 500,
        begin: tile.height,
        end: 0,
        onChange: function(val) {
            this.target.css("top", val + "px");
        }
    });
}

function showPicture(tile, currentImg, callback) {
    var imageSrc,
        context,
        setImageFn;

    context = tile.pictureContext;
    if(context.images.length === 0) {
        return;
    }
    imageSrc = context.images[context.currentIndex];
    setImageFn = function(css) {
        currentImg.css(css);
        currentImg.prop("src", imageSrc);
        callback(tile);
    };

    if(context.imageSizeCache.hasOwnProperty(imageSrc)) {
        setImageFn(context.imageSizeCache[imageSrc]);
    } else {
        context.imageLoader
                    .load(imageSrc, tile.width, tile.height, ui.ImageLoader.centerCrop)
                    .then(
                        function(loader) {
                            var css = {
                                "width": loader.displayWidth + "px",
                                "height": loader.displayHeight + "px",
                                "top": loader.marginTop + "px",
                                "left": loader.marginLeft + "px"
                            };
                            context.imageSizeCache[imageSrc] = css;
                            setImageFn(css);
                        }, 
                        function() {
                            context.images.splice(index, 1);
                            if(context.images.length > 0) {
                                moveNext(tile);
                                showPicture(tile, currentImg, callback);
                            }
                        }
                    );
    }
}

function firstPictrue(tile) {
    var context = tile.pictureContext,
        option;
    tile.update();

    setTimeout(function() {
        context.currentImage.addClass("tile-picture-play");
    }, 1000);
    setTimeout(function() {
        if(context.images.length > 1) {
            moveNext(tile);
            showPicture(tile, context.nextImage, nextPicture);
        }
    }, 10000);
}

function nextPicture(tile) {
    var temp,
        context,
        option;
    context = tile.pictureContext;

    temp = context.currentImagePanel;
    context.currentImagePanel = context.nextImagePanel;
    context.nextImagePanel = temp;
    temp = context.currentImage;
    context.currentImage = context.nextImage;
    context.nextImage = temp;

    option = context.switchAnimator[0];
    option.target = context.nextImagePanel;
    option = context.switchAnimator[1];
    option.target = context.currentImagePanel;
    option.target.css({
        "top": tile.height + "px",
        "display": "block"
    });

    context.switchAnimator.start().then(function() {
        context.nextImagePanel.css("display", "none");
        context.nextImage.removeClass("tile-picture-play");
        setTimeout(function() {
            context.currentImage.addClass("tile-picture-play");
            setTimeout(function() {
                if(context.images.length > 1) {
                    moveNext(tile);
                    showPicture(tile, context.nextImage, nextPicture);
                }
            }, 10000);
        }, 500);
    });
}

function moveNext(tile) {
    var context,
        index;

    context = tile.pictureContext;
    index = context.currentIndex + 1;
    if(index >= context.images.length) {
        index = 0;
    }
    context.currentIndex = index;
}
