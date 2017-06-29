
function setHighlight(color) {
    var sheet,
        styleUrl;
    sheet = $("#" + ui.theme.themeSheetId);
    if(sheet.length > 0) {
        styleUrl = sheet.prop("href");
        styleUrl = ui.url.setParams({
            highlight: color.Id
        });
        sheet.prop("href", styleUrl);
    }
    ui.theme.getHighlight = color;
    ui.page.fire("highlightChanged", color);
}

//主题
ui.theme = {
    /** 当前的主题 */
    currentTheme: "Light",
    /** 用户当前设置的主题 */
    currentHighlight: null,
    /** 默认主题色 */
    defaultHighlight: "Default",
    /** 主题文件StyleID */
    themeSheetId: "theme",
    /** 获取高亮色 */
    getHighlight: function (highlight) {
        var highlightInfo,
            info;
        if (!highlight) {
            highlight = this.defaultHighlight;
        }
        if (Array.isArray(this.Colors)) {
            for (var i = 0, l = this.Colors.length; i < l; i++) {
                info = this.Colors[i];
                if (info.Id === highlight) {
                    highlightInfo = info;
                    break;
                }
            }
        }
        return highlightInfo;
    },
    /** 修改高亮色 */
    changeHighlight: function(url, color) {
        ui.ajax.ajaxPost(url, 
            { themeId: color.Id },
            function(success) {
                if(success.Result) {
                    setHighlight(color);
                }
            },
            function(error) {
                ui.msgshow("修改主题失败，" + error.message, true);
            }
        );
    },
    /** 设置高亮色 */
    setHighlight: function(color) {
        if(color) {
            setHighlight(color);
        }
    },
    /** 初始化高亮色 */
    initHighlight: function() {
        var sheet,
            styleUrl,
            params;
        sheet = $("#" + ui.theme.themeSheetId);
        if(sheet.length > 0) {
            styleUrl = sheet.prop("href");
            params = ui.url.getParams(styleUrl);
            this.currentHighlight = this.getHighlight(params.highlight);
        }
    }
};
