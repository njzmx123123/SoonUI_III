
<partial id="title">下拉列表</partial>
<partial id="header">SELECTION</partial>

<partial id="content">
    <div class="content-panel">
        <dl class="ui-fold-view" style="padding:20px;">
            <dt>ui.ctrls.SelectionList</dt>
            <dd class="section-container">
                <p class="description-paragraph">
                    下拉列表(ui.ctrls.SelectionList)是作为select标签的替代方案，可以实现很多个性化的操作。<br />
                    <span class="font-highlight">单选模式</span>
                </p>
                <div class="box-line">
                    <label class="label-text">请选择您喜欢的英文名：</label>
                    <br />
                    <input id="simpleList" type="text" class="select-text" />
                </div>
                <p class="description-paragraph">
                    <span class="font-highlight">多选模式</span>，设置配置参数<span class="font-highlight">multiple: true</span>
                </p>
                <div class="box-line">
                    <label class="label-text">请选择您喜欢的编程语言：</label>
                    <br />
                    <input id="multipleList" type="text" class="select-text" />
                </div>
                <p class="description-paragraph">
                    <span class="font-highlight">自定义格式</span>，设置配置参数<span class="font-highlight">itemFormatter: Function</span>，可以完全自己去构建每个li元素中的dom结构。<br />
                    <span class="font-highlight">itemFormatter</span>接口有三个参数(itemData, index, li)<br />
                    itemData: 数据项 <br />
                    index： 当前项的索引 <br />
                    li: 当前li的dom元素<br />
                </p>
                <div class="box-line">
                    <label class="label-text">请选择您喜欢的颜色：</label>
                    <br />
                    <a id="colorBox" href="javascript:void(0)" style="display:inline-block;width:32px;height:32px;background-color:#333;cursor:pointer;"></a>
                </div>
            </dd>
            <dt>ui.ctrls.SelectionTree</dt>
            <dd class="section-container">
                <p class="description-paragraph">
                    多级下拉列表(ui.ctrls.SelectionTree)是为了解决原来多级联动下拉列表比较占用空间的问题，采用“下拉树”的展现形式既能直观的表现数据之间的层级关系，也能很好的节省空间，为界面布局提供良好的支持。特别是在一些布局很局促的情况下显得特别有优势。<br />
                    <span class="font-highlight">重要参数：</span><br />
                    valueField: 获取值的属性名称，可以用多个值进行组合，用数组传入["id", "name"], 可以支持子属性node.id，可以支持function<br />
                    textField: 获取文字的属性名称，可以用多个值进行组合，用数组传入["id", "name"], 可以支持子属性node.id，可以支持function<br />
                    parentField: 获取父节点的属性名称，可以用多个值进行组合，用数组传入["id", "name"], 可以支持子属性node.id，可以支持function<br />
                    childField: 子节点的属性名称，子节点为数组，和parentField互斥，如果两个值都设置了，优先使用childField<br />
                    viewData: 视图数据<br />
                    nodeSelectable: 是否可以选择父节点<br />
                    defaultExpandLevel: 默认展开的层级，false|0：显示第一层级，true：显示所有层级，数字：显示的层级值(0表示根级别，数值从1开始)<br />
                    <span class="font-highlight">单选模式</span>
                </p>
                <div class="box-line">
                    <label class="label-text">请选择您喜欢的名称：</label>
                    <br />
                    <input id="simpleTree" type="text" class="select-text" />
                </div>
                <p class="description-paragraph">
                    <span class="font-highlight">多选模式</span>，设置配置参数<span class="font-highlight">multiple: true</span><br />
                    如果要显示“枝节点”不能选，可以设置参数<span class="font-highlight">nodeSelectable: false</span>
                </p>
                <div class="box-line">
                    <label class="label-text">请选择：</label>
                    <br />
                    <input id="multipleTree" type="text" class="select-text" />
                </div>
                <p class="description-paragraph">
                    <span class="font-highlight">延迟渲染</span>，设置配置参数<span class="font-highlight">lazy: true</span><br />
                    有时候数据量很大，如要展示全国所有的省、市、区县，共三千多条数据。一次将这么多数据渲染出来会造成页面响应变慢。这是可以使用延迟渲染，等到用户展开节点的时候再进行渲染。
                </p>
                <div class="box-line">
                    <label class="label-text">请选择：</label>
                    <br />
                    <input id="lazyTree" type="text" class="select-text" />
                </div>
                <p class="description-paragraph">
                    <span class="font-highlight">自动完成</span><br />
                    $("#autoCompleteTree").autocompleteSelectionTree({ ... });
                </p>
                <div class="box-line">
                    <label class="label-text">请选择：</label>
                    <br />
                    <input id="autoCompleteTree" type="text" class="select-text" />
                </div>
            </dd>
        </dl>
    </div>
