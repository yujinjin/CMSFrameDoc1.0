/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-08-02 
 * 描述：zTree.js 组件
 */
define(["jquery.ztree.all"], function () {
    var defaults = {
        check: {
            enable: true,
            chkboxType: { "Y": "ps", "N": "s" }
        },
        data: {
            simpleData: {
                enable: true
            }
        }
    }
    var siteZTree = function (data, $selector, setting) {
        var _defaults = $.extend(true, {}, defaults, setting || {});
        this.zTree = $.fn.zTree.init($($selector || "#zTree"), _defaults, data);
        return this;
    }

    //刷新
    siteZTree.prototype.getCheckedNodesId = function () {
        var nodes = this.zTree.getCheckedNodes();
        var items = [];
        for (i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            //var item = { Id: node.id, Name: node.name, IsGrantedByDefault: node.isGrantedByDefault };
            items.push(node.id);
        }
        return items;
    }

    return siteZTree;
});