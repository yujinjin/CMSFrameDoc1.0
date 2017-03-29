/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-09-22
 * 描述：数据验证插件
 */
define(["jquery.validate"], function () {
    var validate = {
        //默认验证消息
        message: {
            required: "此项是必须填写的",
            remote: "请修正该字段",
            email: "请输入正确格式的电子邮件",
            url: "请输入合法的网址",
            date: "请输入合法的日期",
            dateISO: "请输入合法的日期 (ISO).",
            number: "请输入合法的数字",
            digits: "只能输入整数",
            creditcard: "请输入合法的信用卡号",
            equalTo: "请再次输入相同的值",
            accept: "请输入拥有合法后缀名的字符串",
            extension: "请输入有效的后缀",
            maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
            minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
            rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
            range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
            max: jQuery.validator.format("请输入一个最大为{0} 的值"),
            min: jQuery.validator.format("请输入一个最小为{0} 的值"),
            zip: "请输入有效的中国邮政编码"
        },

        //自定义验证提示样式
        style: {
            //元素错误样式
            error: { "formClass": "has-error", "fontStyle": "glyphicon-remove" },

            //元素成功样式
            success: { "formClass": "has-success", "fontStyle": "glyphicon-ok" },

            //元素警告样式
            warning: { "formClass": "has-warning", "fontStyle": "glyphicon-warning-sign" }
        },

        //验证插件初始化
        init: function () {
            $.extend($.validator.messages, validate.message);
            validate.addCommonMethod();
        },

        //添加常用的自定义验证方法
        addCommonMethod: function () {
            // 邮政编码验证   
            $.validator.addMethod("isZipCode", function (value, element) {
                var tel = /^[0-9]{6}$/;
                return this.optional(element) || (tel.test(value));
            }, "请正确填写您的邮政编码");

            $.validator.addMethod("mobile", function (value, element) {
                var tel = /^(13[0-9]|15[012356789]|17[0123456789]|18[0-9]|14[57])[0-9]{8}$/;
                return this.optional(element) || (tel.test(value));
            }, "请正确填写您的手机号码");
            $.validator.addMethod("onlyEnAndNum", function (value, element) {
                var tel = /[^a-zA-Z0-9]/;
                return this.optional(element) || (!tel.test(value) && value.length < 11);
            }, "只能输入英文和数字,最长10个字符");
            $.validator.addMethod("realLength", function (value, element) {
                var len = value.replace(/[^\x00-\xff]/g, "01").length;
                return this.optional(element) || len <= 12;
            }, "客服昵称，最长6个汉字或12个英文字符");
        },

        formSubmit: function (selector, options) {
            var _default = $.extend(true, {
                complete: function () {
                    $(selector).find("[type=submit]").prop("disabled", false);
                }
            }, options || {}), model = validate.formSerialize(selector);
            _default.data = $.extend(true, {}, options.data || {}, model);
            $(selector).find("[type=submit]").prop("disabled", true);
            site.ajax(_default);
        },

        formSerialize: function (form) {
            var _form = $(form);
            if (_form.length < 1) {
                return false;
            }
            var lookup = {}; //current reference of data
            var selector = ':input[type!="checkbox"][type!="radio"], input:checked';
            var parse = function () {
                if (this.disabled) {
                    return;
                }
                var named = this.name.replace(/\[([^\]]+)?\]/g, ',$1').split(',');
                var cap = named.length - 1;
                var $el = $(this);
                if (named[0]) {
                    for (var i = 0; i < cap; i++) {
                        lookup[named[i]] = lookup[named[i]] ||
                          ((named[i + 1] === "" || named[i + 1] === '0') ? [] : {});
                    }
                    if (lookup.length !== undefined) {
                        lookup.push($el.val());
                    } else if (typeof (lookup[named[cap]]) != "undefined") {
                        if (typeof (lookup[named[cap]]) == "string") {
                            lookup[named[cap]] = [lookup[named[cap]]];
                        }
                        lookup[named[cap]].push($el.val());
                    } else {
                        lookup[named[cap]] = $el.val();
                    }
                }
            };
            _form.filter(selector).each(parse);
            _form.find(selector).each(parse);
            return lookup;
        },

        //修改元素样式
        changeStyle: function (element, data, message) {
            var item = $(element);
            if (item.closest(".form-group").length > 0) {
                var _form_group = item.closest(".form-group");
                if (!_form_group.hasClass(data.formClass) && item.attr('type') !== 'hidden' && item.attr('data-flag') !== "false") {
                    //如果是隐藏域或者表单注明不需要加入提示标志
                    _form_group.addClass(data.formClass + ' has-feedback');
                    item.after('<span class="glyphicon ' + data.fontStyle + ' form-control-feedback" aria-hidden="true"></span>');
                }
            }
            if (item.attr('type') !== 'hidden') {
                item.attr("title", message);
                item.tooltip({ container: 'body', placement: 'top', animation: false });
            } else if (item.closest("[data-tooltip='true']").length > 0) {
                //如果隐藏域的表单有父标签特别注明需要引入提示插件就去在提示显示提示插件的地方显示
                item = item.closest("[data-tooltip='true']");
                item.attr("title", message);
                item.tooltip({ container: 'body', placement: 'top', animation: false });
            }
        },

        deleteStyle: function (element) {
            var item = $(element);
            var _tip_class = null;
            if (item.closest(".form-group").hasClass("has-error")) {
                _tip_class = "has-error";
            } else if (item.closest(".form-group").hasClass("has-warning")) {
                _tip_class = "has-warning";
            } else if (item.closest(".form-group").hasClass("has-success")) {
                _tip_class = "has-success";
            }
            if (_tip_class) {
                //树形下拉控件单独处理
                if (item.prop('class') != null && item.prop('class').indexOf('combo-text') >= 0) item = item.closest(".input-group");
                item.closest(".form-group").removeClass(_tip_class + ' has-feedback');
                item.next(".form-control-feedback").remove();
                item.removeAttr("title");
                item.tooltip('destroy');
            }
        }
    }
    validate.init();
    return {
        // form表单验证,验证通过后直接提交表单数据  selector:选择器   ajaxFormOptions:ajax form表单提交的选项，如果没有提供该选项就直接form提交  jquery validate表单的选项
        validate: function (selector, ajaxFormOptions, validateOptions) {
            var _default_validate_options = {
                ignore: "",
                rules: {},
                messages: {},
                showErrors: function (errorMap, errorList) {
                    if (errorList && errorList.length > 0) {
                        //切换到当前tab页
                        try {
                            var el = $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []);
                            $(".nav-tabs").find('a[href="#' + el.closest('.tab-pane[id]').attr('id') + '"]').tab('show');
                        } catch (e) {
                            console.log("验证出错了:" + e);
                        }
                    }
                    this.defaultShowErrors();
                },
                submitHandler: function (form) {
                    try {
                        if (ajaxFormOptions) {
                            var _defalut_ajax_options = {}, _submit_result;
                            if ($.isFunction(_default_validate_options.beforeSubmit)) {
                                _submit_result = validateOptions.beforeSubmit(form);
                                if (!_submit_result) {
                                    site.log.debug("不提交了");
                                    return;
                                }
                                if ($.isPlainObject(_submit_result)) {
                                    $.extend(true, _defalut_ajax_options, _submit_result);
                                }
                            }
                            $.extend(true, _defalut_ajax_options, ajaxFormOptions);
                            validate.formSubmit(selector, _defalut_ajax_options);
                            return false;
                        } else {
                            form.submit();
                        }
                    } catch (e) {
                        console.error("自定义函数异常，不提交了", e);
                        return;
                    }
                },
                errorPlacement: function (label, element) {
                    var _message = $(label).text();
                    if (!_message) {
                        return;
                    }
                    var type = $(element).attr("data-validate-type");
                    if (!type || !validate.style[type]) {
                        type = "error";
                    }
                    validate.changeStyle(element, validate.style[type], $(label).text());
                },
                success: function (label, element) {
                    validate.deleteStyle(element);
                    if (_default_validate_options.successStyle === true || $(element).attr("data-validate-succes") === "true") {
                        validate.changeStyle(element, validate.style.success, $(label).text());
                    }
                    return;
                }
            };
            $.extend(true, _default_validate_options, validateOptions);
            return $(selector).validate(_default_validate_options);
        }
    };
});