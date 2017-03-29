/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-09-27
 * 描述：搜索建议组件
 */
define(["bootstrap-suggest"], function () {
    var _search_suggest = function (options, $selector) {
        var _default = {
            idField: "id",
            showBtn: true,
            allowNoKeyword: true,
            getDataMethod: "url",
            listStyle: {
                'padding-top': 0,
                'max-height': '180px',
                'max-width': '800px',
                'overflow': 'auto',
                'width': 'auto',
                'transition': '0.3s',
                '-webkit-transition': '0.3s',
                '-moz-transition': '0.3s',
                '-o-transition': '0.3s'
            },
            fnProcessData: function (data) {
                var _data = {};
                if (data.success) {
                    _data.value = data.result.pageData;
                    return _data;
                } else if (data.error && data.error.message) {
                    site.modal.error(data.error.message);
                } else {
                    site.modal.error("出错了...");
                }
                return _data;
            },
            fnPreprocessKeyword: function (keyword) {
                //请求数据前，对输入关键字作预处理
                return keyword;
            },
            fnAdjustAjaxParam: function (keyword, opts) {
                //调整 ajax 请求参数方法，用于更多的请求配置需求。如对请求关键字作进一步处理、修改超时时间等
                return {
                    type: "POST",
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        keywords: keyword,
                        maxResultCount: 20,
                        skipCount: 0
                    })
                };
            }
        },
        _$selector = $($selector || "[data-type=bootstrap-suggest]"), _this = this;
        if (_$selector.length < 1) {
            site.modal.error("没有可以初始化的搜索组件");
            return this;
        }
        _this.selector = _$selector;
        _this.options = $.extend(true, _default, options);
        _$selector.bsSuggest(_this.options);
        return _this;
    }

    //刷新
    _search_suggest.prototype.getId = function () {
        if (!this.selector) {
            return null;
        }
        return this.selector.attr("data-" + this.options.idField);
    }

    //刷新
    _search_suggest.prototype.getValue = function () {
        if (!this.selector) {
            return null;
        }
        return this.selector.val();
    }

    return _search_suggest;
});