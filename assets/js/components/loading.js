/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-08-02 
 * 描述：加载组件
 */
define(["jquery.blockUI", "spin"], function (blockUI, spin) {
    var controler = {
        spinner_config: {
            lines: 11,
            length: 0,
            width: 10,
            radius: 20,
            corners: 1.0,
            trail: 60,
            speed: 1.2
        },

        spinner_config_inner_busy_indicator: {
            lines: 11,
            length: 0,
            width: 4,
            radius: 7,
            corners: 1.0,
            trail: 60,
            speed: 1.2
        },

        //加载列表
        loadings: [],

        init: function(){
            this.initBlockUI();
        },

        initBlockUI: function(){
            $.extend($.blockUI.defaults, {
                message: ' ',
                css: {},
                overlayCSS: {
                    backgroundColor: '#AAA',
                    opacity: 0.3,
                    cursor: 'wait'
                }
            });
        },

        block: function (elm) {
            if (!elm) {
                $.blockUI();
            } else {
                $(elm).block();
            }
        },

        unblock: function (elm) {
            if (!elm) {
                $.unblockUI();
            } else {
                $(elm).unblock();
            }
        },

        deleteLoadingById: function (id) {
            if (!id || this.loadings.length == 0) {
                return false;
            }
            for (var i = 0, j = this.loadings.length; i < j; i++) {
                if (this.loadings[i].id == id) {
                    this.loadings.splice(i, 1);
                    return true;
                }
            }
            return false;
        },

        addLoading: function(options, spin){
            var _lading = {
                id: site.utils.generateGuid(),
                options: options,
                spin: spin
            }
            this.loadings.push(_lading);
            return _lading;
        }
    }
    controler.initBlockUI();
    var loading = {
        //有个问题就是：存在多个loading会同时加载的情况，要怎么处理？现在的处理方式就是返回一个对象，根据实际的业务需要，需要关闭就关闭
        showLoading: function (options) {
            if (controler.spinner) {
                this.hideLoding();
            }
            var _options = $.extend({}, options);
            var elm = _options.elm, _spin;
            if (!elm) {
                if (options.blockUI != false) {
                    controler.block();
                }
                controler.block();
                _spin = new spin(controler.spinner_config).spin($('body')[0]);
                //$('body').spin(controler.spinner_config);
            } else {
                var $elm = $(elm);
                var $busyIndicator = $elm.find('.site-loading'); //TODO@Halil: What if  more than one element. What if there are nested elements?
                if ($busyIndicator.length) {
                    //$busyIndicator.spin(controler.spinner_config_inner_busy_indicator);
                    //$busyIndicator.spin(controler.spinner_config_inner_busy_indicator);
                    _spin = new spin(controler.spinner_config_inner_busy_indicator).spin($busyIndicator[0]);
                } else {
                    if (options.blockUI != false) {
                        controler.block(elm);
                    }
                    //$elm.spin(controler.spinner_config);
                    _spin = new spin(controler.spinner_config).spin($elm[0]);
                }
            }
            return controler.addLoading(_options, _spin);
        },

        hideLoding: function (loading) {
            //if (controler.loading > 0) {
            //    return;
            //}
            //controler.loading = 0;
            if (!loading || !loading.spin || !loading.options) {
                return false;
            }
            loading.spin.spin();
            var elm = loading.options.elm, _isUnblock = false;
            if (loading.options.blockUI != false && controler.loadings.length > 1) {
                for (var i = 0, j = controler.loadings.length; i < j; i++) {
                    if (controler.loadings[i].id != loading.id && controler.loadings[i].blockUI != false) {
                        _isUnblock = true;
                        break;
                    }
                }
            }
            if (_isUnblock || loading.options.blockUI != false) {
                if (!elm) {
                    controler.unblock();
                } else if (_isUnblock) {
                    controler.unblock(elm);
                }
            }
            controler.deleteLoadingById(loading);
        }
    }
    return loading;
});