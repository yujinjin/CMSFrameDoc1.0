/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-11-04 
 * 描述：百度文件上传
 */
define(["webuploader"], function (webuploader) {
    var controler = {
        imgDefaults: {
            auto: false,// 选完文件后，是否自动上传。
            swf: site.config.contextPath + '/assets/scripts/webuploader/Uploader.swf',
            server: site.config.uploadImgServer, // 文件接收服务端。
            resize: true,// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            chunked: true, // 是否要分片处理大文件上传。
            chunkSize: 1024 * 1024 * 10, // 如果要分片，分1M一片
            fileNumLimit: 10, // 验证文件总数量, 超出10个则不允许加入队列
            fileSingleSizeLimit: 1024 * 1024 * 50, // 验证单个文件大小是否超出50M限制, 超出则不允许加入队列。
            pick: {
                id: "#img-upload-button",
                multiple: false
            },// 选择文件的按钮。可选。内部根据当前运行是创建，可能是input元素，也可能是flash.
            formData: {
                imageThumbW: 320,
                imageThumbH: 240,
                fileType: "image"
            }, //表单数据
            accept: {
                title: 'images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/jpg,image/jpeg,image/png' //用‘image/*’chrome弹出上传图片反应迟缓
            },//接受上传文件类型
            thumb: {
                width: 800,
                height: 600,
                quality: 100,// 图片质量，只有type为`image/jpeg`的时候才有效。
                allowMagnify: false,// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                crop: false,// 是否允许裁剪。为空的话则保留原有图片格式。否则强制转换成指定的类型。
                type: 'image/jpeg'
            }, //前端自己生成的缩略图仅供展示（剪切）用
            compress: {
                width: 1920,
                height: 1920,
                quality: 95,// 图片质量，只有type为`image/jpeg`的时候才有效。
                allowMagnify: false,// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                crop: false,// 是否允许裁剪。
                preserveHeaders: true,// 是否保留头部meta信息。
                // 如果发现压缩后文件大小比原来还大，则使用原来图片
                // 此属性可能会影响图片自动纠正功能
                noCompressIfLarger: true,
                // 单位字节，如果图片大小小于100K，不会采用压缩。
                compressSize: 100 * 1024
            } //前端压缩后的图片
        },//默认配置

        //初始化配置
        initImgOptons: function (options) {
            var _options = $.extend(true, {}, controler.imgDefaults, options);
            if (!$.isPlainObject(options)) {
                return _options;
            }
            if (options.pickId) {
                _options.pick.id = options.pickId;
                delete _options.pickId;
            }
            if (_options.thumbWidth && options.thumbHeight) {
                _options.formData.imageThumbW = options.thumbWidth;
                _options.formData.imageThumbH = options.thumbHeight;
                delete _options.thumbWidth;
                delete _options.thumbHeight;
            }
            if (options.maxWidth && options.maxHeight) {
                _options.compress.width = options.maxWidth;
                _options.compress.height = options.maxHeight;
                delete _options.maxWidth;
                delete _options.maxHeight;
            }
            return _options;
        },

        //绑定上传事件
        bindUploaderEvent: function (webUploader, options) {
            if (!$.isPlainObject(options)) {
                return;
            }
            if ($.isFunction(options.fileQueued)) {
                webUploader.on("fileQueued", options.fileQueued);
            } else {
                this.bindFileQueued(webUploader, options);
            }
            if ($.isFunction(options.uploadProgress)) {
                webUploader.on("uploadProgress", options.uploadProgress);
            }
            if ($.isFunction(options.uploadSuccess)) {
                webUploader.on("uploadSuccess", options.uploadSuccess);
            }
            if ($.isFunction(options.uploadError)) {
                webUploader.on("uploadError", options.uploadError);
            }
            if ($.isFunction(options.uploadComplete)) {
                webUploader.on("uploadComplete", options.uploadComplete);
            }
        },

        //绑定上传事件：当有文件添加进来的时候
        bindFileQueued: function (webUploader, options) {
            var _this = this;
            webUploader.on("fileQueued", function (file) {
                _this.bindMakeThumb(webUploader, options, file);
                if ($.isFunction(options.fileQueued)) {
                    options.fileQueued(file, webUploader);
                }
            });
        },

        bindMakeThumb: function(webUploader, options, file) {
            if ((!webUploader.options.auto && options.crop) || (options.maxWidth && options.maxHeight) || (options.width && options.height) || (options.minWidth && options.minHeight)) {
                // 创建缩略图
                var _this = this;
                webUploader.makeThumb(file, function (error, src) {
                    if (error) {
                        site.modal.error('上传图片失败，浏览器版本太低。');
                        return;
                    }
                    var _error_msg = _this.validateImageSize(options, file);
                    if (_error_msg) {
                        if (webUploader.options.auto) webUploader.stop();
                        site.modal.error(_error_msg);
                        return;
                    }
                    var defaults = webUploader.options;
                    if(!defaults.auto) {
                        if (options.crop) {
                            var _scale = (defaults.thumb.width / file._info.width < defaults.thumb.height / file._info.height) ? defaults.thumb.width / file._info.width < defaults.thumb.height : defaults.thumb.height / file._info.height; //裁剪后的图片比例
                            if (_scale > 1) _scale = 1;
                            var callbackFun = function (formParamerters) {
                                if ($.isFunction(options.makeThumb)) {
                                    options.makeThumb(error, src);
                                }
                                _this.upload(webUploader, file, formParamerters, _scale);
                            };
                            //剪切的是缩略图然后按比例还原
                            _this.jcropInit(src, _this.getJcropOptions(_scale, options, file), callbackFun);
                        } else {
                            if ($.isFunction(options.makeThumb)) {
                                options.makeThumb(error, src);
                            }
                            webUploader.upload(file);
                        }
                    }
                });//TODO:测试加上后面2个参数的意义
            } else {
                webUploader.upload();
            }
        },

        //获取裁剪的配置选项
        getJcropOptions: function (scale, options, file) {
            var _options = {
                allowResize: ((options.width && options.height) ? false : true),
                isNotCrop: !((scale < 1 && (options.maxHeight && options.minWidth)) || (options.width && options.height) || (options.minWidth && options.minHeight)), //如果上传的图片太大或者指定了尺寸或最小尺寸就必须剪切
                imgSize: { w: file._info.width * scale, h: file._info.height * scale },//剪切的图片尺寸
                previewImgSize: this.getSuitableImgSize(200, 200, options.thumbWidth || 0, options.thumbHeight || 0), //裁剪后的预览的图片尺寸
                maxSize: [options.width * scale || options.maxWidth * scale || 0, options.height * scale || options.maxHeight * scale || 0],
                minSize: [options.width * scale || options.minWidth * scale || 0, options.height * scale || options.minHeight * scale || 0]
            };
            if (_options.isNotCrop) {
                _options.deaultsSelectSize = [0, 0, _options.imgSize.w * 0.75, _options.imgSize.h * 0.75];
            } else if (_options.maxSize[0] > 0 && _options.maxSize[1] > 0) {
                _options.deaultsSelectSize = [0, 0, _options.maxSize[0], _options.maxSize[1]];
            } else if (_options.minSize[0] > 0 && _options.minSize[1] > 0) {
                _options.deaultsSelectSize = [0, 0, _options.minSize[0], _options.minSize[1]];
            }
            return _options;
        },

        //裁剪的插件初始化
        jcropInit: function (imgSrc, jcropOptions, callbackFun) {
            var _this = this,
                showCallbackFun = function (dialog) {
                    _this.bindJcropDialogEvent(dialog, jcropOptions, callbackFun);
                };
            if (top && top.location != location && top.site && top.site.requireAMD) {
                top.site.requireAMD(["jquery.Jcrop"], function () {
                    _this.jcropShowDialog(imgSrc, jcropOptions, showCallbackFun);
                });
            } else {
                require(["jquery.Jcrop"], function () {
                    _this.jcropShowDialog(imgSrc, jcropOptions, showCallbackFun);
                });
            }
        },

        //显示裁剪的操作弹窗
        jcropShowDialog: function (imgSrc, jcropOptions, showCallbackFun) {
            var html = ['<div class="mb10">',
                '<label' + (jcropOptions.isNotCrop ? 'class="hidden"' : '') + '><input type="checkbox" name="isCut" checked="checked" class="ace"><span class="lbl padding-2 red">使用裁剪（动态gif图片时建议勾选）</span></label>',
    			'</div>',
    			'<img class="preview-image" src="' + imgSrc + '" >',
    			'<div class="cut-preview-panel" style="width:' + jcropOptions.previewImgSize.w + 'px; height: ' + jcropOptions.previewImgSize.h + 'px">',
    			'	<img src="' + imgSrc + '">',
        		'</div>'].join("\n");
            site.modal.dialog({
                width: "1100px",
                height: "700px",
                title: "图片裁剪",
                message: html,
                onShow: showCallbackFun,
                animate: false,
                buttons: {
                    save: {
                        label: "上传",
                        className: "btn-primary"
                    },
                    cancel: {
                        label: "取消",
                        className: "btn-default"
                    }
                }
            });
        },

        //绑定裁剪弹窗的事件
        bindJcropDialogEvent: function (dialog, jcropOptions, callbackFun) {
            var _this = this,
                _$saveButton = dialog.find("button[data-bb-handler='save']"),
                preview_image_size = {w: dialog.find("div.cut-preview-panel").width(), h: dialog.find("div.cut-preview-panel").height()}, 
			    img_panel_size = {w: dialog.find("img.preview-image").width(), h: dialog.find("img.preview-image").height()};
			    //ratioW = options.width/dialog.find("img.preview-image").prop('width'), 
			    //ratioH = options.height/dialog.find("img.preview-image").prop('height');
            dialog.find("img.preview-image").Jcrop({
                allowResize: jcropOptions.allowResize, //允许选框缩放
                allowSelect: false, //允许新选框
                maxSize: jcropOptions.maxSize, //选框最大尺寸[0,0]
                minSize: jcropOptions.minSize, //选框最小尺寸[0,0]
                onChange: function(coordinate){
                    dialog.find("div.cut-preview-panel > img").css(_this.jcropChangePreview(coordinate, img_panel_size, preview_image_size));
                },
                onSelect: function(coordinate){
                    dialog.find("div.cut-preview-panel > img").css(_this.jcropChangePreview(coordinate, img_panel_size, preview_image_size));
                }
            }, function () {
                var _jcrop = this, _default_coordinate = jcropOptions.deaultsSelectSize;
                //如果没有指定图片的尺寸就默认选中图片原有尺寸的0.75
                this.animateTo(_default_coordinate);
                //绑定保存按钮事件
                _$saveButton.on("click", function(events){
                    var formParamerters = {};
                    formParamerters.isCut = (dialog.find("input[name='isCut']").length > 0) ? dialog.find("input[name='isCut']").prop("checked") : false;
                    if(formParamerters.isCut){
                        formParamerters.imageX = _jcrop.tellSelect().x;
                        formParamerters.imageY = _jcrop.tellSelect().y;
                        formParamerters.imageW = _jcrop.tellSelect().w;
                        formParamerters.imageH = _jcrop.tellSelect().h;
                    }
                    callbackFun(formParamerters);
                });
                if (dialog.find("input[name='isCut']").length > 0) {
                    var cutRadioElement = dialog.find("input[name='isCut']");
                    //设置默认选中坐标
                    cutRadioElement.data("coordinate", _default_coordinate);
                    //绑定复选按钮事件
                    dialog.find("input[name='isCut']").on("click", function (events) {
                        //site.BDWebUpload.jcrop.cutEvent(_this, $(this));
                        if ($(this).prop("checked")) {
                            _jcrop.enable();
                            _jcrop.animateTo($(this).data("coordinate"));
                        } else {
                            var tellSelect = _jcrop.tellSelect();
                            cutRadioElement.data("coordinate", [tellSelect.x, tellSelect.y, tellSelect.x2, tellSelect.y2]);
                            _jcrop.release();
                            _jcrop.disable();
                        }
                    });
                }
            });
        },

        //上传
        upload: function (webUploader, file, jcropParameters, scale) {
            if (jcropParameters.isCut) {
                //formParamerters
                webUploader.options.formData = $.extend({}, webUploader.options.formData, {
                    isCut: jcropParameters.isCut,
                    imageX: jcropParameters.imageX / scale,
                    imageY: jcropParameters.imageY / scale,
                    imageW: jcropParameters.imageW / scale,
                    imageH: jcropParameters.imageH / scale,
                });
            } else {
                webUploader.options.formData.isCut = false;
            }
            webUploader.upload(file);
        },

        //变换裁剪的图片
        jcropChangePreview: function (coordinate, img_panel_size, preview_image_size) {
            return {
                width: Math.round(img_panel_size.w * preview_image_size.w / coordinate.w) + 'px',
                height: Math.round(img_panel_size.h * preview_image_size.h / coordinate.h) + 'px',
                marginLeft: '-' + Math.round(preview_image_size.w * coordinate.x / coordinate.w) + 'px',
                marginTop: '-' + Math.round(preview_image_size.h * coordinate.y / coordinate.h) + 'px'
            };
        },

        //获取图片的正确尺寸
        getSuitableImgSize: function (maxWidth, maxHeight, imageOriginalWidth, imageOriginalHeight) {
            var w = 0, h = 0;
            if (imageOriginalWidth < maxWidth && imageOriginalHeight < maxHeight) {
                w = imageOriginalWidth;
                h = imageOriginalHeight;
            } else if ((imageOriginalWidth / imageOriginalHeight) > (maxWidth / maxHeight)) {
                w = maxWidth;
                h = (w * imageOriginalHeight) / imageOriginalWidth;
            } else {
                h = maxHeight;
                w = (h * imageOriginalWidth) / imageOriginalHeight;
            }
            return { width: w, height: h };
        },

        validateImageSize: function (options, file) {
            var imageFactSize = { width: file._info.width, height: file._info.height }, //图片的实际上传尺寸
                imageRequireSize = { width: options.width, height: options.height }, //图片的要求尺寸
                imageMinSize = { width: options.minWidth, height: options.minHeight },//图片的最小尺寸
                imageMaxSize = { width: options.maxWidth, height: options.maxHeight };//图片的最大尺寸
            if (options.crop != false) {
                if ((imageRequireSize.width && imageFactSize.width < imageRequireSize.width) || (imageRequireSize.height && imageFactSize.height < imageRequireSize.height)) {
                    return "图片尺寸太小!";
                }
                if ((imageMinSize.width && imageFactSize.width < imageMinSize.width) || (imageMinSize.height && imageFactSize.height < imageMinSize.height)) {
                    return "图片尺寸太小!";
                }
            } else {
                if ((imageMaxSize.width && imageMaxSize.width < imageFactSize.width) || (imageMaxSize.height && imageMaxSize.height < imageMaxSize.height)) {
                    return '上传图片的尺寸太大。';
                }
                if ((imageRequireSize.width && imageRequireSize.width > imageFactSize.width) || (imageRequireSize.height && imageRequireSize.height > imageFactSize.height)) {
                    return '上传图片的尺寸太小。';
                }
                if ((imageRequireSize.height && imageRequireSize.height != imageFactSize.height) || (imageRequireSize.width && imageRequireSize.width != imageFactSize.width)) {
                    return ('上传图片的尺寸不正确，应该是：' + imageRequireSize.width + '*' + imageRequireSize.height);
                }
            }
            return null;
        },

        //单个图片事件绑定
        simgleImgBindEvent: function () {
            if ($(".cover-area").length > 0) {
                $(".cover-area").find(".upload-delete-btn").on("click", function () {
                    $(this).prev("img").attr("src", site.config.contextPath + "/images/no-img.jpg");
                    $(".cover-area").find("input[data-name='uploadImg']").val();
                });
            }
        }
    }

    return {
        //单个图片上传
        /** 
            parameters: 
                options:{
                    server：xxx, //上传文件服务地址
                    pickId：xxx, 指定选择文件的按钮容器，不指定则不创建按钮。注意 这里虽然写的是 id, 但是不是只支持 id, 还支持 class, 或者 dom 节点。
                    crop:xxx, //是否需要用户剪切图片
                    thumbWidth: xx, //缩略图的宽度
                    thumbHeight: xxx, //缩略图的高度
                    maxWidth: xxx, //指定上传图片的最大宽度如果超过该宽度没有用指定用剪切就不允许上传，如果不指定默认上传的图片超过1920会在前端被压缩后上传到服务
                    maxHeight:xxx, //同上
                    minWidth: xxx, //指定上传图片的最小宽度如果低于该宽度不允许上传，如果不指定默认上传的图片最小宽度是320但不会去验证
                    minHeight: xxx,//同上
                    width: xxx, //指定上传图片的宽度如果超过或小于该宽度没有用指定用剪切就不允许上传
                    height: xxx,//同上
                    fileQueued： function(){},// 当有文件添加进来的时候
                    uploadProgress: function(){},// 当有文件上传过程中的时候
                    uploadSuccess: function(){},// 当上传成功的时候
                    uploadError: function(){},// 当上传失败的时候
                    uploadComplete: function(){}// 当上传完成时候
                    bindUploaderEvent: function(){} //用户自定义绑定事件
                } 
        **/
        singleImageUpload: function (options) {
            var _options = controler.initImgOptons(options);
            this.webUploader = webuploader.create(_options);
            controler.bindUploaderEvent(this.webUploader, options);
            controler.simgleImgBindEvent();
            if ($(".cover-area").length > 0 && $(".cover-area").find("input[data-name='uploadImg']").val()) {
                $(".cover-area").find("img").attr("src", site.config.resourecePath + $(".cover-area").find("input[data-name='uploadImg']").val());
            }
        },

        //多个图片上传
        multipleImageUpload: function(options) {
            var _defaults = {
                auto: true,
                pick: {
                    multiple: true
                },
                formData: {
                    isCut: false
                }
            }
        }
    };
});