</partial>

<partial id="style">
    <style type="text/css">
        .content-panel {
            width: 100%;
            height: 100%;
            overflow: auto;
        }

        .section-container {
            width: 100%;
            height: auto;
        }

        .description-paragraph {
            /* text-indent: 2em; */
            line-height: 1.5;
            font-size: 1.25em;
        }

        .box-line {
            width: 100%;
            height: 60px;
            overflow: visible;
        }

        .box-column {
            width: 240px;
            height: 100%;
            float: left;
        }

        .label-text {
            line-height: 24px;
        }
    </style>
</partial>

<partial id="script">
    <script type="text/javascript">
        (function() {
            window.pageLogic = {
                init: {
                    before: function() {
                        this.contentPanel = $(".content-panel");

                        createSimpleSelectionList.call(this);
                        createMultipleSelectionList.call(this);
                        createCustomStyleSelectionList.call(this);

                        createSimpleSelectionTree.call(this);
                        createMultipleSelectionTree.call(this);
                        createLazySelectionTree.call(this);
                        createAutoCompleteTree.call(this);

                        $(".ui-fold-view").foldView();
                    },
                    layout: function() {
                        ui.master.resize(function(e) {
                            var width = ui.master.contentBodyWidth, 
                                height = ui.master.contentBodyHeight;
                        });
                    },
                    after: function() {

                    },
                    events: function() {

                    },
                    load: function() {
                        
                    }
                }
            };

            function createSimpleSelectionList() {
                this.simpleList = $("#simpleList").selectionList({
                    valueField: "id",
                    textField: "name",
                    layoutPanel: this.contentPanel,
                    viewData: [
                        { id: 1, name: "Jack" },
                        { id: 2, name: "Lucy" },
                        { id: 3, name: "Mark" },
                        { id: 4, name: "Louis" },
                        { id: 5, name: "John" }
                    ]
                });
                /*
                特定条件的选项不可选中
                this.simpleList.changing(function(e, eventData) {
                    if(eventData.itemData.name === "Jack") {
                        return false;
                    }
                });
                */
                this.simpleList.changed(function(e, eventData) {
                    this.element.val(eventData.itemData.name);
                });
                this.simpleList.cancel(function(e) {
                    this.element.val("");
                });

                // 根据id选中元素
                //this.simpleList.setSelection(1);
                // 更加数据项选中元素
                //this.simpleList.setSelection(this.simpleList.getViewData()[1]);
            }

            function createMultipleSelectionList() {
                this.multipleList = $("#multipleList").selectionList({
                    multiple: true,
                    valueField: "id",
                    textField: "name",
                    layoutPanel: this.contentPanel,
                    viewData: [
                        { id: 1, name: "Java" },
                        { id: 2, name: "C#" },
                        { id: 3, name: "VB.Net" },
                        { id: 4, name: "C" },
                        { id: 5, name: "C++" },
                        { id: 6, name: "JavaScript" },
                        { id: 7, name: "TypeScript" },
                        { id: 8, name: "F#" },
                        { id: 9, name: "Objective-C" },
                        { id: 10, name: "SQL" }
                    ]
                });
                this.multipleList.changed(function(e, eventData) {
                    var arr = this.getSelection(),
                        data = [],
                        i;
                    for(i = 0; i < arr.length; i++) {
                        data.push(arr[i].name);
                    }
                    if(data.length > 2) {
                        this.element.attr("title", data.join(","));
                        this.element.val(data[0] + "," + data[1] + "...");
                    } else {
                        this.element.removeAttr("title");
                        this.element.val(data.join(","));
                    }
                });
                this.multipleList.cancel(function(e) {
                    this.element.val("");
                });
                this.multipleList.setSelection([2, 6, 7]);
            }

            function createCustomStyleSelectionList() {
                /*
                    SelectionList的父类是DropDownBase，
                    DropDownBase定义了所有的下拉框都是通过focus事件触发，
                    所以这里使用的<a>标签来触发focus方法，并且a标记一定要有href
                    如果想换成click事件可以这样写:
                    var that = this.customList;
                    this.customList.element
                        .off("focus")
                        .off("click")
                        .on("click", function(e) {
                            e.stopPropagation();
                            ui.hideAll(that);
                            that.show();
                        });
                */
                this.customList = $("#colorBox").selectionList({
                    valueField: "colorValue",
                    textField: "colorName",
                    width: 160,
                    viewData: [
                        { colorValue: "#EF81B2", colorName: "Dolly Gal" },
                        { colorValue: "#B37AE1", colorName: "Purple" },
                        { colorValue: "#729ED3", colorName: "Mod Pervenche" },
                        { colorValue: "#6BC59C", colorName: "Summer Soon" },
                        { colorValue: "#1F98B3", colorName: "Turquoise" },
                        { colorValue: "#CC696A", colorName: "White Red" }
                    ],
                    itemFormatter: function(itemData, index, li) {
                        var colorBlock,
                            text;

                        colorBlock = $("<b />");
                        colorBlock.css({
                            "display": "inline-block",
                            "vertical-align": "top", 
                            "margin-top": "3px",
                            "margin-left": "3px",
                            "margin-right": "3px",
                            "width": "24px",
                            "height": "24px",
                            "background-color": itemData.colorValue
                        });
                        text = $("<span />").text(itemData.colorName);
                        return [colorBlock, text];
                    }
                });
                this.customList.changed(function(e, eventData) {
                    this.element.css("background-color", eventData.itemData.colorValue);
                });
            }

            function createSimpleSelectionTree() {
                this.simpleTree = $("#simpleTree").selectionTree({
                    valueField: "id",
                    textField: "name",
                    childField: "children",
                    layoutPanel: "body",
                    nodeSelectable: false,
                    defaultExpandLevel: 1,
                    layoutPanel: this.contentPanel,
                    viewData: [
                        { 
                            id: "1", 
                            name: "中文名", 
                            children: [
                                { id: "1.1", name: "末日博士" },
                                { id: "1.2", name: "神奇先生" },
                                { id: "1.3", name: "雷闪" },
                            ] 
                        },
                        { 
                            id: "2", 
                            name: "英文名", 
                            children: [
                                { id: "2.1", name: "Jack" },
                                { id: "2.2", name: "Lucy" },
                                { id: "2.3", name: "Mark" },
                                { id: "2.4", name: "Louis" },
                                { id: "2.5", name: "John" }
                            ]
                        }
                    ]
                });
                this.simpleTree.changed(function(e, eventData) {
                    this.element.val(eventData.nodeData.name);
                });
                this.simpleTree.cancel(function(e) {
                    this.element.val("");
                });
            }

            function createMultipleSelectionTree() {
                this.multipleTree = $("#multipleTree").selectionTree({
                    valueField: "id",
                    textField: "name",
                    parentField: "parent",
                    width: 160,
                    defaultExpandLevel: 2,
                    nodeSelectable: true,
                    multiple: true,
                    layoutPanel: this.contentPanel,
                    viewData: [
                        { id: "1", name: "第一层" },
                        { id: "1.1", name: "第一一层", parent: "1" },
                        { id: "1.2", name: "第一二层", parent: "1" },
                        { id: "2", name: "第二层" },
                        { id: "2.1", name: "第二一层", parent: "2" },
                        { id: "2.2", name: "第二二层", parent: "2" },
                        { id: "2.1.1", name: "第二一一层", parent: "2.1" },
                        { id: "2.1.2", name: "第二一二层", parent: "2.1" },
                        { id: "2.2.1", name: "第二二一层", parent: "2.2" },
                        { id: "2.2.2", name: "第二二二层", parent: "2.2" },
                        { id: "3", name: "第三层" }
                    ]
                });
                this.multipleTree.changed(function(e, eventData) {
                    var arr = this.getSelection(),
                        data = [],
                        i;

                    /*
                    这个功能一般用在菜单权限这种地方

                    // 如果选中的是父节点，则把下面的子节点都选中
                    if (eventData.isNode) {
                        this.selectChildNode(eventData.element, eventData.isSelection);
                    }
                    // 如果选中的是不是根节点，则把上面的父节点都选中
                    if (!eventData.isRoot) {
                        this.selectParentNode(eventData.element, eventData.isSelection);
                    }
                    */

                    for(i = 0; i < arr.length; i++) {
                        data.push(arr[i].name);
                    }
                    if(data.length > 2) {
                        this.element.attr("title", data.join(","));
                        this.element.val(data[0] + "," + data[1] + "...");
                    } else {
                        this.element.removeAttr("title");
                        this.element.val(data.join(","));
                    }
                });
                this.multipleTree.cancel(function(e) {
                    this.element.val("");
                });
                this.multipleTree.setSelection(["1", "1.1", "1.2", "3"]);
            }

            function createLazySelectionTree() {
                this.lazyTree = $("#lazyTree").selectionTree({
                    valueField: "id",
                    textField: "name",
                    parentField: "parent",
                    width: 160,
                    layoutPanel: this.contentPanel,
                    lazy: true,
                    viewData: [
                        { id: "1", name: "第一层" },
                        { id: "1.1", name: "第一一层", parent: "1" },
                        { id: "1.2", name: "第一二层", parent: "1" },
                        { id: "2", name: "第二层" },
                        { id: "2.1", name: "第二一层", parent: "2" },
                        { id: "2.2", name: "第二二层", parent: "2" },
                        { id: "2.1.1", name: "第二一一层", parent: "2.1" },
                        { id: "2.1.2", name: "第二一二层", parent: "2.1" },
                        { id: "2.2.1", name: "第二二一层", parent: "2.2" },
                        { id: "2.2.2", name: "第二二二层", parent: "2.2" },
                        { id: "3", name: "第三层" }
                    ]
                });
                this.lazyTree.changed(function(e, eventData) {
                    this.element.val(eventData.nodeData.name);
                });
                this.lazyTree.cancel(function(e) {
                    this.element.val("");
                });
            }

            function createAutoCompleteTree() {
                this.autoCompleteTree = $("#autoCompleteTree").autocompleteSelectionTree({
                    valueField: "id",
                    textField: "name",
                    childField: "children",
                    layoutPanel: "body",
                    nodeSelectable: true,
                    defaultExpandLevel: true,
                    layoutPanel: this.contentPanel,
                    viewData: [
                        { 
                            id: "1", 
                            name: "中文名", 
                            children: [
                                { id: "1.1", name: "末日博士" },
                                { id: "1.2", name: "神奇先生" },
                                { id: "1.3", name: "雷闪" },
                            ] 
                        },
                        { 
                            id: "2", 
                            name: "英文名", 
                            children: [
                                { id: "2.1", name: "Jack" },
                                { id: "2.2", name: "Lucy" },
                                { id: "2.3", name: "Mark" },
                                { id: "2.4", name: "Louis" },
                                { id: "2.5", name: "John" }
                            ]
                        }
                    ]
                });
                this.autoCompleteTree.changed(function(e, eventData) {
                    this.element.val(eventData.nodeData.name);
                });
                this.autoCompleteTree.cancel(function(e) {
                    this.element.val("");
                });
            }
        })();
    </script>
</partial>
