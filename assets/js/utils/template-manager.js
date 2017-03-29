/**
 * 作者：yujinjin9@126.com
 * 时间：2015-03-06
 * 描述：app 模板管理工具类
 */
define(["juicer"], function() {
	var service = {
		init: function() {
			
			juicer.set({
				'tag::operationOpen': '{`', //TMD，用"~,^"等字符在else中会解析出错，因为这个是作为特殊字符的，这个BUG找了半天才定位到
				'tag::operationClose': '}',
				'tag::interpolateOpen': '${',
				'tag::interpolateClose': '}',
				'tag::noneencodeOpen': '$${',
				'tag::noneencodeClose': '}',
				'tag::commentOpen': '{#',
				'tag::commentClose': '}'
			});
			this.registerConvertDate();
			this.registerInterceptCharacter();
			this.registerResource();
			this.registerInnerResource();
		},

		//注册日期转换函数
		registerConvertDate: function() {
			juicer.register('convertDate', function(dateStr, dateFormat) {
				if(!dateStr) {
					return "";
				}
				if(!dateFormat) {
					dateFormat = "yyyy-MM-dd";
				}
				dateStr = dateStr.replace(/-/g, "/");
				var date = new Date(dateStr);
				return date.Format(dateFormat);
			});
		},

		//生成全路径的资源
		registerResource: function() {
			juicer.register('resource', function(resourceUrl) {
				if(!resourceUrl) {
					return "";
				}
				return site.config.resourecePath + resourceUrl;
			});
		},

		//生成站内路径的资源
		registerInnerResource: function() {
			juicer.register('innerResource', function(resourceUrl) {
				if(!resourceUrl) {
					return "";
				}
				return site.config.contextPath + resourceUrl;
			});
		},

		//定义模板截取字符串函数
		registerInterceptCharacter: function() {
			juicer.register('interceptCharacter', function() {
				var character = null;
				//截取长度，默认是4个
				var _intercept_length = 4;
				//字体超出固定长度变省略号
				var _ellips_char = null;
				//截取字符串的方向
				var direction = "left";
				try {
					if(arguments.length == 1) {
						character = arguments[0];
					} else if(arguments.length == 2) {
						character = arguments[0];
						_intercept_length = parseInt(arguments[1], 10);
					} else if(arguments.length == 3) {
						character = arguments[0];
						_intercept_length = parseInt(arguments[1], 10);
						_ellips_char = arguments[2];
					} else if(arguments.length == 4) {
						character = arguments[0];
						_intercept_length = parseInt(arguments[1], 10);
						_ellips_char = arguments[2];
						direction = arguments[3];
					}
				} catch(e) {
					_intercept_length = 4;
				}
				_intercept_length += _intercept_length;
				var substr = "";
				if(character && _intercept_length > 0) {
					//character = character.replace(/(^\s*)|(\s*$)/g, "");
					if(direction === 'left') {
						var _is_ellips = false;
						for(var i = 0; i < character.length; i++) {
							if(character.charCodeAt(i) > 255) {
								_intercept_length -= 2;
							} else {
								--_intercept_length;
							}
							if(_intercept_length < 0) {
								_is_ellips = true;
								break;
							}
							substr += character.charAt(i);
						}
						if(_ellips_char && _is_ellips) {
							substr = substr + _ellips_char;
						}
					} else if(direction === 'right') {
						var _is_ellips = false;
						for(var i = character.length - 1; i >= 0; i--) {
							if(character.charCodeAt(i) > 255) {
								_intercept_length -= 2;
							} else {
								--_intercept_length;
							}
							if(_intercept_length < 0) {
								_is_ellips = true;
								break;
							}
							substr = character.charAt(i) + substr;
						}
						if(_ellips_char && _is_ellips) {
							substr = _ellips_char + substr;
						}
					}
				}
				return substr;
			});
		},
	}

	var templateManager = {
		// 加载页面模板
		loadTpl: function(tpl) {
			if(tpl) {
				$.get(tpl, function(tplContent) {
					$('body').append(tplContent);
				});
			}
		},

		//获取模板数据
		loadTemplate: function(id) {
			var template = $('#' + id).html();
			return template;
		},

		//根据模板ID渲染数据
		renderTemplateById: function(templateId, renderData) {
			if(!templateId) {
				return "";
			}
			var markup = this.loadTemplate(templateId);
			var compiledTemplate = juicer(markup);
			var output = compiledTemplate.render(renderData);
			return output;
		},

		//直接渲染数据
		renderTemplate: function(templateHtml, renderData) {
			var compiledTemplate = juicer(templateHtml);
			var output = compiledTemplate.render(renderData);
			return output;
		}
	};
	service.init();
	return templateManager;
});